/**
 * Data entry is an essential part of the final application that will be built, and it must be built in
 * a way which permits dynamic addition and removal of form elements.  Since Angular makes modularity
 * insanely easy and you can build custom input selectors, this shouldn't require too much code.
 * (Following https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2) to some
 * extent.
 */

import { Component, OnInit } from '@angular/core';
import {Gene, Variant, VariantType} from './genomic-data';
import {Observable} from 'rxjs/Observable';

export class GeneDataRow {
  arrayIndex: number;
  gene: Gene;
  variant: Variant;
  type: VariantType;

  constructor (arrayIndexParam: number) {
    this.arrayIndex = arrayIndexParam;
  }
}

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
        <data-entry-row [geneDataRow]="geneVariation"></data-entry-row>
      </div>
    </div>

    <button type="button" (click)="addRow()" class="finalizeButton clickable">Add Row</button>
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
      width: calc(100% - 40px);
      color: white;
    }

    .panel-heading button {
      outline: none;
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
      width: 100%;
      height: 40px;
    }

    address {
      width: 100%;
    }

    .finalizeButton {
      width: calc(100% - 2px);
      height: 30px;
      border: 1px solid black;
      border-radius: 10px;
      background-color: #718599;
      color: white;
      font-size: 20px;
    }
  `]
})
export class DataEntryComponent implements OnInit {

  geneVariations: GeneDataRow[] = [];

  constructor() { }

  ngOnInit() {
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

  save(model: any) {
    // call API to save
    // ...
    console.log(model);
  }
}
