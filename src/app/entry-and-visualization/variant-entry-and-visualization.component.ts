import { Component, OnInit } from "@angular/core";
import { Variant } from "./genomic-data";
import { SMARTClient } from "../smart-initialization/smart-reference.service";
import { VariantSelectorService } from "./variant-selector/variant-selector.service";
import { trigger, state, style, animate, transition } from "@angular/animations";
import {Router} from "@angular/router";

class VariantWrapper {
  constructor(_index: number, _variant: Variant) {
    this.index = _index;
    this.variant = _variant;
    this.drawerState = "closed";
  }

  variant: Variant;
  index: number;
  drawerState: string; // Open or closed.

  public toggleDrawer = () => {
    this.drawerState = this.drawerState === "closed" ? "open" : "closed";
  }
}


// Todo: Fix LAMA2 gene (error upon selection).
@Component({
  selector: "variant-entry-and-visualization",
  template: `
    <div id="variantVisualizations">
      <div id="suggestEHRLink" *ngIf="offerToLinkToEHRInstructions">
        <img src="/assets/info-icon.png">
        <p class="thinFont1">You don't seem to be connected to an EHR!  <a href="javascript:void(0)" (click)="routeToInstructions()">Learn how here.</a></p>
        <button class="btn btn-danger" (click)="offerToLinkToEHRInstructions = false">X</button>
      </div>

      <div id="patientInfo" *ngIf="patientExists" [style.background-color]="patientObject.gender === 'male' ? 'rgba(118, 218, 255, 0.76)' : 'rgba(255, 192, 203, 0.76)'">
        <img [src]="patientObject.gender === 'male' ? '/assets/male-icon.png' : '/assets/female-icon.png'">
        <table class="thinFont2" style="border: 0;">
          <tr>
            <td><b>Name:</b> {{patientObject.name[0].given[0]}} {{patientObject.name[0].family}}</td>
          </tr>
          <tr>
            <td><b>Lives in:</b> {{patientObject.address[0].country}}</td>
            <td><b>Age:</b> {{patientAge}}</td>
          </tr>
        </table>
      </div>
      
      <div class="variantWrapper" *ngFor="let variant of variants; let i = index">
        <div class="variantSelector">
          <div [style.width]="i === variants.length - 1 ? '100%' : 'calc(100% - 38px)'">
            <variant-selector [ngModel]="variant.variant" (ngModelChange)="variant.variant = $event; addRowMaybe(i); saveEHRVariant(variant.variant);"></variant-selector>
          </div>
          <button class="removeRowButton btn btn-danger" (click)="removeRow(i)" *ngIf="i !== variants.length - 1">X</button>
        </div>
        <div>
          <div class="visualizationContent" [@drawerAnimation]="variant.drawerState">
            <variant-visualization [(ngModel)]="variant.variant"></variant-visualization>
          </div>
          <div *ngIf="variant.variant !== undefined && variant.variant !== null" class="informationToggle" (click)="variant.toggleDrawer()">
            <img src="/assets/dropdown.svg">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    p {
      margin: 0;
    }

    #variantVisualizations {
      padding: 15px;
    }

    .variantWrapper {
      margin-bottom: 5px;
    }

    .variantSelector {
      height: 38px;
    }

    .variantSelector > * {
      float: left;
      height: 100%;
    }

    .removeRowButton {
      width: 38px;
      font-size: 20px;
      color: white;
      padding: 0;
    }

    .informationToggle {
      width: 100%;
      background-color: #e2e2e2;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      text-align: center;
      height: 30px;
    }

    .visualizationContent {
      overflow: scroll;
    }

    .informationToggle:hover {
      background-color: #b2b2b2;
    }

    .informationToggle img {
      height: 10px;
      width: 10px;
      margin: 10px;
    }

    #suggestEHRLink {
      display: flex;
      justify-content: center;
      align-items: center;

      height: 150px;
      width: 100%;

      background-color: rgba(255, 163, 8, 0.52);

      border-radius: 20px;
      overflow: hidden;

      margin-bottom: 20px;
    }

    #suggestEHRLink img {
      width: 13%;
      height: auto;
      margin: 1%;
    }

    #suggestEHRLink p {
      width: calc(83% - 100px);
      margin: 1%;
      font-size: 30px;
      color: black;
    }

    #suggestEHRLink button {
      width: 100px;
      height: 100px;
      color: white;
      border-radius: 20px;
      font-size: 50px;
    }

    #patientInfo {
      display: flex;
      justify-content: center;
      align-items: center;

      height: 150px;
      width: 100%;

      border-radius: 20px;
      overflow: hidden;

      margin-bottom: 20px;
      
      text-align: center;
    }

    #patientInfo img {
      width: 100px;
      height: 100px;
      margin: 1%;
    }

    #patientInfo table {
      width: calc(96% - 100px);
      margin: 1%;
      font-size: 30px;
      color: black;
    }
  `],
  animations: [
    trigger("drawerAnimation", [
      state("closed", style({
        height: "0"
      })),
      state("open", style({
        height: "700px"
      })),
      transition("closed => open", animate("400ms ease-in-out")),
      transition("open => closed", animate("400ms ease-in-out"))
    ])
  ]
})
export class VariantEntryAndVisualizationComponent implements OnInit {
  constructor (private selectorService: VariantSelectorService, private router: Router) {}

