/**
 * This component constitutes three filterable search menus into a single component, making it easier for the
 * data entry component to populate the form.
 */

import {Component, Injectable, Input, ViewChild} from '@angular/core';

import {Gene, Variant} from './genomic-data';
import { GeneSearchService } from './gene-search.service';
import { VariantSearchService } from './variant-search.service';
import {GeneDataRow} from './data-entry.component';

@Component({
  selector: 'data-entry-row',
  template: `
    <div>
      <select #GeneInputType>
        <option selected>Entrez Symbol</option>
      </select>
      <filterable-search *ngIf="GeneInputType.selectedIndex === 0" #GeneFilter [searchService]="geneSearchService" [placeholderString]="'Gene'" (onSelected)="onGeneSelected($event); VariantFilter.clearField()"></filterable-search>
    </div>
    <div>
      <select [hidden]="variantSearchService.geneContext === undefined" #VariantInputType (change)="'this makes ngIf evaluate (keep it here!)'">
        <option selected>Entrez Symbol</option>
        <option>HGVS ID</option>
      </select>
      <filterable-search #VariantFilter [hidden]="variantSearchService.geneContext === undefined || VariantInputType.selectedIndex !== 0" [searchService]="variantSearchService" [placeholderString]="'Variant'" (onSelected)="onVariantSelected($event);"></filterable-search>
      <input #VariantHGVSInput [hidden]="variantSearchService.geneContext === undefined || VariantInputType.selectedIndex !== 1" type="text" id="variantHGVSInput" autofocus (keyup)="'this makes something happen'" [style.background-color]="variantSearchService.validateHGVSID(VariantHGVSInput.value) ? 'green' : 'red'">
    </div>
  `,
  styles: [`
    div {
      float: left;
      margin: 4px;
      width: calc(50% - 8px);
    }

    div * {
      width: 100%;
      margin: 4px 0;
    }

    select {
      height: 30px;
      text-align-last: center;
      font-size: 20px;
    }

    #variantHGVSInput {
      height: 16px;
      width: calc(100% - 16px);
      font-size: 18px;
      padding: 5px;
      margin: 0 2px;
      border: 2px dotted black;
      border-radius: 10px;
      text-align: center;
    }
  `],
  providers: [GeneSearchService, VariantSearchService]
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
  }

  constructor (public geneSearchService: GeneSearchService, public variantSearchService: VariantSearchService) {}
}
