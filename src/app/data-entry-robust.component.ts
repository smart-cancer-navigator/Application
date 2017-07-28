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
  selector: 'data-entry-robust',
  template: `
    <div [style.width]="variantSearchService.geneContext === undefined ? 'calc(100% - 8px)' : 'calc(50% - 8px)'">
      <select #GeneInputType  (change)="'this makes ngIf evaluate (keep it here!)'">
        <option selected>HUGO Symbol</option>
      </select>
      <filterable-search #GeneFilter *ngIf="GeneInputType.selectedIndex === 0" [searchService]="geneSearchService" [placeholderString]="'Gene'" (onSelected)="onGeneSelected($event); VariantFilter.clearField()"></filterable-search>
    </div>
    <div>
      <select #VariantInputType [hidden]="variantSearchService.geneContext === undefined" (change)="'this makes ngIf evaluate (keep it here!)'">
        <option selected>Variant Name</option>
        <option>HGVS ID</option>
      </select>
      <filterable-search #VariantFilter [hidden]="variantSearchService.geneContext === undefined || VariantInputType.selectedIndex !== 0" [searchService]="variantSearchService" [placeholderString]="'Variant'" (onSelected)="onVariantSelected($event);"></filterable-search>
      <input #VariantHGVSIDInput autocomplete="false" [hidden]="variantSearchService.geneContext === undefined || VariantInputType.selectedIndex !== 1" type="text" id="hgvsInput" (input)="validate(VariantHGVSIDInput.value)" [style.background-color]="hgvsInputValid ? 'rgba(0, 128, 0, 0.31)' : 'rgba(128, 0, 0, 0.4)'">
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

    #hgvsInput {
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
export class DataEntryRobustComponent {
  hgvsInputValid: boolean;

  @Input() geneDataRow: GeneDataRow;

  onGeneSelected = (gene: Gene) => {
    this.geneDataRow.gene = gene;
    this.variantSearchService.onGeneChosen(gene);
  }

  onVariantSelected = (variant: Variant) => {
    this.geneDataRow.variant = variant;
  }

  validate = (value: string) => {
    this.variantSearchService.validateHGVSID(value).subscribe(result => this.hgvsInputValid = result);
  }

  constructor (public geneSearchService: GeneSearchService, public variantSearchService: VariantSearchService) {}
}
