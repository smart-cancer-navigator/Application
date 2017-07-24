import { FilterableSearchOption } from './filterable-search-option';
import { GeneVariantType } from './genomic-data';

export class CancerType implements FilterableSearchOption {
  public optionName: string;
  public fhirID: number;
  public pathogenicity: number;
  public geneVariantTypes: GeneVariantType[];

  constructor(optionNameParam: string, fhirIDParam: number, pathogenicityParam: number) {
    this.optionName = optionNameParam;
    this.fhirID = fhirIDParam;
    this.pathogenicity = pathogenicityParam;
    this.geneVariantTypes = [];
  }
}
