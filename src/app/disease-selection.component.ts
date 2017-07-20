/**
 * Since the SMART app is unable to figure out which disease an oncologist is looking at without
 * any sort of user data (based on the organization of FHIR objects), this component provides an
 * interface through which the user can accomplish this.
 */

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import {SMARTReferenceService} from './smart-reference.service';
import { Disease } from './disease';
import { Subject } from 'rxjs/Subject';
import { DiseaseSearchService } from './disease-search.service';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'disease-selection',
  template: `
    <h1>Select Patient Cancer Type</h1>
    <input #searchBox id="search-box" (keyup)="search(searchBox.value)" />
    <div>
      <div *ngFor="let disease of diseases | async"
           (click)="gotoDetail(disease)" class="search-result" >
        {{disease.name}}
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
  providers: [DiseaseSearchService]
})

export class DiseaseSelectionComponent implements OnInit {

  // Angular components which apparently make filterable searches easier...?
  diseases: Observable<Disease[]>;
  private searchTerms = new Subject<string>();

  constructor(private diseaseSearchService: DiseaseSearchService, private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    console.log(SMARTReferenceService.getSMARTInstance());

    this.diseases = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.diseaseSearchService.search(term)
        // or the observable of empty heroes if there was no search term
        : Observable.of<Disease[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Disease[]>([]);
      });
  }

  gotoDetail(disease: Disease): void {
    let link = ['/data-entry', disease.name];
    this.router.navigate(link);
  }
}
