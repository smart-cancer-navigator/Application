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
import {CancerType} from './cancertype';

@Component({
  selector: 'cancertype-selection',
  template: `
    <h1>Select Patient Cancer Type</h1>
    <filterable-search [searchService]="cancertypeSearchService" [placeholderString]="'Cancer Type'" (onSelected)="choose($event)"></filterable-search>
  `,
  styles: [`
    filterable-search {
      width: 100%;
    }
  `],
  providers: [CancerTypeSearchService]
})

export class CancerTypeSelectionComponent implements OnInit {

  constructor(public cancertypeSearchService: CancerTypeSearchService, private router: Router) {}

  ngOnInit(): void {
    // Child class specific
    this.cancertypeSearchService.initialize();
  }

  choose(selection: FilterableSearchOption): void {
    console.log('Cancer type selection component got choice', selection);
    const cancertype: CancerType = selection as CancerType;
    this.router.navigate(['/data-entry', cancertype.fhirID]);
  }
}
