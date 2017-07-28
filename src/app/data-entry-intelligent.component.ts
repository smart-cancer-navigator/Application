/**
 * This component constitutes three filterable search menus into a single component, making it easier for the
 * data entry component to populate the form.
 */

import {Component, Injectable, Input, ViewChild} from '@angular/core';

import { Gene, Variant } from './genomic-data';
import { GeneSearchService } from './gene-search.service';
import { VariantSearchService } from './variant-search.service';
import { GeneDataRow } from './data-entry-form.component';

@Component({
  selector: 'data-entry-intelligent',
  template: `
    <input type="text" placeholder="Type Here">
  `,
  styles: [`
    input {
      height: 60px;
      font-size: 40px;
      text-align: center;
      margin: 10px 5px;
      border: 1px solid #979797;
      border-radius: 4px;
      padding: 0;
      width: calc(100% - 12px);
    }
  `],
  providers: [GeneSearchService, VariantSearchService]
})

@Injectable()
export class DataEntryIntelligentComponent {

  @Input() geneDataRow: GeneDataRow;

  onGeneSelected = (gene: Gene) => {
    this.geneDataRow.gene = gene;
    this.variantSearchService.onGeneChosen(gene);
  }

  onVariantSelected = (variant: Variant) => {
    this.geneDataRow.variant = variant;
  }

  validate = (value: string) => {
  }

  constructor (public geneSearchService: GeneSearchService, public variantSearchService: VariantSearchService) {}
}
