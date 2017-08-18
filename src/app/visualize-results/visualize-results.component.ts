/**
 * Wrapper class of tabs for a bunch of post- data-entry components (Clinical Trials, etc.)
 */

import { Component, OnInit } from "@angular/core";
import {Gene, Variant} from "../global/genomic-data";
import { USER_SELECTED_VARIANTS } from "../data-entry/data-entry.component";
import { SMARTClient } from "../smart-initialization/smart-reference.service";
import { DrugReference } from "./drugs/drug";

@Component({
  selector: "visualize-results",
  template: `
    <h2 class="display-2">Results</h2>
    <ngb-accordion #acc="ngbAccordion">
      <ngb-panel *ngFor="let variant of variants" title="{{variant.optionName()}}">
        <ng-template ngbPanelContent>
          <ngb-tabset [destroyOnHide]="false">
            <ngb-tab title="Gene">
              <ng-template ngbTabContent>
                <gene-visualization [gene]="variant.origin"></gene-visualization>
              </ng-template>
            </ngb-tab>

            <ngb-tab title="Variant">
              <ng-template ngbTabContent>
                <variant-visualization [variant]="variant"></variant-visualization>
              </ng-template>
            </ngb-tab>

            <ngb-tab title="Clinical Trials">
              <ng-template ngbTabContent>
                <clinical-trials [forVariant]="variant"></clinical-trials>
              </ng-template>
            </ngb-tab>
          </ngb-tabset>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>

    <button type="button" class="btn btn-success" style="float: right" (click)="saveVariantsToFHIRPatient()">{{submitStatus}}</button>
  `,
  styles: [`    
  `]
})
export class VisualizeResultsComponent implements OnInit {
  variants: Variant[] = [];
  submitStatus: string = "Submit Data to EHR";

  ngOnInit() {
    if (!USER_SELECTED_VARIANTS) {
      return;
    }
    USER_SELECTED_VARIANTS.subscribe(variants => this.variants = variants);
  }

  saveVariantsToFHIRPatient() {
    if (!(this.variants && this.variants.length > 0)) {
      console.log("Can't save an empty array of variants :P");
      return;
    }

    SMARTClient.subscribe(smartClient => {
      smartClient.patient.read().then((p) => {
        for (const variant of this.variants) {
          const dataToTransmit = {
            "resource": {
              "resourceType": "Observation",
              "id": "SMART-Observation-" + p.identifier[0].value + "-variation-" + variant.hgvsID.replace(/[.,\/#!$%\^&\*;:{}<>=\-_`~()]/g, ""),
              "meta": {
                "versionId": "1" // ,
                // "lastUpdated": Date.now().toString()
              },
              "text": {
                "status": "generated",
                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Variation at " + variant.getLocation() + "</div>"
              },
              "status": "final",
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
                    "code": variant.hgvsID,
                    "display": variant.hgvsID
                  }
                ],
                "text": variant.hgvsID
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
        }
      });
    });
  }
}
