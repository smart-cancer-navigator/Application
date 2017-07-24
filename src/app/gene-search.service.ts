/**
 * Used to query the databases of genes.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

import { FilterableSearchService } from './filterable-search.service.interface';
import { Gene } from './genomic-data';
import { CIViCSearchService } from './civic-search.service';
import { GeneDataProvider } from './database-services.interface';

@Injectable()
export class GeneSearchService implements FilterableSearchService {

  geneSearchServices: GeneDataProvider[] = [this.civicSearchService];

  constructor(private civicSearchService: CIViCSearchService) {}

  public search = (term: string): Observable<Gene[]> => {
    // map them into a array of observables and forkJoin
    return Observable.forkJoin(this.geneSearchServices
        .map(
          searchService => searchService.provideGenes(term)
        )
      ).map((geneArrays: Gene[][]) => {
        // TODO: Prevent gene overlap, as in CADD submits a gene which CIViC already had.  They should be merged.
        const massiveGeneArray: Gene[] = [];

        for (const geneArray of geneArrays) {
          for (const gene of geneArray) {
            massiveGeneArray.push(gene);
          }
        }

        return massiveGeneArray;
      }
    );
  }
}

