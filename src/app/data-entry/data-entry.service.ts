/**
 * Takes care of querying for variants.
 */
import { IFilterableSearchService } from "./filterable-search/filterable-search.component";

import { Injectable } from "@angular/core";

// RxJS stuff.
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";

// Genomic data stuff.
import { Variant } from "../global/genomic-data";

// Databases.
import { MyVariantInfoSearchService } from "./providers/myvariantinfo-search.service";
/**
 * Very simple and straightforward requirements, the database receives the search term and then just hands back the
 * results.
 */
export interface IVariantDatabase {
  search: (searchTerm: string) => Observable<Variant[]>;
}

@Injectable()
export class DataEntryService implements IFilterableSearchService {
  constructor(private myvariantinfoSearchService: MyVariantInfoSearchService) {}

  // The databases initialized in the constructor.
  variantDatabases: IVariantDatabase[] = [this.myvariantinfoSearchService];

  // Merge all variant streams into a single one.
  public search = (term: string): Observable<Variant[]> => {
    // map them into a array of observables and forkJoin
    return Observable.forkJoin(this.variantDatabases
      .map(searchService => searchService.search(term))
    ).map((variantArrays: Variant[][]) => {
        const mergedVariants: Variant[] = [];

        const addVariant = (variant: Variant) => {
          for (let arrayIndex = 0; arrayIndex < mergedVariants.length; arrayIndex++) {
            // Make sure that we are sorting alphabetically.
            if (mergedVariants[arrayIndex].mergeable(variant)) {
              mergedVariants[arrayIndex].merge(variant);
              console.log("Merged " + variant.optionName());
              return;
            } else if (mergedVariants[arrayIndex].optionName() > variant.optionName()) {
              mergedVariants.splice(arrayIndex, 0, variant);
              return;
            }
          }

          // It must"ve not been pushed if we reach here.
          mergedVariants.push(variant);
        };

        // Variant merging/placing loop.
        for (const variantArray of variantArrays) {
          for (const variant of variantArray) {
            addVariant(variant);
          }
        }
        return mergedVariants;
      }
    );
  }
}
