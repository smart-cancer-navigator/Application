/**
 * Used to query for variant types.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FilterableSearchService } from './filterable-search.service.interface';
import { VariantType, Variant, Gene } from './genomic-data';

@Injectable()
export class VariantTypeSearchService implements FilterableSearchService {

  // Provided by the variant search service when selected.
  variantContext: Variant;
  onVariantChosen(variant: Variant): void {
    this.variantContext = variant;
    console.log('Got variant chosen');
  }

  public search = (term: string): Observable<VariantType[]> => {
    return Observable.of([new VariantType('thing', new Variant('otherThing', new Gene('bleh', 1), 1))]);
  }

}

