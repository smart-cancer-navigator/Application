/**
 * This search service controls querying the SMART client instance for conditions, and subsequently
 * populates the dropdown list for the available options.
 */

import { FilterableSearchService } from './filterable-search.component';

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

  public initialize = () => {
    SMARTClient.subscribe(smart => this.populatePatientConditions(smart));
  }

  // Called once client is set.
  populatePatientConditions = (smartClient: any): void => {
    if (smartClient === null) {
      return;
    }

    console.log('Populating');
    // Query for available conditions (max of 10)
    smartClient.patient.api.search({type: 'Condition', count: 10}).then((conditions) => {
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
