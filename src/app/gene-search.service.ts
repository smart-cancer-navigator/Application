/**
 * Used to query the databases of genes.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

import { FilterableSearchService } from './filterable-search.component';
import { Gene } from './genomic-data';
import { CIViCSearchService } from './civic-search.service';
import { GeneDataProvider } from './database-services.interface';
import {MyGeneInfoSearchService} from './mygeneinfo-search.service';

@Injectable()
export class GeneSearchService implements FilterableSearchService {

  geneSearchServices: GeneDataProvider[] = [this.mygeneinfoSearchService, this.civicSearchService];

  constructor(private civicSearchService: CIViCSearchService, private mygeneinfoSearchService: MyGeneInfoSearchService) {}

  public search = (term: string): Observable<Gene[]> => {
    // map them into a array of observables and forkJoin
    return Observable.forkJoin(this.geneSearchServices
        .map(
          searchService => searchService.provideGenes(term)
        )
      ).map((geneArrays: Gene[][]) => {
        const massiveGeneArray: Gene[] = [];

        const addGene = (toAdd: Gene) => {
          for (const toCheck of massiveGeneArray) {
            if (toCheck.optionName === toAdd.optionName) {
              toCheck.mergeWith(toAdd);
              console.log('Merged ' + toAdd.symbol);
              return;
            }
          }
          // If this is a distinct option.
          massiveGeneArray.push(toAdd);
        }

        for (const geneArray of geneArrays) {
          for (const gene of geneArray) {
            addGene(gene);
          }
        }

        return massiveGeneArray;
      }
    );
  }
}

