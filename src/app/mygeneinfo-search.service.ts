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
export class MyGeneInfoSearchService implements GeneDataProvider, VariantDataProvider {

  constructor (private http: Http) {}

  /**
   * The genes for the CIViC search service.
   */
  public provideGenes = (searchTerm: string): Observable<Gene[]> => {
    return this.http
      .get('http://mygene.info/v3/query?q=symbol:' + searchTerm + '*&size=15')
      .map(response => response.json())
      .map(responseJSON => {
        console.log('Response JSON', responseJSON);
        const genes: Gene[] = [];

        for (const result of responseJSON.hits) {
          const newGene: Gene = new Gene();
          newGene.optionName = result.symbol;
          newGene.id = result._id;
          newGene.score = result._score;
          newGene.symbol = result.symbol;
          newGene.taxid = result.taxid;
          newGene.name = result.name;
          newGene.entrez_gene = result.entrezgene;

          genes.push(newGene);
        }

        return genes;
      });
  }


  /**
   * The variants for the CIViC Search Service
   */
  public provideVariants = (searchTerm: string, additionalContext: Gene): Observable<Variant[]> => {
    if (additionalContext.variants) {
      return additionalContext.variants.map(unfilteredVariants => {
        const applicableVariants: Variant[] = [];
        for (const variant of unfilteredVariants) {
          if (variant.optionName.toLowerCase().startsWith(searchTerm.toLowerCase())) {
            applicableVariants.push(variant);
          }
        }
        return applicableVariants;
      });

    } else {
      // Return empty if no variants are provided in this gene.
      return Observable.of<Variant[]>([]);
    }
  }
}
