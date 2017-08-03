import { FilterableSearchOption } from '../data-entry/filterable-search/filterable-search.component';

/**
 * The gene class provides a quick and easy way to obtain gene names, various IDs, and so on from a
 * variety of databases.  Eventually this class will be made FHIR compliant to speed up FHIR bundle
 * conversion.
 */
export class Gene implements FilterableSearchOption {
  // Class properties
  hugo_symbol: string;
  score: number;
  entrez_id: number;

  constructor (hugo_symbol: string, score: number, entrez_id: number) {
    this.hugo_symbol = hugo_symbol;
    this.score = score;
    this.entrez_id = entrez_id;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  mergeWith = (other: Gene) => {
    this.entrez_id = MergeProperties(this.entrez_id, other.entrez_id);
    this.hugo_symbol = MergeProperties(this.hugo_symbol, other.hugo_symbol);
    this.score = MergeProperties(this.score, other.score);
  }

  optionName = () => {
    return this.hugo_symbol;
  }
}

/**
 * Gene variants vary in their pathogenicity (danger to their host), and are important to consider
 * alongside the genes which they vary from.
 */
export class Variant implements FilterableSearchOption {
  origin: Gene;
  variant_name: string;
  hgvs_id: string;
  score: number;
  description: string;
  somatic: boolean;
  types: string[];
  chromosome: number;
  start: number;
  end: number;
  variation: string;

  constructor(_origin: Gene, _hugo_symbol: string, _hgvs_id: string, _score: number, _description: string, _somatic: boolean, _types: string[], _chromosome: number, _start: number, _end: number) {
    this.origin = _origin;
    this.variant_name = _hugo_symbol;
    this.hgvs_id = _hgvs_id;
    this.score = _score;
    this.description = _description;
    this.somatic = _somatic;
    this.types = _types;
    this.chromosome = _chromosome;
    this.start = _start;
    this.end = _end;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  mergeWith = (other: Variant) => {
    this.origin = MergeProperties(this.origin, other.origin);
    this.variant_name = MergeProperties(this.variant_name, other.variant_name);
    this.hgvs_id = MergeProperties(this.hgvs_id, other.hgvs_id);
    this.score = MergeProperties(this.score, other.score);
  }

  optionName = () => {
    return this.variant_name;
  }

  toIntelligentDisplayRepresentation = () => {
    return this.origin.hugo_symbol + ' ' + this.variant_name + ' ' + this.origin.entrez_id + ' ' + this.hgvs_id;
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
