import { FilterableSearchOption } from '../data-entry/filterable-search/filterable-search.component';

export class CancerType implements FilterableSearchOption {
  conditionName: string;
  fhirID: number;
  pathogenicity: number;

  constructor(_conditionName: string, _fhirID: number, _pathogenicity: number) {
    this.conditionName = _conditionName;
    this.fhirID = _fhirID;
    this.pathogenicity = _pathogenicity;
  }

  public optionName = () => {
    return this.conditionName;
  }
}
