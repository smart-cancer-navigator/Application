import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CancerType } from './cancertype';
import { SMARTClient, SMARTReferenceService } from './smart-reference.service';

@Injectable()
export class CancerTypeSearchService {
  patientConditions: CancerType[];

  constructor(private http: Http) {
    // Simplify function creation with =>
    if (!SMARTClient) {
      console.log('No SMART client available!');
      return;
    }
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

  search(term: string): Observable<CancerType[]> {
    return this.http
      .get(`api/heroes/?name=${term}`)
      .map(response => response.json().data as CancerType[]);
  }
}
