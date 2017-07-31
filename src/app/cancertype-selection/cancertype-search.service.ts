/**
 * This search service controls querying the SMART client instance for conditions, and subsequently
 * populates the dropdown list for the available options.
 */

import { Injectable } from '@angular/core';

import { CancerType } from './cancertype';
import { SMARTClient } from '../smart-initialization/smart-reference.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Since this search service extends the filterable search service, it is applicable to the filterable search component.
@Injectable()
export class CancerTypeSearchService {

  // Updated upon all conditions being entered.
  public patientConditions: BehaviorSubject <CancerType[]> = new BehaviorSubject<CancerType[]>(null);

  constructor() {
    this.initialize();
  }

  // Make sure that we get the smart client whenever it is authenticated.
  public initialize = () => {
    SMARTClient.subscribe(smart => this.populatePatientConditions(smart));
  }

  // Called once client is set.
  populatePatientConditions = (smartClient: any): void => {
    if (smartClient === null) {
      return;
    }

    // Query for available conditions (max of 10)
    smartClient.patient.api.search({type: 'Condition', count: 10}).then((conditions) => {
      const queriedConditions: CancerType[] = [];
      for (const condition of conditions.data.entry)
      {
        console.log('Added new condition: ' + condition.resource.code.text);
        queriedConditions.push(new CancerType(condition.resource.code.text, parseInt(condition.resource.code.coding[0].code), 1));
      }

      // Update the subject on completion.
      this.patientConditions.next(queriedConditions);
    }, (err) => { // Error callback.
      console.log('SMART Query Failed!', err);
    });
  }
}
