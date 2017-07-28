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
  hugo_symbol: string;
  score: number;
  entrez_id: number;

  constructor (hugo_symbol: string, score: number, entrez_id: number) {
    this.hugo_symbol = hugo_symbol;
    this.score = score;
    this.entrez_id = entrez_id;

    this.optionName = hugo_symbol;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  mergeWith = (other: Gene) => {
    this.entrez_id = MergeProperties(this.entrez_id, other.entrez_id);
    this.hugo_symbol = MergeProperties(this.hugo_symbol, other.hugo_symbol);
    this.score = MergeProperties(this.score, other.score);
  }

  equals = (other: Gene): boolean => {
    return this.entrez_id === other.entrez_id
      && this.score === other.score
      && this.hugo_symbol === other.hugo_symbol;
  }
}

/**
 * Gene variants vary in their pathogenicity (danger to their host), and are important to consider
 * alongside the genes which they vary from.
 */
export class Variant implements FilterableSearchOption {
  // Interface properties
  optionName: string;

  // Class properties
  origin: Gene;
  hugo_symbol: string;
  hgvs_id: string;
  score: number;

  constructor(origin: Gene, hugo_symbol: string, hgvs_id: string, score: number) {
    this.origin = origin;
    this.hugo_symbol = hugo_symbol;
    this.hgvs_id = hgvs_id;
    this.score = score;

    this.optionName = hugo_symbol;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  mergeWith = (other: Variant) => {
    this.origin = MergeProperties(this.origin, other.origin);
    this.hugo_symbol = MergeProperties(this.hugo_symbol, other.hugo_symbol);
    this.hgvs_id = MergeProperties(this.hgvs_id, other.hgvs_id);
    this.score = MergeProperties(this.score, other.score);
  }
}

export const MergeProperties = (property1: any, property2: any): any => {
  if (typeof property1 !== typeof property2) {
    console.log(property1 + ' and ' + property2 + ' have a type mismatch!');
    return property1;
  }

  if (property1 instanceof Array) {
    return property1.length > property2.length ? property1 : property2;
  }

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
