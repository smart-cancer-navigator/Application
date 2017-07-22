import {FilterableSearchOption} from './filterable-search-option';

export class CancerType implements FilterableSearchOption {
  public optionName: string;
  public pathogenicity: number;

  constructor(optionNameParam: string, pathogenicityParam: number) {
    this.optionName = optionNameParam;
    this.pathogenicity = pathogenicityParam;
  }
}
