/**
 * CIViC (Clinical Interpretations of Variants in Cancer) is a database which provides genes, variants,
 * and variant types for a wide variety of cancer-causing factors.
 */
import { GeneDataProvider } from './database-services.interface';
import { Observable } from 'rxjs/Observable';
import { Gene } from '../../global/genomic-data';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MyGeneInfoSearchService implements GeneDataProvider {

  constructor (private http: Http) {}

  /**
   * The genes for the mygene.info search service.
   */
  public provideGenes = (searchTerm: string): Observable<Gene[]> => {
    return this.http
      .get('http://mygene.info/v3/query?q=symbol:' + searchTerm + '*&size=15')
      .map(response => response.json())
      .map(responseJSON => {
        const genes: Gene[] = [];
        if (!responseJSON.hits) {
          return genes;
        }

        for (const hit of responseJSON.hits) {
          genes.push(new Gene(hit.symbol, hit._score, hit._id));
        }

        return genes;
      });
  }
}
