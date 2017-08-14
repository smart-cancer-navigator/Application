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
import {Variant, VariantReference} from "../global/genomic-data";

// Databases.
import { MyVariantInfoSearchService } from "./providers/myvariantinfo-search.service";
import {MyGeneInfoSearchService} from "./providers/mygeneinfo-search.service";
/**
 * Very simple and straightforward requirements, the database receives the search term and then just hands back the
 * results.
 */
export interface IVariantDatabase {
  searchByString: (searchTerm: string) => Observable<VariantReference[]>;
  getByReference: (reference: VariantReference) => Observable <Variant>;
}

export interface IGeneDatabase {
  updateVariantOrigin: (variant: Variant) => Observable <Variant>;
}

@Injectable()
export class DataEntryService implements IFilterableSearchService {
  constructor(private myvariantinfoSearchService: MyVariantInfoSearchService, private mygeneinfoSearchService: MyGeneInfoSearchService) {}

  // The databases initialized in the constructor.
  variantDatabases: IVariantDatabase[] = [this.myvariantinfoSearchService];
  geneDatabases: IGeneDatabase[] = [this.mygeneinfoSearchService];

  // Merge all variant streams into a single one.
  public search = (term: string): Observable<VariantReference[]> => {
    // map them into a array of observables and forkJoin
    return Observable.forkJoin(this.variantDatabases
      .map(searchService => searchService.searchByString(term))
    ).map((variantArrays: VariantReference[][]) => {
        const mergedVariants: VariantReference[] = [];

        const addVariant = (variant: VariantReference) => {
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
        console.log("Got in response to " + term, mergedVariants);
        return mergedVariants;
      }
    );
  }

  // Merge all variant streams into a single one.
  public getByReference = (reference: VariantReference): Observable<Variant> => {
    // map them into a array of observables and forkJoin
    console.log("Asked to get variant from ", reference);
    return Observable.forkJoin(this.variantDatabases
      .map(searchService => searchService.getByReference(reference))
    ).map((variantArray: Variant[]) => {
        const mergedVariant: Variant = variantArray[0];
        for (let i = 1; i < variantArray.length; i++) {
          if (mergedVariant.mergeable(variantArray[i])) {
            mergedVariant.merge(variantArray[i]);
          }
        }
        console.log("Got ", mergedVariant);
        return mergedVariant;
      }
    ).mergeMap(variant => {
      return Observable.forkJoin(this.geneDatabases
        .map(geneService => geneService.updateVariantOrigin(variant))
      ).map((updatedVariants: Variant[]) => {
        const mergedVariant: Variant = updatedVariants[0];
        for (let i = 1; i < updatedVariants.length; i++) {
          if (mergedVariant.mergeable(updatedVariants[i])) {
            mergedVariant.merge(updatedVariants[i]);
          }
        }
        console.log("Updated origin to ", mergedVariant);
        return mergedVariant;
      });
    });
  }
}
