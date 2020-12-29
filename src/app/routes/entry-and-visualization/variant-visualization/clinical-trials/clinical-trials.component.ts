/**
 * The best way to learn is through the experiences of others, and accessing the databse of past clinical trials
 * often is the best way to glean such information.
 */

import {Component, forwardRef, Input, OnInit} from "@angular/core";
import { ClinicalTrialsService } from "./clinical-trials.service";
import { ClinicalTrialReference } from "./clinical-trials";
import { Variant } from "../../genomic-data";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const CLINICAL_TRIALS_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ClinicalTrialsComponent),
  multi: true
};

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
  `,
  styles: [``],
  providers: [CLINICAL_TRIALS_CONTROL_VALUE_ACCESSOR]
})
export class ClinicalTrialsComponent {
  constructor (public clinicalTrialsService: ClinicalTrialsService) {}

  // Clinical trials references.
  clinicalTrials: ClinicalTrialReference[] = [];

  // The internal data model (for ngModel)
  _currentlySelected: Variant = null;
  get currentlySelected(): any {
    return this._currentlySelected;
  }
  set currentlySelected(v: any) {
    if (v !== this.currentlySelected) {
      this._currentlySelected = v;
      this.clinicalTrialsService.searchClinicalTrials(v).subscribe(trials => this.clinicalTrials = trials);

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

  // Currently only logs to console.
  getDataFor(reference: ClinicalTrialReference) {
    this.clinicalTrialsService.getDetailsFor(reference).subscribe(details => console.log(details));
  }
}
