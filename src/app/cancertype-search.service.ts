/**
 * This search service controls querying the SMART client instance for conditions, and subsequently
 * populates the dropdown list for the available options.
 */

import { FilterableSearchService } from './filterable-search.service.interface';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CancerType } from './cancertype';
import { SMARTClient } from './smart-reference.service';

// Since this search service extends the filterable search service, it is applicable to the filterable search component.
@Injectable()
export class CancerTypeSearchService implements FilterableSearchService {

  public availableCancerTypes: CancerType[] = [];

  constructor(private http: Http) {}

  /**
   * OK SO here's the thing: TypeScript is weird and to preserve 'this' context, you have to do one of three
   * things.  I chose the '=>' solution from https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript
   */
  public initialize = () => {
    if (!SMARTClient) {
      console.log('No SMART client available!');
      return;
    }

    // Query for available conditions (max of 10)
    SMARTClient.api.search({type: 'Condition', count: 10}).then((conditions) => {
      console.log('Conditions', conditions);
      for (const condition of conditions.data.entry)
      {
        console.log('Condition: ' + condition.resource.code.text);
        this.availableCancerTypes.push(new CancerType(condition.resource.code.text, parseInt(condition.resource.code.coding[0].code), 1));
      }
    }, function() {
      console.log('SMART Query Failed!');
    });
  }

  public search = (term: string): Observable<CancerType[]> => {
    if (!SMARTClient) {
      console.log('No SMART client available!');
      return Observable.of([new CancerType('NO SMART CLIENT >:(', 1, 1)]);
    }

    if (this.availableCancerTypes.length === 0) {
      console.log('No cancer types found!');
      return;
    }

    // Compile a list of available cancer types which start with the string in question.
    const applicableCancerTypes: CancerType[] = [];
    for (const cancertype of this.availableCancerTypes) {
      if (cancertype.optionName.toLowerCase().startsWith(term)) {
        applicableCancerTypes.push(cancertype);
      }
    }
    return Observable.of(applicableCancerTypes);
  }
}
