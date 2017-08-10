/**
 * Data entry is an essential part of the final application that will be built, and it must be built in
 * a way which permits dynamic addition and removal of form elements.  Since Angular makes modularity
 * insanely easy and you can build custom input selectors, this shouldn"t require too much code.
 */

import { Component, OnInit } from "@angular/core";
import { Variant } from "../global/genomic-data";
import { Router } from "@angular/router";
import { NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { DataEntryService } from "./data-entry.service";
import { SMARTClient } from "../smart-initialization/smart-reference.service";

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
  selector: "data-entry",
  template: `
    <!-- Gene Variation List -->
    <div *ngFor="let variant of variants" class="entryPanel">
      <div class="panel-heading">
        <p>Variation {{variant.index + 1}}</p>
        <button type="button" class="btn btn-danger" (click)="removeRow(variant.index)">X</button>
      </div>
      <div class="panel-body">
        <filterable-search #VariantFilter [searchService]="dataEntryService" [placeholderString]="'Search Variants'" [(ngModel)]="variant.variant"></filterable-search>
      </div>
    </div>

    <!-- Finalize buttons -->
    <button (click)="addRow()" style="float: left;" type="button" class="btn btn-primary formButton">New Variant</button>
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
    // Query for existent genomic variants in the patient.
    SMARTClient.subscribe(smartClient => {
      if (smartClient === null) {
        return;
      }

      console.log("Should now update");

      smartClient.patient.api.search({type: "Observation", query: {"category": "genomic-variant"}, count: 10})
        .then(results => {
          console.log("Successfully got variants!", results);

          if (!results.data.entry) {
            return;
          }

          if (results.data.entry.length > 0) {
            this.removeRow(0); // Start at the first index if we find other variants.
          }

          for (const result of results.data.entry) {
            console.log("Would now add " + result.resource.code.text);
            this.dataEntryService.search(result.resource.code.text).subscribe(variants => {
              if (variants.length === 0) {
                console.log("NOT GOOD: Couldn\"t find any search results for " + result.resource.code.text);
                return;
              }

              // Add the search result to the list.
              console.log("Adding", variants[0]);
              this.variants.push(new VariantWrapper(this.variants.length, variants[0]));
            });
          }
        })
        .fail(err => {
          console.log("Couldn't query genomic variants error!" + err);
        });
    });

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

    this.router.navigate(["/visualize-results"]);
  }
}
