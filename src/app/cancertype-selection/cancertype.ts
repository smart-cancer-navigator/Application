import { FilterableSearchOption } from '../data-entry/filterable-search/filterable-search.component';

export class CancerType implements FilterableSearchOption {
  public optionName: string;
  public fhirID: number;
  public pathogenicity: number;

  constructor(optionNameParam: string, fhirIDParam: number, pathogenicityParam: number) {
    this.optionName = optionNameParam;
    this.fhirID = fhirIDParam;
    this.pathogenicity = pathogenicityParam;
  }
}
