import {Component, OnInit} from "@angular/core";
import {Variant} from "./genomic-data";

class VariantWrapper {
  constructor(_index: number) {
    this.index = _index;
    this.variant = null;
  }

  variant: Variant;
  index: number;
}

@Component({
  selector: "primary-functionality",
  template: `
    <div id="variantVisualizations">
      <div class="variantWrapper" *ngFor="let variant of variants; let i = index">
        <div class="variantSelector">
          <div class="variantSelectorSpan">
            <variant-selector [(ngModel)]="variant.variant"></variant-selector>
          </div>
          <button class="removeRowButton btn btn-danger" (click)="removeRow(i)">X</button>
        </div>
        <div>
          <!--<visualization [(ngModel)]="variant.variant"></visualization>-->
          <div *ngIf="variant.variant !== undefined" class="informationToggle">
            <img src="/assets/dropdown.svg">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .variantSelector {
      height: 38px;
    }

    .variantSelector>* {
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
      background-color: grey;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      text-align: center;
      height: 30px;
    }

    .informationToggle:hover {
      background-color: #5a5a5a;
    }

    .informationToggle img {
      height: 10px;
      width: 10px;
      margin: 10px;
    }
  `]
})
export class PrimaryFunctionalityComponent implements OnInit {
  variants: VariantWrapper[] = [];

  ngOnInit() {
    this.addRow();
  }

  addRow() {
    this.variants.push(new VariantWrapper(this.variants.length));
  }

  removeRow(index: number) {
    this.variants.splice(index, 1);
  }
}
