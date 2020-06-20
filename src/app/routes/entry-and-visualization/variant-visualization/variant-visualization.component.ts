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
  templateUrl: 'variant-visualization.component.html',
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
