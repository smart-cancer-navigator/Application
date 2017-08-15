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

                <br>
                <h3 class="display-3">
                  {{variant.origin.hugoSymbol}}
                  <small class="text-muted">{{variant.origin.name}}</small>
                </h3>

                <div style="width: 70%; float: left;">
                  <div class="card">
                    <!--<img class="card-img-top" src="..." alt="Card image cap">-->
                    <div class="card-block">
                      <h4 class="card-title">Gene Description</h4>
                      <p class="card-text">{{variant.origin.description}}</p>
                    </div>
                  </div>
                  
                  <div class="card">
                    <div class="card-block" *ngIf="variant.origin.pathways !== undefined && variant.origin.pathways.length > 0">
                      <h4 class="card-title">Gene Pathways</h4>
                      <p class="card-text">{{variant.origin.pathwaysString()}}</p>
                    </div>
                  </div>
                </div>
  
                <div class="card" style="width: 30%; float: left;">
                  <!--<img class="card-img-top" src="..." alt="Card image cap">-->
                  <div class="card-block">
                    <h4 class="card-title">Gene Details</h4>
                    <!-- A bit of info about the variant/gene -->
                    <table class="table table-bordered">
                      <thead>
                      </thead>
                      <tbody>
                      <tr *ngIf="variant.origin.entrezID !== undefined">
                        <td>Entrez ID</td>
                        <td>{{variant.origin.entrezID}}</td>
                      </tr>
                      <tr *ngIf="variant.origin.type !== undefined">
                        <td>Type</td>
                        <td>{{variant.origin.type}}</td>
                      </tr>
                      <tr *ngIf="variant.origin.aliases !== undefined && variant.origin.aliases.length > 0">
                        <td>Aliases</td>
                        <td>{{variant.origin.aliases.join(", ")}}</td>
                      </tr>
                      <tr *ngIf="variant.origin.chromosome !== undefined">
                        <td>Chromosome</td>
                        <td>{{variant.origin.chromosome}}</td>
                      </tr>
                      <tr *ngIf="variant.origin.strand !== undefined">
                        <td>Strand</td>
                        <td>{{variant.origin.strand}}</td>
                      </tr>
                      <tr *ngIf="variant.origin.start !== undefined && variant.origin.end !== undefined">
                        <td>Nucleotides</td>
                        <td>{{variant.origin.start}} to {{variant.origin.end}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </ng-template>
            </ngb-tab>

            <ngb-tab title="Variant">
              <ng-template ngbTabContent>

                <br>
                <h3 class="display-3">{{variant.variantName}}</h3>

                <!-- A bit of info about the variant/gene -->
                <table class="table table-bordered table-striped">
                  <thead>
                  </thead>
                  <tbody>
                  <tr *ngIf="variant.description && variant.description !== ''">
                    <td>Description</td>
                    <td>{{variant.description}}</td>
                  </tr>
                  <tr>
                    <td>Score</td>
                    <td ngbPopover="Variant Score often defines Pathogenicity." triggers="mouseenter:mouseleave">
                      {{variant.score}}
                    </td>
                  </tr>
                  <tr>
                    <td>Variant Origin</td>
                    <td>{{variant.somatic ? 'Somatic' : 'Germline'}}</td>
                  </tr>
                  <tr *ngIf="variant.types && variant.types.length > 0">
                    <td>Variant Type</td>
                    <td>{{variant.types.join(", ")}}</td>
                  </tr>
                  <tr *ngIf="variant.drugs && variant.drugs.length > 0">
                    <td>Effective Drugs</td>
                    <td>
                      <button *ngFor="let drugReference of variant.drugs" class="btn btn-secondary"
                              (click)="openNewDrugTab(drugReference)">{{drugReference.name}}
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="variant.diseases && variant.diseases.length > 0">
                    <td>Known Diseases</td>
                    <td>{{variant.diseases.join(", ")}}</td>
                  </tr>
                  <tr>
                    <td>Variant Location</td>
                    <td>Chromosome {{variant.getLocation()}}</td>
                  </tr>
                  </tbody>
                </table>
              </ng-template>
            </ngb-tab>

            <ngb-tab title="Clinical Trials">
              <ng-template ngbTabContent>
                <clinical-trials [forVariant]="variant"></clinical-trials>
              </ng-template>
            </ngb-tab>

            <ngb-tab *ngFor="let drugReference of detailedDrugInfoTabs" title="{{drugReference.brief_name()}}">
              <ng-template ngbTabContent>
                <drugs-info [forReference]="drugReference"></drugs-info>
                <button type="button" class="btn btn-danger" (click)="closeDrugTab(drugReference)">Close Tab</button>
              </ng-template>
            </ngb-tab>
          </ngb-tabset>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>

    <button type="button" class="btn btn-success" style="float: right" (click)="saveVariantsToFHIRPatient()">{{submitStatus}}</button>
  `,
  styles: [`    
    small {
      font-size: 25px;
    }
  `]
})
export class VisualizeResultsComponent implements OnInit {
  variants: Variant[] = [];
  submitStatus: string = "Submit Data to EHR";
  detailedDrugInfoTabs: DrugReference[] = [];

  ngOnInit() {
    if (!USER_SELECTED_VARIANTS) {
      return;
    }
    USER_SELECTED_VARIANTS.subscribe(variants => this.variants = variants);
  }

  openNewDrugTab(drug: DrugReference) {
    this.detailedDrugInfoTabs.push(drug);
  }
  closeDrugTab(drug: DrugReference) {
    this.detailedDrugInfoTabs.splice(this.detailedDrugInfoTabs.indexOf(drug), 1);
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
