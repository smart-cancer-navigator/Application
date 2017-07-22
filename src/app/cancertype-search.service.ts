/**
 * This search service controls querying the SMART client instance for conditions, and subsequently
 * populates the dropdown list for the available options.
 */

import { FilterableSearchService } from './filterable-search.service';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CancerType } from './cancertype';
import { SMARTClient } from './smart-reference.service';

// Since this search service extends the filterable search service, it is applicable to the filterable search component.
@Injectable()
export class CancerTypeSearchService extends FilterableSearchService {
  constructor(private http: Http) {
    super();

    if (!SMARTClient) {
      console.log('No SMART client available!');
      return;
    }

    // Query for available conditions (max of 10)
    SMARTClient.api.search({type: 'Condition', count: 10}).then(function (conditions) {
      console.log('Success!');
      console.log('Conditions', conditions);
      for (const condition of conditions.data.entry)
      {
        console.log('Condition: ' + condition.resource.code.text);
      }
    }, function() {
      console.log('Failure!');
    });
  }

  cancertypeexamples: CancerType[] = [
    {optionName: 'breast cancer', pathogenicity: 1},
    {optionName: 'thyroid cancer', pathogenicity: 2}
    ];
  search(term: string): Observable<CancerType[]> {
    // TODO: Figure out how to convert jQuery Deferred object to an Observable
    return Observable.of(this.cancertypeexamples);

    // return this.http
    //   .get(`api/heroes/?name=${term}`)
    //   .map(response => response.json().data as CancerType[]);
  }
}
