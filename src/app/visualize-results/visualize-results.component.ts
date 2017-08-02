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
        <ngb-tab title="Related Clinical Trials">
          <ng-template ngbTabContent>
            <ngb-accordion #acc="ngbAccordion">
              <ngb-panel *ngFor="let variant of variants; let i = index;" title="{{variant.toIntelligentDisplayRepresentation()}}">
                <ng-template ngbPanelContent>
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th>Clinical Trial ID</th>
                        <th>Brief Title</th>
                        <th>Principal Investigator</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let clinicalTrial of clinicalTrials[i]" class="variantRow" (click)="getDataFor(clinicalTrial)">
                        <td>{{clinicalTrial.nci_id}}</td>
                        <td>{{clinicalTrial.brief_title}}</td>
                        <td>{{clinicalTrial.principal_investigator}}</td>
                      </tr>
                    </tbody>
                  </table>
                </ng-template>
              </ngb-panel>
            </ngb-accordion>
          </ng-template>
        </ngb-tab>
        <ngb-tab title="Drugs">
          <ng-template ngbTabContent>
            <p>Tab 2 Content</p>
          </ng-template>
        </ngb-tab>
      </ngb-tabset>
    </div>
  `,
  styles: [`    
    table {
      width: 100%;
    }
    
    th {
      font-weight: bold;
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
