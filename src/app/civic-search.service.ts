/**
 * CIViC (Clinical Interpretations of Variants in Cancer) is a database which provides genes, variants,
 * and variant types for a wide variety of cancer-causing factors.
 */
import { GeneDataProvider, VariantDataProvider, VariantTypeDataProvider } from './database-services.interface';
import { Observable } from 'rxjs/Observable';
import { Gene, Variant, VariantType } from './genomic-data';
import { Http } from '@angular/http';
import {Injectable} from '@angular/core';


@Injectable()
export class CIViCSearchService implements GeneDataProvider, VariantDataProvider, VariantTypeDataProvider {

  constructor (private http: Http) {
    this.initializeDatabase();
  }

  // All of the genes within the CIViC database are contained within this Observable.
  civicGenes: Observable <Gene[]>;

  public initializeDatabase = () => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', '1');
    params.set('count', '1000');

    this.civicGenes = this.http
      .get(`https://civic.genome.wustl.edu/api/genes`, {search: params})
      .map(response => response.json())
      .map(responseJSON => {
        const genes: Gene[] = [];
        for (const record of responseJSON.records) {
          genes.push(new Gene(record.name, record.id, Observable.of<Variant[]>([])));
        }
        return genes;
      });
  }

  public provideGenes = (searchTerm: string): Observable<Gene[]> => {

    return this.civicGenes
      .map(genes => {
        const applicableGenes: Gene[] = [];
        for (const gene of genes) {
          if (gene.optionName.toLowerCase().startsWith(searchTerm.toLowerCase())) {
            applicableGenes.push(gene);
          }
        }
        return applicableGenes;
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


  /**
   * The variant types for the CIViC Search Service
   */
  public provideVariantTypes = (searchTerm: string, additionalContext: Variant): Observable<VariantType[]> => {
    if (additionalContext.variantTypes) {
      return additionalContext.variantTypes.map(unfilteredVariantTypes => {
        const applicableVariantTypes: VariantType[] = [];
        for (const variant of unfilteredVariantTypes) {
          if (variant.optionName.toLowerCase().startsWith(searchTerm.toLowerCase())) {
            applicableVariantTypes.push(variant);
          }
        }
        return applicableVariantTypes;
      });

    } else {
      // Return empty if no variants are provided in this gene.
      return Observable.of<VariantType[]>([]);
    }
  }
}
