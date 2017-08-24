import { Component, OnInit } from "@angular/core";
import { Variant } from "./genomic-data";
import { SMARTClient } from "../smart-initialization/smart-reference.service";
import { VariantSelectorService } from "./variant-selector/variant-selector.service";
import { trigger, state, style, animate, transition } from "@angular/animations";

class VariantWrapper {
  constructor(_index: number, _variant: Variant) {
    this.index = _index;
    this.variant = _variant;
    this.drawerState = "closed";
  }

  variant: Variant;
  index: number;
  drawerState: string; // Open or closed.

  public toggleDrawer = () => {
    this.drawerState = this.drawerState === "closed" ? "open" : "closed";
  }
}

@Component({
  selector: "primary-functionality",
  template: `
    <div id="variantVisualizations">
      <div class="variantWrapper" *ngFor="let variant of variants; let i = index">
        <div class="variantSelector">
          <div class="variantSelectorSpan">
            <variant-selector [ngModel]="variant.variant" (ngModelChange)="variant.variant = $event; addRow()"></variant-selector>
          </div>
          <button class="removeRowButton btn btn-danger" (click)="removeRow(i)">X</button>
        </div>
        <div>
          <div class="visualizationContent" [@drawerAnimation]="variant.drawerState">
            <variant-visualization [(ngModel)]="variant.variant"></variant-visualization>
          </div>
          <div *ngIf="variant.variant !== undefined && variant.variant !== null" class="informationToggle" (click)="variant.toggleDrawer()">
            <img src="/assets/dropdown.svg">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #variantVisualizations {
      padding: 15px;
    }

    .variantWrapper {
      margin-bottom: 5px;
    }

    .variantSelector {
      height: 38px;
    }

    .variantSelector > * {
      float: left;
      height: 100%;
    }

    .variantSelectorSpan {
      width: calc(100% - 38px);
    }

    .removeRowButton {
      width: 38px;
      font-size: 20px;
      color: white;
      padding: 0;
    }

    .informationToggle {
      width: 100%;
      background-color: #e2e2e2;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      text-align: center;
      height: 30px;
    }

    .visualizationContent {
      overflow: scroll;
    }

    .informationToggle:hover {
      background-color: #b2b2b2;
    }

    .informationToggle img {
      height: 10px;
      width: 10px;
      margin: 10px;
    }
  `],
  animations: [
    trigger("drawerAnimation", [
      state("closed", style({
        height: "0"
      })),
      state("open", style({
        height: "500px"
      })),
      transition("closed => open", animate("400ms ease-in-out")),
      transition("open => closed", animate("400ms ease-in-out"))
    ])
  ]
})
export class VariantEntryAndVisualizationComponent implements OnInit {
  constructor (private selectorService: VariantSelectorService) {}

  variants: VariantWrapper[] = [];

  ngOnInit() {
    this.addRow();

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

          // For every variant.
          for (const result of results.data.entry) {
            console.log("Would now add " + result.resource.code.text);
            this.selectorService.search(result.resource.code.text).subscribe(variants => {
              if (variants.length === 0) {
                console.log("NOT GOOD: Couldn't find any search results for " + result.resource.code.text);
                return;
              }

              // Add the first search result to the list (the one with the correct HGVS ID).
              console.log("Adding", variants[0]);

              this.selectorService.getByReference(variants[0])
                .subscribe(variant => this.variants.push(new VariantWrapper(this.variants.length, variant)));
            });
          }
        })
        .fail(err => {
          console.log("Couldn't query genomic variants error!" + err);
        });
    });
  }

  addRow() {
    this.variants.push(new VariantWrapper(this.variants.length, null));
  }

  removeRow(index: number) {
    this.variants.splice(index, 1);
  }
}
