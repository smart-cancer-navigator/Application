/**
 * This component constitutes three filterable search menus into a single component, making it easier for the
 * data entry component to populate the form.
 */

import { Component, EventEmitter, Injectable, Output } from '@angular/core';

import { Gene, Variant } from '../../../global/genomic-data';
import { RobustGeneSearchService } from './robust-gene-search.service';
import { RobustVariantSearchService } from './robust-variant-search.service';

@Component({
  selector: 'data-entry-robust',
  template: `
    <div id="GeneInputPanel" [style.width]="variantSearchService.geneContext === undefined ? 'calc(100% - 8px)' : 'calc(50% - 8px)'">
      <filterable-search #GeneFilter [searchService]="geneSearchService" [placeholderString]="'Search Genes'" (onSelected)="onGeneSelected($event); VariantFilter.clearField()"></filterable-search>
    </div>
    <div id="VariantInputPanel" [hidden]="variantSearchService.geneContext === undefined" >
      <filterable-search #VariantFilter [searchService]="variantSearchService" [placeholderString]="'Search Variants'" (onSelected)="onVariantSelected($event);"></filterable-search>
    </div>
  `,
  styles: [`
    div {
      float: left;
      width: calc(50% - 8px);
      height: 30px;
      margin: 20px 4px;
    }
  `],
  providers: [RobustGeneSearchService, RobustVariantSearchService]
})

@Injectable()
export class DataEntryRobustComponent {

  constructor (public geneSearchService: RobustGeneSearchService, public variantSearchService: RobustVariantSearchService) {}

  hgvsInputValid: boolean;

  @Output() selectNewVariant: EventEmitter<Variant> = new EventEmitter();

  onGeneSelected = (gene: Gene) => {
    this.variantSearchService.onGeneChosen(gene);
  }

  onVariantSelected = (variant: Variant) => {
    console.log('Emitting', variant);
    this.selectNewVariant.emit(variant);
  }
}
