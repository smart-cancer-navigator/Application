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
  score: number;
  entrez_id: number;
  entrez_name: string;
  symbol: string;
  taxid: number;

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  mergeWith = (other: Gene) => {
    this.entrez_id = MergeProperties(this.entrez_id, other.entrez_id);
    this.entrez_name = MergeProperties(this.entrez_name, other.entrez_name);
    this.taxid = MergeProperties(this.taxid, other.taxid);
    this.optionName = MergeProperties(this.optionName, other.optionName);
    this.symbol = MergeProperties(this.symbol, other.symbol);
    this.score = MergeProperties(this.score, other.score);
  }

  equals = (other: Gene): boolean => {
    return this.entrez_id === other.entrez_id
      && this.score === other.score
      && this.entrez_name === other.entrez_name
      && this.symbol === other.symbol
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
  entrez_name: string;
  entrez_id: number;
  hgvs_id: string;
  score: number;
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
