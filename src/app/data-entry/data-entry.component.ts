/**
 * Data entry is an essential part of the final application that will be built, and it must be built in
 * a way which permits dynamic addition and removal of form elements.  Since Angular makes modularity
 * insanely easy and you can build custom input selectors, this shouldn't require too much code.
 */

import { Component, OnInit } from '@angular/core';
import { Variant } from '../global/genomic-data';
import { SELECTED_CANCER_TYPE } from '../cancertype-selection/cancertype-selection.component';
import { Router } from '@angular/router';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataEntryService } from './data-entry.service';

export let USER_SELECTED_VARIANTS: Variant[] = [];

class VariantWrapper {
  constructor(_index: number, _variant: Variant) {
    this.index = _index;
    this.variant = _variant;
  }

  index: number;
  variant: Variant;
}

@Component({
  selector: 'data-entry',
  template: `
    <!-- Gene Variation List -->
    <div *ngFor="let variant of variants" class="entryPanel">
      <div class="panel-heading">
        <p>Variation {{variant.index + 1}}</p>
        <button type="button" class="btn btn-danger" (click)="removeRow(variant.index)">X</button>
      </div>
      <div class="panel-body">
        <filterable-search #VariantFilter [searchService]="dataEntryService" [placeholderString]="'Search Variants'" (onSelected)="variant.variant = $event"></filterable-search>
      </div>
    </div>

    <!-- Finalize buttons -->
    <button (click)="addRow()" style="float: left;" type="button" class="btn btn-primary formButton">Add Row</button>
    <button (click)="complete()" style="float: right" type="button" class="btn btn-success formButton">I'm Done!
    </button>
  `,
  styles: [`    
    .entryPanel {
      border: 0.5px solid black;
      border-radius: 5px;
      margin-top: 5px;
      margin-left: 0;
      margin-bottom: 5px;
    }

    .panel-heading {
      height: 30px;
      padding: 0;
      background-color: black;
    }

    .panel-heading p {
      float: left;
      margin: 5px;
      font-size: 15px;
      text-align: left;
      width: 80px;
      color: white;
    }

    .panel-heading select {
      width: 200px;
      margin: 1.5px;
      height: 25px;
      font-size: 17px;
      text-align-last: center;
    }

    .panel-heading button {
      margin: 0;
      height: 30px;
      width: 30px;
      float: right;
      padding: 0;
    }

    .panel-body {
      width: 100%;
      height: 50px;
      padding: 4px;
    }

    .formButton {
      width: calc(50% - 10px);
    }
  `],
  providers: [NgbTabsetConfig] // add NgbTabsetConfig to the component providers
})
export class DataEntryFormComponent implements OnInit {
  constructor(private router: Router, public dataEntryService: DataEntryService) {}

  variants: VariantWrapper[] = [];

  /**
   * So typically the DOM would be updated upon changing the variants array (as we do in the form).  However, by
   * specifying this function, we prevent that from happening.
   */
  ngOnInit() {
    console.log('Selected Cancer Type', SELECTED_CANCER_TYPE);
    this.addRow();
  }

  addRow() {
    this.variants.push(new VariantWrapper(this.variants.length, null)); // Add an empty variant to the variation list.
  }

  removeRow(arrayIndex: number) {
    if (arrayIndex > -1 && arrayIndex < this.variants.length) {
      this.variants.splice(arrayIndex, 1);
    }

    for (let i = 0; i < this.variants.length; i++) {
      this.variants[i].index = i;
    }
  }

  complete(): void {
    const filteredVariants: Variant[] = [];

    // Filter variants
    for (const variantWrapper of this.variants) {
      if (variantWrapper.variant !== null) {
        filteredVariants.push(variantWrapper.variant);
      }
    }
    USER_SELECTED_VARIANTS = filteredVariants;

    this.router.navigate(['/visualize-results']);
  }
}
