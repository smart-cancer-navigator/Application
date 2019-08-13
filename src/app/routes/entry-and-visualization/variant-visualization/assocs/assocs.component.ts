/**
 * The best way to learn is through the experiences of others, and accessing the databse of past association
 * often is the best way to glean such information.
 */

import {Component, forwardRef, Input, OnInit} from "@angular/core";
import { AssocsService } from "./assocs.service";
import { AssocReference } from "./assocs";
import { Variant } from "../../genomic-data";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const CLINICAL_TRIALS_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AssocsComponent),
  multi: true
};

@Component({
  selector: "assocs",
  template: `    
    <table class="table table-hover table-bordered table-striped">
      <thead>
      <tr>
          <th>Variant Name</th>
          <th>Phenotypes</th>
          <th>Diseases</th>
          <th>Drugs</th>
          <th>Response</th>
          <th>Evidence Level</th>
          <th>Evidence Label</th>
          <th>Publication Url</th>

      </tr>
      </thead>
      <ng-container>
          <tr *ngFor="let assoc of assocs">
              <td>{{assoc.variantName}}</td>
              <td>
                  {{assoc.phenotypes}}
              </td>
              <td>{{assoc.diseases}}</td>
              <td>{{assoc.drugs}}</td>
              <td>{{assoc.response}}</td>
              <td>{{assoc.evidence_level}}</td>
              <td>{{assoc.evidence_label}}</td>
              <td>{{assoc.publicationUrl}}</td>
          </tr>
      </ng-container>
    </table>
  `,
  styles: [``],
  providers: [CLINICAL_TRIALS_CONTROL_VALUE_ACCESSOR]
})
export class AssocsComponent {
  constructor (public assocsService: AssocsService) {
  }
  // association references.
  assocs: AssocReference[] = [];

  // The internal data model (for ngModel)
  _currentlySelected: Variant = null;
  get currentlySelected(): any {
    return this._currentlySelected;
  }

  set currentlySelected(v: any) {
    if (v !== this.currentlySelected) {
      this._currentlySelected = v;
      this.assocsService.searchAssocs(v).subscribe(assocs => this.assocs = assocs);
      this.onChangeCallback(v);
    }
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.currentlySelected) {
      this.currentlySelected = value;
    }
  }

  // Placeholders for the callbacks which are later provided by the Control Value Accessor
  private onTouchedCallback: () => void = () => {};
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  private onChangeCallback: (_: any) => void = () => {};
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }


}
