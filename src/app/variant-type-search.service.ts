/**
 * Used to query for variant types.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FilterableSearchService } from './filterable-search.component';
import { VariantType, Variant, Gene } from './genomic-data';
import { CIViCSearchService } from './civic-search.service';
import { VariantTypeDataProvider } from './database-services.interface';

@Injectable()
export class VariantTypeSearchService implements FilterableSearchService {

  constructor(private civicSearchService: CIViCSearchService) {}

  variantTypeDataProviders: VariantTypeDataProvider[] = [this.civicSearchService];

  // Provided by the variant search service when selected.
  variantContext: Variant;
  onVariantChosen(variant: Variant): void {
    this.variantContext = variant;
    console.log('Got variant chosen');
  }

  public search = (term: string): Observable<VariantType[]> => {
    // map them into a array of observables and forkJoin
    return Observable.forkJoin(this.variantTypeDataProviders
      .map(
        searchService => searchService.provideVariantTypes(term, this.variantContext)
      )
    ).map((variantTypeArrays: VariantType[][]) => {
        // TODO: Prevent gene overlap, as in CADD submits a gene which CIViC already had.  They should be merged.
        const massiveVariantTypeArray: VariantType[] = [];

        for (const variantTypeArray of variantTypeArrays) {
          for (const variantType of variantTypeArray) {
            massiveVariantTypeArray.push(variantType);
          }
        }

        return massiveVariantTypeArray;
      }
    );
  }

}

