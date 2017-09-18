/**
 * The best way to learn is through the experiences of others, and accessing the databse of past clinical trials
 * often is the best way to glean such information.
 */

import { Component, Input, OnInit } from "@angular/core";
import { ClinicalTrialsService } from "./clinical-trials.service";
import { ClinicalTrialReference } from "./clinical-trials";
import { Variant } from "../../genomic-data";

@Component({
  selector: "clinical-trials",
  template: `    
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
      <ng-container *ngIf="clinicalTrials.length >= 0" >
        <tr *ngFor="let clinicalTrial of clinicalTrials" class="variantRow" (click)="getDataFor(clinicalTrial)">
          <td>{{clinicalTrial.nci_id}}</td>
          <td>{{clinicalTrial.phase}}</td>
          <td>{{clinicalTrial.brief_title}}</td>
          <td>{{clinicalTrial.drugsToString()}}</td>
          <td>{{clinicalTrial.principal_investigator}}</td>
        </tr>
      </ng-container>
      <ng-container *ngIf="clinicalTrials.length === 0" >
        <tr>
          <td>Loading...</td>
        </tr>
      </ng-container>
      </tbody>
    </table>
  `
})
export class ClinicalTrialsComponent implements OnInit {
  constructor (public clinicalTrialsService: ClinicalTrialsService) {}

  // One set of clinical trials per gene variant.
  @Input() forVariant: Variant;
  clinicalTrials: ClinicalTrialReference[] = [];

  ngOnInit(): void {
    console.log("Called");
    if (!this.forVariant) {
      return;
    }

    // Populate clinical trials.
    this.clinicalTrialsService.searchClinicalTrials(this.forVariant).subscribe(trials => this.clinicalTrials = trials);
  }

  getDataFor(reference: ClinicalTrialReference) {
    this.clinicalTrialsService.getDetailsFor(reference).subscribe(details => console.log(details));
  }
}
