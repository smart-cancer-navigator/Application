import { FilterableSearchOption } from './filterable-search.component';
import {Observable} from 'rxjs/Observable';

/**
 * The gene class provides a quick and easy way to obtain gene names, various IDs, and so on from a
 * variety of databases.  Eventually this class will be made FHIR compliant to speed up FHIR bundle
 * conversion.
 */
export class Gene implements FilterableSearchOption {
  // Interface properties
  optionName: string;

  // Class properties
  id: number;
  score: number;
  entrez_gene: string;
  symbol: string;
  name: string;
  taxid: number;

  variants: Observable<Variant[]>; // This is classified as an Observable, since they may be stored as GET requests.

  mergeWith = (other: Gene) => {
    this.id = MergeProperties(this.id, other.id);
    this.entrez_gene = MergeProperties(this.entrez_gene, other.entrez_gene);
    this.taxid = MergeProperties(this.taxid, other.taxid);
    this.optionName = MergeProperties(this.optionName, other.optionName);
    this.symbol = MergeProperties(this.symbol, other.symbol);
    this.variants = MergeProperties(this.variants, other.variants);
    this.score = MergeProperties(this.score, other.score);
  }

  equals = (other: Gene): boolean => {
    return this.id === other.id
      && this.score === other.score
      && this.entrez_gene === other.entrez_gene
      && this.symbol === other.symbol
      && this.name === other.name
      && this.taxid === other.taxid;
  }
}

/**
 * Gene variants vary in their pathogenicity (danger to their host), and are important to consider
 * alongside the genes which they vary from.
 */
export class Variant implements FilterableSearchOption {
  // Interface properties
  optionName: string;

  origin: Gene;
  id: number;
  variantTypes: Observable<VariantType[]>;
}

/**
 * The Variant Type of a given variant often defines its pathogenicity.
 */
export class VariantType implements FilterableSearchOption {
  optionName: string;
  origin: Variant;
}

export const MergeProperties = (property1: any, property2: any): any => {
  if (property1) {
    if (property2) {
      if (property1 !== property1)  {
        console.log('Conflicting values between ' + property1 + ' and ' + property2);
      }
      return property1;
    } else {
      return property1;
    }
  } else {
    if (!property2) {
      console.log('Neither property is defined!');
    }

    return property2;
  }
}
