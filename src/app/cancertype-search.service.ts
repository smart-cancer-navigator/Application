import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { CancerType } from './cancertype';
import {SMARTReferenceService} from './smart-reference.service';

@Injectable()
export class CancerTypeSearchService {
  constructor(private http: Http) {}

  search(term: string): Observable<CancerType[]> {

    return this.http
      .get(`api/heroes/?name=${term}`)
      .map(response => response.json().data as CancerType[]);
  }
}
