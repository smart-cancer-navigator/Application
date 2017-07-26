import { FilterableSearchOption } from './filterable-search.component';
import {Observable} from 'rxjs/Observable';

/**
 * The gene class provides a quick and easy way to obtain gene names, various IDs, and so on from a
 * variety of databases.  Eventually this class will be made FHIR compliant to speed up FHIR bundle
 * conversion.
 */
export class Gene implements FilterableSearchOption {
  optionName: string;
  id: number;
  variants: Observable<Variant[]>; // This is classified as an Observable, since they may be stored as GET requests.

  constructor (optionNameParam: string, idParam: number, ) {
    this.optionName = optionNameParam;
    this.id = idParam;
  }

  setVariants(variantsParam: Observable <Variant[]>) {
    this.variants = variantsParam;
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
  variantTypes: Observable<VariantType[]>;

  constructor(optionNameParam: string, originParam: Gene, idParam: number) {
    this.optionName = optionNameParam;
    this.origin = originParam;
    this.id = idParam;
  }

  setVariantTypes(variantTypesParam: Observable <VariantType[]>) {
    this.variantTypes = variantTypesParam;
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
