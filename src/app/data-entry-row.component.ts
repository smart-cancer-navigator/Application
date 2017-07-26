/**
 * This component constitutes three filterable search menus into a single component, making it easier for the
 * data entry component to populate the form.
 */

import { Component, Injectable, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

import {Gene, Variant, VariantType} from './genomic-data';
import { GeneSearchService } from './gene-search.service';
import { VariantSearchService } from './variant-search.service';
import { VariantTypeSearchService } from './variant-type-search.service';
import {GeneDataRow} from './data-entry.component';

@Component({
  selector: 'data-entry-row',
  template: `
    <div>
      <filterable-search #GeneFilter [searchService]="geneSearchService" [placeholderString]="'Gene'" (onSelected)="onGeneSelected($event); VariantFilter.clearField(); TypeFilter.clearField();"></filterable-search>
    </div>
    <div>
      <filterable-search #VariantFilter [searchService]="variantSearchService" [placeholderString]="'Variant'" (onSelected)="onVariantSelected($event); TypeFilter.clearField()"></filterable-search>
    </div>
    <div>
      <filterable-search #TypeFilter [searchService]="variantTypeSearchService" [placeholderString]="'Variant Type'" (onSelected)="onVariantTypeSelected($event)"></filterable-search>
    </div>
  `,
  styles: [`    
    div {
      float: left;
      margin: 4px;
      width: calc(33.333% - 8px);
    }
  `],
  providers: [GeneSearchService, VariantSearchService, VariantTypeSearchService]
})

@Injectable()
export class DataEntryRowComponent {
  @Input() geneDataRow: GeneDataRow;

  onGeneSelected = (gene: Gene) => {
    this.geneDataRow.gene = gene;
    this.variantSearchService.onGeneChosen(gene);
  }

  onVariantSelected = (variant: Variant) => {
    this.geneDataRow.variant = variant;
    this.variantTypeSearchService.onVariantChosen(variant);
  }

  onVariantTypeSelected = (type: VariantType) => {
    this.geneDataRow.type = type;
  }

  constructor (public geneSearchService: GeneSearchService, public variantSearchService: VariantSearchService, public variantTypeSearchService: VariantTypeSearchService) {}
}
