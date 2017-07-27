/**
 * CIViC (Clinical Interpretations of Variants in Cancer) is a database which provides genes, variants,
 * and variant types for a wide variety of cancer-causing factors.
 */
import { GeneDataProvider, VariantDataProvider } from './database-services.interface';
import { Observable } from 'rxjs/Observable';
import { Gene, Variant } from './genomic-data';
import { Http } from '@angular/http';
import {Injectable} from '@angular/core';

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
        console.log('Response JSON', responseJSON);
        const genes: Gene[] = [];

        for (const hit of responseJSON.hits) {
          const newGene: Gene = new Gene();
          newGene.optionName = hit.symbol;
          newGene.score = hit._score;
          newGene.symbol = hit.symbol;
          newGene.taxid = hit.taxid;
          newGene.entrez_id = hit._id;
          newGene.entrez_name = hit.name; // or hit.entrezgene

          genes.push(newGene);
        }

        return genes;
      });
  }
}
