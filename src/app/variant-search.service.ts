/**
 * Used to query for variants.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FilterableSearchService } from './filterable-search.service';
import {Gene, Variant} from './gene-variant-type';

@Injectable()
export class VariantSearchService implements FilterableSearchService {

  constructor(private http: Http) {}

  public search = (term: string): Observable<Variant[]> => {
    return Observable.of([new Variant('sampleVariant', new Gene('someGene', 1), 1)]);

    // return this.http
    //   .get(`api/heroes/?name=${term}`)
    //   .map(response => response.json().data as CancerType[]);
  }

}
