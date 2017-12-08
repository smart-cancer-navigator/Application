/**
 * Wrapper class of tabs for a bunch of post- data-entry components (Clinical Trials, etc.)
 */

import { Component, forwardRef } from "@angular/core";
import { Variant} from "../genomic-data";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export const VISUALIZATION_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VariantVisualizationComponent),
  multi: true
};

@Component({
  selector: "variant-visualization",
  template: `
    <!-- Tabs to view the variant's info.  -->
    <ngb-tabset [destroyOnHide]="false" *ngIf="currentlySelected !== undefined && currentlySelected !== null">
      <ngb-tab title="Gene">
        <ng-template ngbTabContent>
          <gene-information [gene]="currentlySelected.origin"></gene-information>
        </ng-template>
      </ngb-tab>

      <ngb-tab title="Variant">
        <ng-template ngbTabContent>
          <variant-information [variant]="currentlySelected"></variant-information>
        </ng-template>
      </ngb-tab>

      <ngb-tab title="Clinical Trials">
        <ng-template ngbTabContent>
          <clinical-trials [(ngModel)]="currentlySelected"></clinical-trials>
        </ng-template>
      </ngb-tab>
    </ngb-tabset>
  `,
  styles: [`    
  `],
  providers: [VISUALIZATION_CONTROL_VALUE_ACCESSOR]
})
export class VariantVisualizationComponent implements ControlValueAccessor {
  // The internal data model (for ngModel)
  _currentlySelected: Variant = null;
  get currentlySelected(): any {
    return this._currentlySelected;
  }
  set currentlySelected(v: any) {
    if (v !== this.currentlySelected) {
      this._currentlySelected = v;
      this.onChangeCallback(v);
    }
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.currentlySelected) {
      this.currentlySelected = value;
    }
  }

  // Placeholders for the callbacks which are later providesd by the Control Value Accessor
  private onTouchedCallback: () => void = () => {};
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  private onChangeCallback: (_: any) => void = () => {};
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
}
