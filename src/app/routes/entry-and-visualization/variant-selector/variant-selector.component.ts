/**
 * Data entry is an essential part of the final application that will be built, and it must be built in
 * a way which permits dynamic addition and removal of form elements.  Since Angular makes modularity
 * insanely easy and you can build custom input selectors, this shouldn"t require too much code.
 */
import { Component, forwardRef } from "@angular/core";
import {GeneReference, Variant, VariantReference} from "../genomic-data";
import { VariantSelectorService } from "./variant-selector.service";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export const SELECTOR_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VariantSelectorComponent),
  multi: true
};

@Component({
  selector: "variant-selector",
  template: `
    <!-- Gene Variation List -->
    <div>
      <filterable-search [searchService]="selectorService" [placeholderString]="'Add New Variant'" [ngModel]="currentReference" (ngModelChange)="onNewReferenceSelection($event)"></filterable-search>
    </div>
  `,
  styles: [`
    div {
      height: 100%;
    }
  `],
  providers: [SELECTOR_CONTROL_VALUE_ACCESSOR]
})
export class VariantSelectorComponent implements ControlValueAccessor {
  constructor(public selectorService: VariantSelectorService) {}

  currentReference: VariantReference;

  // The internal data model (for ngModel)
  _currentlySelected: Variant;
  get currentlySelected(): Variant {
    return this._currentlySelected;
  }
  set currentlySelected(v: Variant) {
    if (v !== this.currentlySelected) {
      this._currentlySelected = v;
      this.onChangeCallback(v);
    }
  }

  // From ControlValueAccessor interface
  writeValue(value: Variant) {
    if (value !== this.currentlySelected) {
      this.currentlySelected = value;

      if (value && value !== null) {
        this.currentReference = new VariantReference(new GeneReference(this.currentlySelected.origin.hugoSymbol, this.currentlySelected.origin.entrezID), this.currentlySelected.variantName, this.currentlySelected.hgvsID);
      }
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

  // Update the EHR item (if possible) and change the variant.
  onNewReferenceSelection(reference: VariantReference) {
    if (!reference) {
      return;
    }

    console.log("Would get by reference ", reference);
    this.currentReference = reference;
    this.selectorService.getByReference(reference)
      .subscribe(resultingVariant => this.currentlySelected = resultingVariant);
  }
}
