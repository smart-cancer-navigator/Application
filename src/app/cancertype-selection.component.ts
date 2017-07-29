/**
 * Since the SMART app is unable to figure out which cancer type an oncologist is looking at without
 * any sort of user input (based on the organization of FHIR objects), this component provides an
 * interface through which the user can accomplish this.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CancerTypeSearchService } from './cancertype-search.service';
import { FilterableSearchOption } from './filterable-search.component';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { CancerType } from './cancertype';

export let SELECTED_CANCER_TYPE: CancerType = null;

@Component({
  selector: 'cancertype-selection',
  template: `
    <h1>Select Patient Cancer Type</h1>
    <select [(ngModel)]="selected" (ngModelChange)="choose($event)">
      <option selected></option>
      <option *ngFor="let condition of cancertypeSearchService.getConditions() | async" [ngValue]="condition">{{condition.optionName}}</option>
    </select>
  `,
  styles: [`
    select {
      text-align: center;
      font-size: 20px;
      height: 30px;
      width: 100%;
    }
  `]
})

export class CancerTypeSelectionComponent implements OnInit {

  constructor(public cancertypeSearchService: CancerTypeSearchService, private router: Router) {}

  selected: CancerType;

  ngOnInit(): void {
    // Child class specific
    this.cancertypeSearchService.initialize();
  }

  choose(selection: CancerType): void {
    console.log('Cancer type selection component got choice', selection);
    SELECTED_CANCER_TYPE = this.selected;
    this.router.navigate(['/data-entry', selection.fhirID]);
  }
}
