/**
 * CIViC (Clinical Interpretations of Variants in Cancer) is a database which provides genes, variants,
 * and variant types for a wide variety of cancer-causing factors.
 */
import { HGVSIdentifier, SearchableVariantDatabase } from './database-services.interface';
import { Observable } from 'rxjs/Observable';
import { Gene, Variant } from '../../global/genomic-data';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MyVariantInfoSearchService implements SearchableVariantDatabase, HGVSIdentifier {
  constructor(private http: Http) {
    const toInclude = ['civic.entrez_name', 'civic.name', 'civic.description', 'civic.evidence_items', 'civic.variant_types', 'vcf', 'hg19', 'chrom'];

    for (const itemToInclude of toInclude) {
      this.includeString = this.includeString + '%2C' + itemToInclude;
    }
  }

  includeString: string;

  parseVariantFromJSONHit(additionalContext: Gene, hit: any): Variant {

    if (additionalContext === null) {
      let geneHUGO = '';
      if (hit.cadd && hit.cadd.gene && hit.cadd.gene.genename) {
        geneHUGO = hit.cadd.gene.genename;
      } else if (hit.cgi && hit.cgi[0] && hit.cgi[0].gene) {
        geneHUGO = hit.cgi[0].gene;
      } else if (hit.civic && hit.civic.entrez_name) {
        geneHUGO = hit.civic.entrez_name;
      }

      let geneEntrez = 1;
      if (hit.civic && hit.civic.entrez_id) {
        geneEntrez = hit.civic.entrez_id;
      }

      additionalContext = new Gene(geneHUGO, '', 1, geneEntrez);
    }

    // Check to see whether it has any database-specific properties (like CIViC descriptions)
    let description = '';
    let somatic = true; // True by default.
    let types: string[] = [];

    if (hit.civic) {
      if (hit.civic.description) {
        description = hit.civic.description;
      }

      if (hit.civic.evidence_items && hit.civic.evidence_items.length > 0) {
        if (hit.civic.evidence_items[0].variant_origin) {
          somatic = hit.civic.evidence_items[0].variant_origin.toLowerCase().indexOf('somatic') >= 0;
        }
      }

      if (hit.civic.variant_types) {
        types = hit.civic.variant_types;
      }
    }

    // Figure out item location.
    let chromosome = -1;
    let start = -1;
    let end = -1;

    if (hit.chrom) {
      chromosome = hit.chrom;
    }

    if (hit.vcf) {
      start = hit.vcf.position;
      end = hit.vcf.position;
    } else if (hit.hg19) {
      start = hit.hg19.start;
      end = hit.hg19.end;
    }

    return new Variant(additionalContext, hit.civic.name, hit._id, hit._score, description, somatic, types, chromosome, start, end);
  }

  /**
   * The variants provided by myvariant.info
   */
  public searchVariants = (searchTerm: string, additionalContext: Gene): Observable<Variant[]> => {
    return this.http.get('http://myvariant.info/v1/query?q=civic.entrez_name%3A' + additionalContext.hugo_symbol + '%20AND%20civic.name%3A' + searchTerm + '*&fields=' + this.includeString + '&size=15')
      .map(result => result.json())
      .map(resultJSON => {
        const variantResults: Variant[] = [];
        if (!resultJSON.hits) {
          return variantResults;
        }

        console.log('Got Result JSON from myvariant', resultJSON);

        // For every result.
        for (const hit of resultJSON.hits) {
          // Add constructed variant to the array.
          variantResults.push(this.parseVariantFromJSONHit(additionalContext, hit));
        }

        return variantResults;
      });
  }

  public validateHGVS = (hgvsID: string): Observable<Variant> => {
    if (hgvsID === '') {
      console.log('Search is empty');
      return Observable.of(null);
    }

    return this.http.get('http://myvariant.info/v1/variant/' + hgvsID/* + '?fields=_id'*/)
      .map(result => result.json())
      .map(resultJSON => {
        console.log('Variant HGVS myvariant:', resultJSON);
        return this.parseVariantFromJSONHit(null, resultJSON);
      }).catch((err: any) => { // Regardless that this error is being caught, it will still show up in the console.
        return Observable.of(null);
      });
  }
}
