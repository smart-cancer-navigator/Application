/**
 * CIViC (Clinical Interpretations of Variants in Cancer) is a database which provides genes, variants,
 * and variant types for a wide variety of cancer-causing factors.
 */
import { SearchableGeneDatabase, SearchableVariantDatabase } from './database-services.interface';
import { Observable } from 'rxjs/Observable';
import { Gene, Variant } from '../../global/genomic-data';
import { Http } from '@angular/http';
import {Injectable} from '@angular/core';

// TODO: Make it work with the new specification (no Observable in gene which symbolizes variants).  MyGene.info already includes this
@Injectable()
export class CIViCSearchService {

  constructor(private http: Http) {
    this.initializeDatabase();
  }

  // All of the genes within the CIViC database are contained within this Observable.
  civicGenes: Observable<Gene[]>;

  public initializeDatabase = () => {
  //   const params: URLSearchParams = new URLSearchParams();
  //   params.set('page', '1');
  //   params.set('count', '1000');
  //
  //   this.civicGenes = this.http
  //     .get(`https://civic.genome.wustl.edu/api/genes`, {search: params})
  //     .map(response => response.json())
  //     .map(responseJSON => {
  //       const genes: Gene[] = [];
  //       // For every gene
  //       for (const record of responseJSON.records) {
  //         // Construct a new gene (CIViC doesn't have all fields)
  //         const gene: Gene = new Gene();
  //         gene.optionName = record.name;
  //         gene.variant_name = record.name;
  //         gene.symbol = record.name;
  //         gene.entrez_id = record.id;
  //
  //         // Construct variant array
  //         const geneVariants: Variant[] = [];
  //         for (const variant of record.variants) {
  //           // Construct the new variant.
  //           const currentVariant: Variant = new Variant();
  //           currentVariant.origin = gene;
  //           currentVariant.optionName = variant.name;
  //           currentVariant.entrez_id = variant.id;
  //
  //           geneVariants.push(currentVariant);
  //         }
  //
  //         // Add the variants array to the gene.
  //         gene.variants = Observable.of(geneVariants);
  //
  //         genes.push(gene);
  //       }
  //       return genes;
  //     });
  }

  /**
   * The genes for the CIViC search service.
   */
  public provideGenes = (searchTerm: string): Observable<Gene[]> => {
    // return this.civicGenes
    //   .map(genes => {
    //     const applicableGenes: Gene[] = [];
    //     for (const gene of genes) {
    //       if (gene.optionName.toLowerCase().startsWith(searchTerm.toLowerCase())) {
    //         applicableGenes.push(gene);
    //       }
    //     }
    //     return applicableGenes;
    //   });
    return null;
  }


  /**
   * The variants for the CIViC Search Service
   */
  public provideVariants = (searchTerm: string, additionalContext: Gene): Observable<Variant[]> => {
    // if (additionalContext.variants) {
    //   return additionalContext.variants.map(unfilteredVariants => {
    //     const applicableVariants: Variant[] = [];
    //     for (const variant of unfilteredVariants) {
    //       if (variant.optionName.toLowerCase().startsWith(searchTerm.toLowerCase())) {
    //         applicableVariants.push(variant);
    //       }
    //     }
    //     return applicableVariants;
    //   });
    //
    // } else {
    //   // Return empty if no variants are provided in this gene.
    //   return Observable.of<Variant[]>([]);
    // }

    return null;
  }
}
