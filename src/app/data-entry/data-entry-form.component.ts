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

// Wrapper class to maintain indices.
export class GeneDataRow {
  arrayIndex: number;
  variant: Variant;

  constructor (arrayIndexParam: number) {
    this.arrayIndex = arrayIndexParam;
  }
}

export let USER_SELECTED_VARIANTS: Variant[] = [];

@Component({
  selector: 'data-entry',
  template: `
    <!-- Gene Variation List -->
    <div *ngFor="let geneVariation of geneVariations; let i=index;" class="entryPanel">
      <div class="panel-heading">
        <p>Variation {{i + 1}}</p>
        <button class="clickable" (click)="removeRow(i)">X</button>
      </div>
      <div class="panel-body">
        <ngb-tabset>
          <ngb-tab title="Robust Selection">
            <ng-template ngbTabContent>
              <data-entry-robust (selectNewVariant)="geneVariation.variant = $event"></data-entry-robust>
            </ng-template>
          </ngb-tab>
          <ngb-tab title="Intelligent Selection">
            <ng-template ngbTabContent>
              <data-entry-intelligent (selectNewVariant)="geneVariation.variant = $event"></data-entry-intelligent>
            </ng-template>
          </ngb-tab>
        </ngb-tabset>
      </div>
    </div>

    <button (click)="addRow()" id="addRowButton" class="finalizeButton clickable">Add Row</button>
    <button (click)="complete()" id="completeButton" class="finalizeButton clickable">Completed</button>
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
      background-color: red;
      border: 1px solid white;
      border-radius: 5px;
      padding: 0;
      font-size: 20px;
      color: white;
    }

    .clickable {
      opacity: 1;
    }

    .clickable:hover {
      opacity: 0.7;
    }

    .clickable:active {
      opacity: 0.5;
    }

    button:disabled {
      opacity: 0.5;
    }

    .panel-body {
      width: calc(100% - 8px);
      height: 120px;
      padding: 4px;
    }

    address {
      width: 100%;
    }

    .finalizeButton {
      width: calc(100% - 2px);
      height: 30px;
      border: 1px solid black;
      border-radius: 10px;
      color: white;
      font-size: 20px;
    }

    #addRowButton {
      background-color: #718599;
    }

    #completeButton {
      background-color: #779971;
    }
  `],
  providers: [NgbTabsetConfig] // add NgbTabsetConfig to the component providers
})
export class DataEntryFormComponent implements OnInit {
  constructor(private router: Router, config: NgbTabsetConfig) {
    // customize default values of tabsets used by this component tree
    config.justify = 'center';
    config.type = 'pills';
  }

  geneVariations: GeneDataRow[] = [];

  ngOnInit() {
    console.log('Selected Cancer Type', SELECTED_CANCER_TYPE);
    this.addRow();
  }

  addRow() {
    this.geneVariations.push(new GeneDataRow(this.geneVariations.length + 1));
  }

  removeRow(arrayIndex: number) {
    if (arrayIndex > -1 && arrayIndex < this.geneVariations.length) {
      this.geneVariations.splice(arrayIndex, 1);
    }

    for (let i = 0; i < this.geneVariations.length; i++) {
      this.geneVariations[i].arrayIndex = i;
    }
  }

  complete(): void {
    const variants: Variant[] = [];

    // Filter variants
    for (const geneVariation of this.geneVariations) {
      if (geneVariation.variant) {
        variants.push(geneVariation.variant);
      }
    }
    USER_SELECTED_VARIANTS = variants;

    this.router.navigate(['/visualize-results']);
  }
}
