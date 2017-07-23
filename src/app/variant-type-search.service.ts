/**
 * Used to query for variant types.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FilterableSearchService } from './filterable-search.service';
import { VariantType, Variant, Gene } from './gene-variant-type';

@Injectable()
export class VariantTypeSearchService implements FilterableSearchService {

  constructor(private http: Http) {}

  public search = (term: string): Observable<VariantType[]> => {
    return Observable.of([new VariantType('thing', new Variant('otherThing', new Gene('bleh', 1), 1))]);

    // return this.http
    //   .get(`api/heroes/?name=${term}`)
    //   .map(response => response.json().data as CancerType[]);
  }

}

