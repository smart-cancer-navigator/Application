/**
 * Used to query for variants.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FilterableSearchService } from './filterable-search.service.interface';
import { Gene, Variant } from './genomic-data';

@Injectable()
export class VariantSearchService implements FilterableSearchService {

  // Provided by the gene search filterable dropdown on selection.
  geneContext: Gene;
  onGeneChosen(gene: Gene) {
    this.geneContext = gene;
    console.log('Got gene chosen');
  }

  constructor(private http: Http) {}

  public search = (term: string): Observable<Variant[]> => {
    return Observable.of([new Variant('sampleVariant', new Gene('someGene', 1), 1)]);

    // return this.http
    //   .get(`api/heroes/?name=${term}`)
    //   .map(response => response.json().data as CancerType[]);
  }

}
