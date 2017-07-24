import { FilterableSearchOption } from './filterable-search-option.interface';

/**
 * The gene class provides a quick and easy way to obtain gene names, various IDs, and so on from a
 * variety of databases.  Eventually this class will be made FHIR compliant to speed up FHIR bundle
 * conversion.
 */
export class Gene implements FilterableSearchOption {
  optionName: string;
  id: number;

  constructor(optionNameParam: string, idParam: number) {
    this.optionName = optionNameParam;
    this.id = idParam;
  }
}

/**
 * Gene variants vary in their pathogenicity (danger to their host), and are important to consider
 * alongside the genes which they vary from.
 */
export class Variant implements FilterableSearchOption {
  optionName: string;
  origin: Gene;
  id: number;

  constructor(optionNameParam: string, originParam: Gene, idParam: number) {
    this.optionName = optionNameParam;
    this.origin = originParam;
    this.id = idParam;
  }
}

/**
 * The Variant Type of a given variant often defines its pathogenicity.
 */
export class VariantType implements FilterableSearchOption {
  optionName: string;
  origin: Variant;

  constructor(optionNameParam: string, originParam: Variant) {
    this.optionName = optionNameParam;
    this.origin = originParam;
  }
}

/**
 * Wrapper class for 3 given instances of genes, variants, and variant types respectively.
 */
export class GeneVariantType {
  gene: Gene;
  variant: Variant;
  type: VariantType;

  constructor(geneParam: Gene, variantParam: Variant, typeParam: VariantType) {
    this.gene = geneParam;
    this.variant = variantParam;
    this.type = typeParam;
  }
}
