/**
 * Data entry is an essential part of the final application that will be built, and it must be built in
 * a way which permits dynamic addition and removal of form elements.  Since Angular makes modularity
 * insanely easy and you can build custom input selectors, this shouldn"t require too much code.
 */
import {Component, forwardRef} from "@angular/core";
import { Variant, VariantReference } from "../genomic-data";
import { VariantSelectorService } from "./variant-selector.service";
import { SMARTClient } from "../../smart-initialization/smart-reference.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export const SELECTOR_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VariantSelectorComponent),
  multi: true
};

@Component({
  selector: "variant-selector",
  template: `
    <!-- Gene Variation List -->
    <div>
      <filterable-search [searchService]="selectorService" [placeholderString]="'Search Variants'" [ngModel]="currentlySelected" (ngModelChange)="onNewReferenceSelection($event)"></filterable-search>
    </div>
  `,
  styles: [`
    div {
      height: 100%;
    }
  `],
  providers: [SELECTOR_CONTROL_VALUE_ACCESSOR]
})
export class VariantSelectorComponent implements ControlValueAccessor {
  constructor(public selectorService: VariantSelectorService) {}

  submitStatus: string = "";

  // The internal data model (for ngModel)
  _currentlySelected: Variant;
  get currentlySelected(): Variant {
    return this._currentlySelected;
  }
  set currentlySelected(v: Variant) {
    if (v !== this.currentlySelected) {
      this._currentlySelected = v;
      this.onChangeCallback(v);
    }
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.currentlySelected) {
      this.currentlySelected = value;
    }
  }

  // Placeholders for the callbacks which are later providesd by the Control Value Accessor
  private onTouchedCallback: () => void = () => {};
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  private onChangeCallback: (_: any) => void = () => {};
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // Update the EHR item (if possible) and change the variant.
  onNewReferenceSelection(reference: VariantReference) {
    console.log("Would get by reference ", reference);
    this.selectorService.getByReference(reference)
      .subscribe(resultingVariant => {
        this.currentlySelected = resultingVariant;
        this.saveFHIRResource();
      });
  }

  
  saveFHIRResource() {
    if (!this.currentlySelected) {
      return;
    }

    SMARTClient.subscribe(smartClient => {
      smartClient.patient.read().then((p) => {
        const dataToTransmit = {
          "resource": {
            "resourceType": "Observation",
            "id": "SMART-Observation-" + p.identifier[0].value + "-variation-" + this.currentlySelected.hgvsID.replace(/[.,\/#!$%\^&\*;:{}<>=\-_`~()]/g, ""),
            "meta": {
              "versionId": "1" // ,
              // "lastUpdated": Date.now().toString()
            },
            "text": {
              "status": "generated",
              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Variation at " + this.currentlySelected.getLocation() + "</div>"
            },
            "status": "final",
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsGene",
                "valueCodeableConcept": {
                  "coding": [
                    {
                      "system": "http://www.genenames.org",
                      "code": "12014",
                      "display": "TPMT"
                    }
                  ]
                }
              }
            ],
            "category": [
              {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/observation-category",
                    "code": "genomic-variant",
                    "display": "Genomic Variant"
                  }
                ],
                "text": "Genomic Variant"
              }
            ],
            "code": {
              "coding": [
                {
                  "system": "http://www.hgvs.org",
                  "code": this.currentlySelected.hgvsID,
                  "display": this.currentlySelected.hgvsID
                }
              ],
              "text": this.currentlySelected.hgvsID
            },
            "subject": {
              "reference": "Patient/" + p.id
            },
            // "effectiveDateTime": Date.now().toString(),
            // "valueQuantity": {
            //   "value": 41.1,
            //   "unit": "weeks",
            //   "system": "http://unitsofmeasure.org",
            //   "code": "wk"
            // },
            // "context": {}
          }
        };

        console.log("Updating data with ", dataToTransmit);
        this.submitStatus = "Submitting...";
        smartClient.api.update(dataToTransmit)
          .then(result => {
            console.log("Success:", result);
            this.submitStatus = "Complete!";
            setTimeout(() => { this.submitStatus = "Submit Data to EHR"; }, 1000);
          })
          .fail(err => {
            console.log("Error:", err);
            this.submitStatus = "Error";
            setTimeout(() => { this.submitStatus = "Submit Data to EHR"; }, 1000);
            });
      });
    });
  }
}
