/**
 * Since the amount of data that one would have to parse through in a dropdown list while dealing
 * with genomic data is far too vast to be encompassed in a single select field, the filterable search
 * box is a vastly preferable alternative.  What's nice about Angular is that - using Observables -
 * the options access can be delayed in asynchronous fashion.
 */

/**
 * Since the SMART app is unable to figure out which cancer type an oncologist is looking at without
 * any sort of user input (based on the organization of FHIR objects), this component provides an
 * interface through which the user can accomplish this.
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FilterableSearchService } from './filterable-search.service';
import { FilterableSearchOption } from './filterable-search-option';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'filterable-search',
  template: `
    <input #searchBox id="search-box" (keyup)="search(searchBox.value)"/>
    <div>
      <div *ngFor="let option of options | async" (click)="onSelection(option)" class="search-result">
        <p>{{option.optionName}}</p>
      </div>
    </div>
  `,
  styles: [`
    input {
      width: 100%;
      height: 30px;
      font-size: 20px;
      text-align: center;
    }

    .search-result {
      float: left;
      border: 1px solid #a8a8a8;
      border-radius: 5px;
      margin: 3px;
      padding: 5px;
      width: calc(50% - 18px);
      height: 20px;
      font-size: 18px;
      background-color: white;
      cursor: pointer;
      text-align: center;
    }

    .search-result:hover {
      color: #eee;
      background-color: #607D8B;
    }
    
    p {
      margin: 0;
    }
  `]
})

export class FilterableSearchComponent implements OnInit {

  // Provide the component with the appropriate search service on instantiation.
  @Input() searchService: FilterableSearchService;

  // Provide the component with a callback for when an option is selected.
  @Output() onSelected: EventEmitter<any> = new EventEmitter();
  onSelection(option: FilterableSearchOption): void {
    this.onSelected.emit(option);
  }

  // Angular components which apparently make filterable searches easier
  options: Observable<FilterableSearchOption[]>;
  private searchTerms = new Subject<string>();

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    /**
     * Refer to https://blog.thoughtram.io/angular/2016/01/06/taking-advantage-of-observables-in-angular2.html.
     * This is essentially subscribing the options to the searchTerms.
     */
    this.options = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes (ternary operator)
        ? this.searchService.search(term) // return the http search observable
        : Observable.of<FilterableSearchOption[]>([])) // or the observable of empty options if there was no search term
      .catch(error => {
        // TODO: add real error handling
        console.log('Search Service Error', error);
        return Observable.of<FilterableSearchOption[]>([]);
      });
  }
}

