/**
 * This component and its corresponding route is used to display data about the gene and variants selected by
 * the user in the previous step.
 */

import { Component, OnInit } from '@angular/core';
import { USER_SELECTED_VARIANTS } from '../data-entry/data-entry-form.component';
import { ClinicalTrial, ClinicalTrialReference, ClinicalTrialsSearchService } from './clinical-trials.service';
import { Variant } from '../global/genomic-data';

@Component({
  selector: 'visualize-results',
  template: `
    <div class="root">
      <ngb-tabset>
        <ngb-tab title="Simple">
          <ng-template ngbTabContent>
            <ngb-accordion #acc="ngbAccordion" activeIds="ngb-panel-0">
              <ngb-panel title="Simple">
                <ng-template ngbPanelContent>
                  <!-- Drugs Tab -->
                  <div id="drugsInfo" class="tabContent">
                    <h1>Related Clinical Trials/Drugs</h1>
  
                    <!-- New table for each gene/variant -->
                    <div *ngFor="let variant of variants; let i = index;">
                      <h2><i>{{variant.toIntelligentDisplayRepresentation()}}</i></h2>
                      <table border="1">
                        <tr>
                          <th>Clinical Trial ID</th>
                          <th>Brief Title</th>
                          <th>Principal Investigator</th>
                        </tr>
                        <tr *ngFor="let clinicalTrial of clinicalTrials[i]" class="variantRow" (click)="getDataFor(clinicalTrial)">
                          <td>{{clinicalTrial.nci_id}}</td>
                          <td>{{clinicalTrial.brief_title}}</td>
                          <td>{{clinicalTrial.principal_investigator}}</td>
                        </tr>
                      </table>
                    </div>
  
                  </div>
                </ng-template>
              </ngb-panel>
              <ngb-panel>
                <ng-template ngbPanelTitle>
                  <span>&#9733; <b>Fancy</b> title &#9733;</span>
                </ng-template>
                <ng-template ngbPanelContent>
                  Accordion 2
                </ng-template>
              </ngb-panel>
              <ngb-panel title="Disabled" [disabled]="true">
                <ng-template ngbPanelContent>
                  Accordion 3
                </ng-template>
              </ngb-panel>
            </ngb-accordion>
          </ng-template>
        </ngb-tab>
        <ngb-tab>
          <ng-template ngbTabTitle><b>Fancy</b> title</ng-template>
          <ng-template ngbTabContent>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid.
            <p>Tab 2 Content</p>
          </ng-template>
        </ngb-tab>
        <ngb-tab title="Disabled" [disabled]="true">
          <ng-template ngbTabContent>
            <p>Tab 3 Content</p>
          </ng-template>
        </ngb-tab>
      </ngb-tabset>
    </div>
  `,
  styles: [`
    #tabChoices {
      height: 30px;
      overflow-x: scroll;
      overflow-y: hidden;
      width: 100%;
    }

    ::-webkit-scrollbar {
      display: none;
    }

    #tabChoices button {
      float: left;
      width: 300px;
      height: 100%;
      border: 1px solid black;
      border-collapse: collapse;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      background-color: white;
      font-size: 20px;
      outline: none;
    }
    
    .tabContent {
      height: 100%;
      width: 100%;
    }
    
    table {
      width: 100%;
    }
    
    .variantRow {
      background-color: white;
      opacity: 1;
    }
    
    .variantRow:hover {
      opacity: 0.5;
    }
  `]
})
export class VisualizeResultsComponent implements OnInit {
  constructor (public clinicalTrialsSearchService: ClinicalTrialsSearchService) {}

  // One set of clinical trials per gene variant.
  variants: Variant[];
  clinicalTrials: ClinicalTrialReference[][] = [];

  ngOnInit(): void {
    console.log('Got Gene Variants', USER_SELECTED_VARIANTS);
    this.variants = USER_SELECTED_VARIANTS;

    // Populate clinical trials.
    for (let variantIndex = 0; variantIndex < this.variants.length; variantIndex++) {
      this.clinicalTrials.push([]);
      this.clinicalTrialsSearchService.searchClinicalTrials(this.variants[variantIndex]).subscribe(trials => this.clinicalTrials[variantIndex] = trials);
    }
  }

  getDataFor(reference: ClinicalTrialReference) {
    this.clinicalTrialsSearchService.getDetailsFor(reference).subscribe(details => console.log(details));
  }
}
