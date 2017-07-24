/**
 * Used to query the databases of genes.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FilterableSearchService } from './filterable-search.service';
import { Gene } from './genomic-data';

@Injectable()
export class GeneSearchService implements FilterableSearchService {

  constructor(private http: Http) {}

  public search = (term: string): Observable<Gene[]> => {
    return Observable.of([new Gene('sampleGene', 1)]);

    // return this.http
    //   .get(`api/heroes/?name=${term}`)
    //   .map(response => response.json().data as CancerType[]);
  }

}

