import { Component, OnInit } from "@angular/core";
import { Variant } from "./genomic-data";
import { SMARTClient } from "../../smart-initialization/smart-reference.service";
import { VariantSelectorService } from "./variant-selector/variant-selector.service";
import { trigger, state, style, animate, transition } from "@angular/animations";
import {Router} from "@angular/router";
import {FeedbackFormModalComponent} from "../feedback-form/feedback-form-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {isNullOrUndefined} from "util";

class VariantWrapper {
  constructor(_index: number, _variant: Variant) {
    this.index = _index;
    this.variant = _variant;
    this.drawerState = "closed";
    this.saved = false;
  }

  variant: Variant;
  index: number;
  drawerState: string; // Open or closed.
  saved: boolean;

  public toggleDrawer = () => {
    this.drawerState = this.drawerState === "closed" ? "open" : "closed";
  }
}

@Component({
  selector: "variant-entry-and-visualization",
  template: `
    <div id="patientLinkState">
      <!-- If an EHR link is NOT detected -->
      <div id="suggestEHRLink" *ngIf="offerToLinkToEHRInstructions">
        <div id="suggestions">
          <img src="/assets/entry-and-visualization/info-icon.png">
          <p class="thinFont1">You don't seem to be connected to an EHR! <a href="javascript:void(0)" (click)="routeToInstructions()">Learn how here.</a></p>
        </div>
        <button class="btn btn-danger" (click)="offerToLinkToEHRInstructions = false">X</button>
      </div>

      <!-- If an EHR link is detected -->
      <div id="patientInfo" *ngIf="patientExists" [style.background-color]="patientObject['gender'] === 'male' ? '#27384f' : '#ff45f7'">
        <img [src]="patientObject['gender'] === 'male' ? '/assets/entry-and-visualization/male-icon.png' : '/assets/entry-and-visualization/female-icon.png'">

        <!-- Patient Details -->
        <p style="color: white">
          <b>Name: </b> {{patientObject['name'][0].given[0]}} {{patientObject['name'][0].family}} | 
          <b>{{patientObject['active'] ? 'Lives in' : 'Lived in'}}:</b> {{patientObject['address'][0].country}} | <b>Age:</b> {{patientAge}} | 
          <b>Condition:</b> 
          <select style="font-size: 15px;">
            <option *ngFor="let condition of patientConditions">{{condition}}</option>
          </select>
        </p>

        <div id="autosyncToggle">
          <div>
            <ui-switch [ngModel]="autosync" (ngModelChange)="onToggleAutosync($event)"></ui-switch>
            <p class="thinFont1" style="color: white">Auto-Sync</p>
          </div>
        </div>
      </div>
    </div>

    <div id="variantVisualizations">
      <div class="variantWrapper" *ngFor="let variant of variants; let i = index">
        <div class="variantSelector">
          <div [style.width]="i === variants.length - 1 ? '100%' : 'calc(100% - 38px)'">
            <variant-selector [ngModel]="variant.variant"
                              (ngModelChange)="variant.variant = $event; addRowMaybe(i); saveEHRVariant(variant);"></variant-selector>
          </div>
          <button class="removeRowButton btn btn-danger" (click)="removeRow(i)" *ngIf="i !== variants.length - 1">X
          </button>
        </div>
        <div>
          <div class="visualizationContent" [@drawerAnimation]="variant.drawerState">
            <variant-visualization [(ngModel)]="variant.variant"></variant-visualization>
          </div>
          <div *ngIf="variant.variant !== undefined && variant.variant !== null" class="informationToggle"
               (click)="variant.toggleDrawer()">
            <img src="/assets/entry-and-visualization/dropdown.svg">
          </div>
        </div>
      </div>
    </div>

    <!-- Review form question -->
    <div id="askForReviewDiv" *ngIf="userInteractionPoints >= 3 && askForReview">
      <a href="javascript:void(0)" (click)="openFeedbackForm()">
        <ngb-alert [type]="'primary'" (close)="askForReview = false">Please review our service!</ngb-alert>
      </a>
    </div>
  `,
  styles: [`
    p {
      margin: 0;
    }

    #patientLinkState {
      margin-left: 6%;
      margin-right: 6%;
    }

    #suggestEHRLink {
      height: 80px;
      width: 100%;

      background-color: rgb(255, 189, 44);
      overflow: hidden;
    }

    #suggestEHRLink > * {
      float: left;
    }

    #suggestEHRLink > #suggestions {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% - 60px);
      height: 100%;
    }

    #suggestEHRLink img {
      width: 60px;
      height: 60px;
      margin: 1% 10px;
    }

    #suggestEHRLink p {
      width: calc(96% - 80px);
      margin: 1%;
      font-size: 20px;
      color: black;
    }

    #suggestEHRLink button {
      width: 60px;
      height: 30px;
      color: white;
      font-size: 15px;
      border-radius: 0;
      padding: 0;
    }

    #patientLinkState > div {
      border-bottom-left-radius: 30px;
      border-bottom-right-radius: 30px;
    }

    #patientInfo {
      display: flex;
      justify-content: center;
      align-items: center;

      height: 80px;
      width: 100%;

      overflow: hidden;

      text-align: center;
    }

    #patientInfo img {
      width: 60px;
      height: 60px;
      margin: 10px;
    }

    #patientInfo p {
      width: calc(96% - 280px);
      margin: 1%;
      font-size: 20px;
      color: black;
    }
    
    #autosyncToggle {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 200px;
      height: 100%;
    }

    #autosyncToggle > div {
      width: 100%;
    }

    #autosyncToggle > div > p {
      width: 100%;
    }

    #variantVisualizations {
      padding: 15px;
      margin-top: 2%;
      margin-left: 4%;
      margin-right: 4%;
      background-color: white;
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

    #askForReviewDiv {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
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
  constructor (private selectorService: VariantSelectorService, private router: Router, private modalService: NgbModal) {}

  // This is what we're using to determine whether the user is worthy to rate our service (has interacted enough with the service).
  userInteractionPoints: number = 0;
  askForReview: boolean = true;

  variants: VariantWrapper[] = [];

  offerToLinkToEHRInstructions = true;
  patientExists = false;
  patientObject: Object = null;
  patientAge: number = -1;
  patientConditions: string[] = [];

  // Toggled by the user depending on whether they want to sync to the EHR their changes right away (as soon as they make them)
  autosync: boolean = true;

  ngOnInit() {
    this.addRow();

    // As soon as the smart client is loaded from the SMART JS library, this creates the patient info header and populates the patient variants.
    SMARTClient.subscribe(smartClient => {
      if (smartClient === null) {
        return;
      }

      this.offerToLinkToEHRInstructions = false;

      // Get all patient information.
      smartClient.patient.read().then(p => {
        console.log("Patient read is ", p);
        this.patientObject = p;
        if (p.birthDate && p.active) {
          const birthDateValues = p.birthDate.split("-");
          const timeDiff = Math.abs(Date.now() - new Date(parseInt(birthDateValues[0]), parseInt(birthDateValues[1]), parseInt(birthDateValues[2])).getTime());
          // Used Math.floor instead of Math.ceil so 26 years and 140 days would be considered as 26, not 27.
          this.patientAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
        }
        this.patientExists = true;
      });

      // Get all genomic variants attached to this patient.
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
          console.log("Couldn't query genomic variants error!", err);
        });

      smartClient.patient.api.search({type: "Condition"})
        .then(results => {
          console.log("Got patient conditions:", results);

          if (!isNullOrUndefined(results.data.entry) && results.data.entry.length > 0) {
            for (const entry of results.data.entry) {
              if (!isNullOrUndefined(entry.resource)) {
                if (!isNullOrUndefined(entry.resource.code)) {
                  if (!isNullOrUndefined(entry.resource.code.text)) {
                    this.patientConditions.push(entry.resource.code.text);
                    console.log("Added " + entry.resource.code.text);
                  }
                }
              }
            }
          }
        })
        .fail(err => {
          console.log("The query for patient conditions failed!", err);
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

    this.userInteractionPoints++;
  }
  removeRow(index: number) {
    const variantToRemove = this.variants[index].variant;

    this.variants.splice(index, 1);

    for (let i = 0; i < this.variants.length; i++) {
      this.variants[i].index = i;
    }

    this.removeEHRVariant(variantToRemove);

    this.userInteractionPoints++;
  }

  routeToInstructions() {
    this.router.navigate(["ehr-link"]);
  }

  onToggleAutosync(newVal: boolean) {
    this.autosync = newVal;

    if (this.autosync) {
      for (const variant of this.variants) {
        if (!variant.saved) {
          this.saveEHRVariant(variant);
        }
      }
    }
  }

  openFeedbackForm() {
    this.modalService.open(FeedbackFormModalComponent, {size: "lg"});
    this.askForReview = false;
  }

  // Remove and save EHR variants.
  saveEHRVariant(variant: VariantWrapper) {
    if (!this.autosync) {
      return;
    }

    SMARTClient.subscribe(smartClient => {
      if (smartClient === null) {
        return;
      }

      smartClient.patient.read().then((p) => {
        const dataToTransmit = {
          "resource": {
            "resourceType": "Observation",
            "id": "SMART-Observation-" + p.identifier[0].value + "-variation-" + variant.variant.hgvsID.replace(/[.,\/#!$%\^&\*;:{}<>=\-_`~()]/g, ""),
            "meta": {
              "versionId": "1" // ,
              // "lastUpdated": Date.now().toString()
            },
            "text": {
              "status": "generated",
              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Variation at " + variant.variant.getLocation() + "</div>"
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
                  "code": variant.variant.hgvsID,
                  "display": variant.variant.hgvsID
                }
              ],
              "text": variant.variant.hgvsID
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
            variant.saved = true;
          })
          .fail(err => {
            console.log("Failed to add EHR variant", err);
          });
      });
    });
  }
  removeEHRVariant(variant: Variant) {
    if (!this.autosync)
      return;

    SMARTClient.subscribe(smartClient => {
      // We can't do anything without a smartClient!
      if (smartClient === null)
        return;

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
