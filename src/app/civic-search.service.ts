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
        // For every gene
        for (const record of responseJSON.records) {
          // Construct a new gene.
          const gene: Gene = new Gene(record.name, record.id);

          // Construct variant array
          const geneVariants: Variant[] = [];
          for (const variant of record.variants) {
            const currentVariant: Variant = new Variant(variant.name, gene, variant.id);

            // Construct the Observable which will provide variant types
            const variantTypeObservable: Observable<VariantType[]> = this.http.get('https://civic.genome.wustl.edu/api/variants/' + currentVariant.id)
              .map(response => response.json())
              .map(variantTypeResponseJSON => {
                const variantTypes: VariantType[] = [];

                for (const variantTypeJSON of variantTypeResponseJSON.variant_types) {
                  variantTypes.push(new VariantType(variantTypeJSON.display_name, currentVariant));
                }

                return variantTypes;
              });

            currentVariant.setVariantTypes(variantTypeObservable);

            geneVariants.push(currentVariant);
          }

          // Add the variants array to the gene.
          gene.setVariants(Observable.of(geneVariants));

          genes.push(gene);
        }
        return genes;
      });
  }

  /**
   * The genes for the CIViC search service.
   */
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
