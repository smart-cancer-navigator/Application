/**
 * Since the SMART app is unable to figure out which cancer type an oncologist is looking at without
 * any sort of user input (based on the organization of FHIR objects), this component provides an
 * interface through which the user can accomplish this.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CancerTypeSearchService } from './cancertype-search.service';
import { CancerType } from './cancertype';

export let SELECTED_CANCER_TYPE: CancerType = null;

@Component({
  selector: 'cancertype-selection',
  template: `
    <div class="container">
      <div class="jumbotron">
        <h1>Select Patient Cancer Type</h1>
        <br>
        <select [(ngModel)]="selected" (ngModelChange)="choose($event)">
          <option selected>Choose Option</option>
          <option *ngFor="let condition of availableConditions" [ngValue]="(condition)">{{condition.optionName()}}</option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    select {
      text-align: center;
      font-size: 20px;
      height: 30px;
      width: 100%;
      
      /* Safari Bug Fix, otherwise height doesn't change. */
      line-height: 30px;
    }
  `]
})

export class CancerTypeSelectionComponent implements OnInit {

  constructor(public cancertypeSearchService: CancerTypeSearchService, private router: Router) {}

  selected: CancerType; // This can be ignored, an ngModel is the only way to obtain a value from a select tag.

  // Used to populate available conditions.
  availableConditions: CancerType[];
  ngOnInit(): void {
    this.cancertypeSearchService.patientConditions.subscribe(conditions => this.availableConditions = conditions);
  }

  choose(selection: CancerType): void {
    console.log('Cancer type selection component got choice', selection);
    SELECTED_CANCER_TYPE = selection;
    this.router.navigate(['/data-entry', selection.fhirID]);
  }
}