  variants: VariantWrapper[] = [];
  offerToLinkToEHRInstructions = true;
  patientExists = false;
  patientObject: any = null;
  patientAge: number = -1;

  ngOnInit() {
    this.addRow();

    SMARTClient.subscribe(smartClient => {
      if (smartClient === null) {
        return;
      }

      this.offerToLinkToEHRInstructions = false;

      smartClient.patient.read().then(p => {
        console.log("Patient read is ", p);
        this.patientObject = p;
        if (p.birthDate) {
          const birthDateValues = p.birthDate.split("-");
          const timeDiff = Math.abs(Date.now() - new Date(parseInt(birthDateValues[0]), parseInt(birthDateValues[1]), parseInt(birthDateValues[2])).getTime());
          // Used Math.floor instead of Math.ceil so 26 years and 140 days would be considered as 26, not 27.
          this.patientAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
        }
        this.patientExists = true;
      });

      smartClient.patient.api.search({type: "Observation", query: {"category": "genomic-variant"}, count: 10})
        .then(results => {
          console.log("Successfully got variants!", results);

          if (!results.data.entry) {
            return;
          }

          if (results.data.entry.length > 0) {
            this.removeRow(0); // Start at the first index if we find other variants.
          }

          // For every variant.
          let resultIndex = 0;
          for (const result of results.data.entry) {
            console.log("Will now add " + result.resource.code.text);
            this.selectorService.search(result.resource.code.text).subscribe(variants => {
              if (variants.length === 0) {
                console.log("NOT GOOD: Couldn't find any search results for " + result.resource.code.text);
                return;
              }

              // Add the first search result to the list (the one with the correct HGVS ID).
              console.log("Adding", variants[0]);

              this.selectorService.getByReference(variants[0])
                .subscribe(variant => {
                  const newWrapper = new VariantWrapper(resultIndex, variant);
                  if (this.variants.length === resultIndex) {
                    this.variants.push(newWrapper);
                  } else {
                    this.variants[resultIndex] = newWrapper;
                  }
                  resultIndex++;
                });
            });
          }
        })
        .fail(err => {
          console.log("Couldn't query genomic variants error!" + err);
        });
    });
  }

  // Row management.
  addRow() {
    this.variants.push(new VariantWrapper(this.variants.length, null));
  }
  addRowMaybe(indexInQuestion: number) {
    if (this.variants.length === indexInQuestion + 1) {
      this.addRow();
    }
  }

  removeRow(index: number) {
    const variantToRemove = this.variants[index].variant;

    this.variants.splice(index, 1);

    for (let i = 0; i < this.variants.length; i++) {
      this.variants[i].index = i;
    }

    this.removeEHRVariant(variantToRemove);
  }

  removeAlert() {
    this.offerToLinkToEHRInstructions = false;
  }

  routeToInstructions() {
    this.router.navigate(["ehr-link"]);
  }

  // Remove and save EHR variants.
  saveEHRVariant(variant: Variant) {
    SMARTClient.subscribe(smartClient => {
      if (smartClient === null) {
        return;
      }

      smartClient.patient.read().then((p) => {
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

        console.log("Adding variant with", dataToTransmit);
        smartClient.api.update(dataToTransmit)
          .then(result => {
            console.log("Added EHR variant successfully!", result);
          })
          .fail(err => {
            console.log("Failed to add EHR variant", err);
          });
      });
    });
  }

  removeEHRVariant(variant: Variant) {
    SMARTClient.subscribe(smartClient => {
      if (smartClient === null) {
        return;
      }

      smartClient.patient.read().then((p) => {
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

        console.log("Removing variant with", dataToTransmit);
        smartClient.api.delete(dataToTransmit)
          .then(result => {
            console.log("Removed EHR variant successfully!", result);
          })
          .fail(err => {
            console.log("Failed to remove EHR variant", err);
          });
      });
    });
  }
}
