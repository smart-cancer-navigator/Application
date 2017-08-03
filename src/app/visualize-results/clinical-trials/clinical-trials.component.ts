/**
 * The best way to learn is through the experiences of others, and accessing the databse of past clinical trials
 * often is the best way to glean such information.
 */

import { Component, OnInit } from '@angular/core';
import { ClinicalTrialsService } from './clinical-trials.service';
import { ClinicalTrialReference } from './clinical-trials';
import { Variant } from '../../global/genomic-data';
import { USER_SELECTED_VARIANTS } from '../../data-entry/data-entry-form.component';

@Component({
  selector: 'clinical-trials',
  template: `
    <!-- Thanks to the ng-bootstrap project :) -->
    <ngb-accordion #acc="ngbAccordion">
      <ngb-panel *ngFor="let variant of variants; let i = index;" title="{{variant.toIntelligentDisplayRepresentation()}}">
        <ng-template ngbPanelContent>
          <table class="table table-hover table-bordered">
            <thead>
            <tr>
              <th>Clinical Trial ID</th>
              <th>Phase</th>
              <th>Brief Title</th>
              <th>Drugs</th>
              <th>Principal Investigator</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let clinicalTrial of clinicalTrials[i]" class="variantRow" (click)="getDataFor(clinicalTrial)">
              <td>{{clinicalTrial.nci_id}}</td>
              <td>{{clinicalTrial.phase}}</td>
              <td>{{clinicalTrial.brief_title}}</td>
              <td>{{clinicalTrial.drugsToString()}}</td>
              <td>{{clinicalTrial.principal_investigator}}</td>
            </tr>
            </tbody>
          </table>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>
  `
})
export class ClinicalTrialsComponent implements OnInit {
  constructor (public clinicalTrialsService: ClinicalTrialsService) {}

  // One set of clinical trials per gene variant.
  variants: Variant[];
  clinicalTrials: ClinicalTrialReference[][] = [];

  ngOnInit(): void {
    // Obtain a local copy of the variants for the service.
    this.variants = USER_SELECTED_VARIANTS;

    // Populate clinical trials.
    for (let variantIndex = 0; variantIndex < this.variants.length; variantIndex++) {
      this.clinicalTrials.push([]);
      this.clinicalTrialsService.searchClinicalTrials(this.variants[variantIndex]).subscribe(trials => this.clinicalTrials[variantIndex] = trials);
    }
  }

  getDataFor(reference: ClinicalTrialReference) {
    this.clinicalTrialsService.getDetailsFor(reference).subscribe(details => console.log(details));
  }
}
