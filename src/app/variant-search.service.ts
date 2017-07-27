/**
 * Used to query for variants.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FilterableSearchService } from './filterable-search.component';
import { Gene, Variant } from './genomic-data';
import { VariantDataProvider } from './database-services.interface';
import { MyVariantInfoSearchService } from './myvariantinfo-search.service';

@Injectable()
export class VariantSearchService implements FilterableSearchService {

  constructor(private myvariantinfoSearchService: MyVariantInfoSearchService) {}

  variantDataProviders: VariantDataProvider[] = [this.myvariantinfoSearchService];

  // Provided by the gene search filterable dropdown on selection.
  geneContext: Gene;
  onGeneChosen(gene: Gene) {
    console.log('Got gene chosen', gene);
    this.geneContext = gene;
  }

  public search = (term: string): Observable<Variant[]> => {
    if (!this.geneContext) {
      console.log('Searching with no gene chosen!');
      return Observable.of <Variant[]> ([]);
    }

    console.log('Searching');

    // map them into a array of observables and forkJoin
    return Observable.forkJoin(this.variantDataProviders
      .map(searchService => searchService.provideVariants(term, this.geneContext))
    ).map((variantArrays: Variant[][]) => {
        // TODO: Prevent gene overlap, as in CADD submits a gene which CIViC already had.  They should be merged.
        const massiveVariantArray: Variant[] = [];

        for (const variantArray of variantArrays) {
          for (const variant of variantArray) {
            massiveVariantArray.push(variant);
          }
        }
        return massiveVariantArray;
      }
    );
  }

  // Used to check the validity of a given HGVS ID.
  public validateHGVSID = (hgvsID: string): Observable<boolean> => {
    // If any of them validate it successfully, it's a valid ID.
    return Observable.forkJoin(this.variantDataProviders
      .map(searchService => searchService.validateHGVSID(hgvsID))
    ).map((resultArray: boolean[]) => {
      console.log('Got result array');
      for (const result of resultArray) {
        if (result) {
          console.log('Valid');
          return true;
        }
      }
      console.log('Invalid');
      return false;
    });
  }
}
