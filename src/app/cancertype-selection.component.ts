/**
 * Since the SMART app is unable to figure out which cancer type an oncologist is looking at without
 * any sort of user input (based on the organization of FHIR objects), this component provides an
 * interface through which the user can accomplish this.
 */

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { SMARTReferenceService } from './smart-reference.service';
import { CancerType } from './cancertype';
import { Subject } from 'rxjs/Subject';
import { CancerTypeSearchService } from './cancertype-search.service';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'cancertype-selection',
  template: `
    <h1>Select Patient Cancer Type</h1>
    <input #searchBox id="search-box" (keyup)="search(searchBox.value)"/>
    <div>
      <div *ngFor="let cancertype of cancertypes | async"
           (click)="choose(cancertype)" class="search-result">
        {{cancertype.name}}
      </div>
    </div>
  `,
  styles: [`
    h1 {
      text-align: center;
    }
    
    input {
      width: 100%;
      height: 30px;
      font-size: 20px;
      text-align: center;
    }
    
    .search-result{
      border-bottom: 1px solid gray;
      border-left: 1px solid gray;
      border-right: 1px solid gray;
      width:195px;
      height: 16px;
      padding: 5px;
      background-color: white;
      cursor: pointer;
    }

    .search-result:hover {
      color: #eee;
      background-color: #607D8B;
    }
  `],
  providers: [CancerTypeSearchService]
})

export class CancerTypeSelectionComponent implements OnInit {

  // Angular components which apparently make filterable searches easier...?
  cancertypes: Observable<CancerType[]>;
  private searchTerms = new Subject<string>();

  constructor(private cancertypeSearchService: CancerTypeSearchService, private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    console.log(SMARTReferenceService.FHIRClientInstance());

    this.cancertypes = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.cancertypeSearchService.search(term)
        // or the observable of empty heroes if there was no search term
        : Observable.of<CancerType[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<CancerType[]>([]);
      });
  }

  choose(cancertype: CancerType): void {
    const link = ['/data-entry', cancertype.name];
    this.router.navigate(link);
  }
}
