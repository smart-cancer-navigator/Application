/**
 * This search service controls querying the SMART client instance for conditions, and subsequently
 * populates the dropdown list for the available options.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CancerType } from './cancertype';
import { SMARTClient } from '../smart-initialization/smart-reference.service';

// Since this search service extends the filterable search service, it is applicable to the filterable search component.
@Injectable()
export class CancerTypeSearchService {

  public availableCancerTypes: CancerType[] = [];

  constructor() {}

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
    }, (err) => { // Error callback.
      console.log('SMART Query Failed!', err);
    });
  }

  // In a separate method because the jQuery object is a deferred object and so it can't be stored as a get request.
  public getConditions = (): Observable<CancerType[]> => {
    // Compile a list of available cancer types which start with the string in question.
    const applicableCancerTypes: CancerType[] = [];
    for (const cancertype of this.availableCancerTypes) {
      applicableCancerTypes.push(cancertype);
    }
    return Observable.of(applicableCancerTypes);
  }
}
