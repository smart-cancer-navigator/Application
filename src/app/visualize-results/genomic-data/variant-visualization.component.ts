/**
 * Visualizing the data for the variant: a tab on the results display.
 */

import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DrugReference} from "../drugs/drug";

@Component({
  selector: "variant-visualization",
  template: `
    <ng-container *ngIf="variant">
      <br>
      <h3 class="display-3">{{variant.variantName}}</h3>
  
      <!-- A bit of info about the variant/gene -->
      <table class="table table-bordered table-striped">
        <thead>
        </thead>
        <tbody>
        <tr *ngIf="variant.description && variant.description !== ''">
          <td>Description</td>
          <td>{{variant.description}}</td>
        </tr>
        <tr>
          <td>Functional Prediction</td>
          <td>
            <!-- TODO: Figure out how to determine pathogenicity, and make badges actionable. -->
            {{variant.score}} <span class="badge badge-danger">Pathogenic</span>
          </td>
        </tr>
        <tr>
          <td>Variant Origin</td>
          <td>{{variant.somatic ? 'Somatic' : 'Germline'}}</td>
        </tr>
        <tr *ngIf="variant.types && variant.types.length > 0">
          <td>Variant Type</td>
          <td>{{variant.types.join(", ")}}</td>
        </tr>
        <tr *ngIf="variant.drugs && variant.drugs.length > 0">
          <td>Effective Drugs</td>
          <td>
            <button *ngFor="let drugReference of variant.drugs" class="btn btn-secondary" (click)="openNewDrugTab(drugReference)">{{drugReference.name}}
            </button>
          </td>
        </tr>
        <tr *ngIf="variant.diseases && variant.diseases.length > 0">
          <td>Known Diseases</td>
          <td>{{variant.diseases.join(", ")}}</td>
        </tr>
        <tr>
          <td>Variant Location</td>
          <td>Chromosome {{variant.getLocation()}}</td>
        </tr>
        </tbody>
      </table>
    </ng-container>
  `,
  styles: [`
  `]
})
export class VariantVisualizationComponent {
  @Input() variant;
  @Output() viewDrugDetails: EventEmitter <DrugReference> = new EventEmitter();

  openNewDrugTab(reference: DrugReference) {
    this.viewDrugDetails.emit(reference);
  }
}
