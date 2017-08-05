/**
 * Takes care of querying for variants.
 */
import { IFilterableSearchService } from './filterable-search/filterable-search.component';

import { Injectable } from '@angular/core';

// RxJS stuff.
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

// Genomic data stuff.
import { Gene, Variant } from '../global/genomic-data';

// Databases.
import { IDatabase } from './providers/database-services.interface';
import { MyVariantInfoSearchService } from './providers/myvariantinfo-search.service';

@Injectable()
export class DataEntryService implements IFilterableSearchService {
  constructor(private myvariantinfoSearchService: MyVariantInfoSearchService) {}

  // The databases initialized in the constructor.
  variantDatabases: IDatabase[] = [this.myvariantinfoSearchService];

  // Merge all variant streams into a single one.
  public search = (term: string): Observable<Variant[]> => {
    // map them into a array of observables and forkJoin
    return Observable.forkJoin(this.variantDatabases
      .map(searchService => searchService.search(term))
    ).map((variantArrays: Variant[][]) => {
        const massiveVariantArray: Variant[] = [];

        const addVariant = (variant: Variant) => {
          for (let arrayIndex = 0; arrayIndex < massiveVariantArray.length; arrayIndex++) {
            // Make sure that we are sorting alphabetically.
            if (massiveVariantArray[arrayIndex].mergeable(variant)) {
              massiveVariantArray[arrayIndex].merge(variant);
              console.log('Merged ' + variant.optionName());
              return;
            } else if (massiveVariantArray[arrayIndex].optionName() > variant.optionName()) {
              massiveVariantArray.splice(arrayIndex, 0, variant);
              return;
            }
          }

          // It must've not been pushed if we reach here.
          massiveVariantArray.push(variant);
        }

        // Variant merging/placing loop.
        for (const variantArray of variantArrays) {
          for (const variant of variantArray) {
            addVariant(variant);
          }
        }
        return massiveVariantArray;
      }
    );
  }
}
