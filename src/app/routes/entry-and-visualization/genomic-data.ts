import { IFilterableSearchOption } from "./filterable-search/filterable-search.component";
import { IMergeable, MergeProperties } from "./data-merging";
import { DrugReference } from "./variant-visualization/drugs/drug";
import {Injectable} from "@angular/core";
import {AssocReference} from "./variant-visualization/assocs/assocs";

/**
 * The gene reference class includes only the base properties for a given gene; those which are required for merging
 * and such.
 */
export class GeneReference implements IMergeable
{
  constructor (_hugoSymbol: string, _entrezID: number)
  {
    this.hugoSymbol = _hugoSymbol;
    this.entrezID = _entrezID;
  }
  hugoSymbol: string;
  entrezID: number;

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  mergeable = (other: GeneReference) =>
  {
    if (!this.hugoSymbol || this.hugoSymbol === "")
      return false;

    return this.hugoSymbol === other.hugoSymbol;
  }

  merge = (other: GeneReference) =>
  {
    this.entrezID = MergeProperties(this.entrezID, other.entrezID);
  }

  toString = (): string => {
    return this.hugoSymbol + " " + this.entrezID;
  }
}

/**
 * The gene class provides a quick and easy way to obtain gene names, various IDs, and so on from a
 * variety of databases.  Eventually this class will be made FHIR compliant to speed up FHIR bundle
 * conversion.
 */
export class Pathway {
  constructor (_id: string, _name: string) {
    this.id = _id;
    this.name = _name;
  }
  id: string;
  name: string;
}

/**
 * Contains additional data than the GeneReference.
 */
export class Gene
{
  static fromReference(reference: GeneReference)
  {
    const newGene = new Gene(reference.hugoSymbol);
    newGene.entrezID = reference.entrezID;
    return newGene;
  }

  constructor(_hugoSymbol: string)
  {
    this.hugoSymbol = _hugoSymbol;
  }

  // Class properties
  hugoSymbol: string;
  entrezID: number;
  name: string;
  description: string;
  type: string;
  aliases: string[];
  pathways: Pathway[] = [];
  chromosome: string;
  start: number;
  end: number;
  strand: number;

  /**
   * Concatenates all genomic pathways for the variant in question.
   * @returns {string}
   */
  pathwaysString = (): string =>
  {
    if (!this.pathways || this.pathways.length === 0)
      return "";

    let current = "The " + this.pathways[0].name;
    for (let i = 1; i < this.pathways.length; i++) {
      if (i < this.pathways.length - 1) {
        current = current + ", the " + this.pathways[i].name;
      } else {
        current = current + ", and the " + this.pathways[i].name;
      }
    }
    return current;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  mergeable = (other: Gene) =>
  {
    if (!this.hugoSymbol || this.hugoSymbol === "")
      return false;

    return this.hugoSymbol === other.hugoSymbol;
  }

  merge = (other: Gene) =>
  {
    this.entrezID = MergeProperties(this.entrezID, other.entrezID);
    this.name = MergeProperties(this.name, other.name);
    this.description = MergeProperties(this.description, other.description);
    this.type = MergeProperties(this.type, other.type);
    this.aliases = MergeProperties(this.aliases, other.aliases);
  }
}

/**
 * The variant reference is better way to get only the basic info required for a given variant.
 */
export class VariantReference implements IFilterableSearchOption, IMergeable
{
  constructor(_origin: GeneReference, _variantName: string, _hgvsID: string)
  {
    this.origin = _origin;
    this.variantName = _variantName;
    this.hgvsID = _hgvsID;
  }
  origin: GeneReference;
  variantName: string;
  hgvsID: string;

  optionName = () =>
  {
    return this.origin.hugoSymbol + " " + this.variantName + " " + this.origin.entrezID + " " + this.hgvsID;
  }

  /**
   * Merging methods
   */
  mergeable = (other: VariantReference) =>
  {
    return this.variantName === other.variantName && this.origin.mergeable(other.origin);
  }

  // Merges another variant reference into this variant reference (overwriting properties if the property of one is undefined).
  merge = (other: VariantReference) =>
  {
    // Determine which HGVS ID to use since we don't want to mess this one up.
    if (other.hgvsID.indexOf("chr") !== -1)
      this.hgvsID = other.hgvsID;
    else if (this.hgvsID.indexOf("chr") !== -1)
      other.hgvsID = this.hgvsID;

    // Merge both genes.
    this.origin.merge(other.origin);

    console.log("Merged " + this.toString() + " and " + other.toString());
  }

  toString = (): string =>
  {
    return this.origin.toString() + " " + this.variantName + " " + this.hgvsID;
  }
}

/**
 * Gene variants vary in their pathogenicity (danger to their host), and are important to consider
 * alongside the genes which they vary from.
 */
export class Classification
{
  constructor (_name: string, _source: string)
  {
    this.name = _name;
    this.sources = [_source];
  }
  name: string;
  sources: string[];
}

/**
 * Contains the data required to display a variant.
 */
export class Variant
{
  static fromReference(reference: VariantReference)
  {
    return new Variant(Gene.fromReference(reference.origin), reference.variantName, reference.hgvsID);
  }

  constructor(_origin: Gene, _variantName: string, _hgvsID: string)
  {
    this.origin = _origin;
    this.variantName = _variantName;
    this.hgvsID = _hgvsID;
  }

  origin: Gene;
  variantName: string;
  hgvsID: string;
  score: number = 0;
  description: string;
  somatic: boolean;
  types: string[];
  drugs: DrugReference[];


  classifications: Classification[];
  diseases: string[];
  chromosome: string; // For potential edge cases when the variant has no associated gene.
  start: number;
  end: number;

  optionName = () =>
  {
    return this.origin.hugoSymbol + " " + this.variantName + " " + this.origin.entrezID + " " + this.hgvsID;
  }

  getClassification = () =>
  {
    let maxAgreements = 0;
    let verdict = "";
    for (const classification of this.classifications) {
      if (maxAgreements < classification.sources.length) {
        maxAgreements = classification.sources.length;
        verdict = classification.name;
      }
    }
    return verdict;
  }

  /**
   * Merging methods
   */
  mergeable = (other: Variant) =>
  {
    return this.hgvsID === other.hgvsID && this.origin.mergeable(other.origin);
  }

  // Merges another variant reference into this variant reference (overwriting properties if the property of one is undefined).
  merge = (other: Variant) =>
  {
    this.origin.merge(other.origin);
    this.variantName = MergeProperties(this.variantName, other.variantName);
    this.hgvsID = MergeProperties(this.hgvsID, other.hgvsID);
    this.score = MergeProperties(this.score, other.score);
    this.description = MergeProperties(this.description, other.description);
    this.somatic = MergeProperties(this.somatic, other.somatic);
    this.types = MergeProperties(this.types, other.types);
    this.drugs = MergeProperties(this.drugs, other.drugs);
    this.diseases = MergeProperties(this.drugs, other.drugs);
  }

  getLocation = () => {
    return this.start === this.end ? "Nucleotide " + this.start : "Nucleotides " + this.start + " to " + this.end;
  }
}
