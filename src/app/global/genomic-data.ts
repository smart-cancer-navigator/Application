import { IFilterableSearchOption } from "../data-entry/filterable-search/filterable-search.component";
import { IMergeable, MergeProperties } from "./data-merging";
import { DrugReference } from "../visualize-results/drugs/drug";

/**
 * The gene class provides a quick and easy way to obtain gene names, various IDs, and so on from a
 * variety of databases.  Eventually this class will be made FHIR compliant to speed up FHIR bundle
 * conversion.
 */
export class Gene implements IMergeable {
  constructor (_hugo_symbol: string) {
    this.hugo_symbol = _hugo_symbol;
  }

  // Class properties
  hugo_symbol: string;
  name: string;
  score: number;
  entrez_id: number;

  mergeable = (other: Gene) => {
    if (this.hugo_symbol === "" || this.name === "") {
      return false;
    }
    return this.hugo_symbol === other.hugo_symbol || this.name === other.name;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  merge = (other: Gene) => {
    this.entrez_id = MergeProperties(this.entrez_id, other.entrez_id);
    this.hugo_symbol = MergeProperties(this.hugo_symbol, other.hugo_symbol);
    this.score = MergeProperties(this.score, other.score);
  }
}

/**
 * Gene variants vary in their pathogenicity (danger to their host), and are important to consider
 * alongside the genes which they vary from.
 */
export class Variant implements IFilterableSearchOption, IMergeable {
  constructor(_origin: Gene, _variant_name: string, _hgvs_id: string) {
    this.origin = _origin;
    this.variant_name = _variant_name;
    this.hgvs_id = _hgvs_id;
  }

  origin: Gene;
  variant_name: string;
  hgvs_id: string;
  score: number = 0;
  description: string;
  somatic: boolean;
  types: string[];
  drugs: DrugReference[];
  diseases: string[];
  chromosome: string;
  start: number;
  end: number;

  mergeable = (other: Variant) => {
    return this.origin.mergeable(other.origin) && this.hgvs_id === other.hgvs_id;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  merge = (other: Variant) => {
    this.origin.merge(other.origin);
    this.variant_name = MergeProperties(this.variant_name, other.variant_name);
    this.score = MergeProperties(this.score, other.score);
    this.description = MergeProperties(this.description, other.description);
    this.somatic = MergeProperties(this.somatic, other.somatic);
    this.types = MergeProperties(this.types, other.types);
    this.drugs = MergeProperties(this.drugs, other.drugs);
    this.diseases = MergeProperties(this.diseases, other.diseases);
    this.chromosome = MergeProperties(this.chromosome, other.chromosome);
    this.start = MergeProperties(this.start, other.start);
    this.end = MergeProperties(this.end, other.end);
  }

  optionName = () => {
    return this.origin.hugo_symbol + " " + this.variant_name + " " + this.origin.entrez_id + " " + this.hgvs_id;
  }

  getLocation = () => {
    return this.chromosome + ", " + (this.start !== this.end ? "Nucleotides " +  this.start + " to " + this.end : "Nucleotide " + this.start);
  }
}
