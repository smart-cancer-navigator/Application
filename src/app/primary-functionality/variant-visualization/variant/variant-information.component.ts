/**
 * Visualizing the data for the variant: a tab on the results display.
 */

import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DrugReference} from "../drugs/drug";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DrugDetailsModalComponent} from "../drugs/drug-details-modal.component";
import {ClassificationsModalComponent} from "./classifications-modal.component";

@Component({
  selector: "variant-information",
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
            {{variant.score}} <span (click)="viewClassifications()" class="badge badge-{{variant.getClassification().toLowerCase().indexOf('pathogenic') >= 0 ? 'danger' : 'info'}}">{{variant.getClassification()}}</span>
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
            <button *ngFor="let drugReference of variant.drugs" class="btn btn-light" (click)="viewDrugDetails(drugReference)">{{drugReference.name}}</button>
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
    .badge {
      opacity: 1;
    }
    
    .badge:hover {
      opacity: 0.8;
    }
    
    .badge:active {
      opacity: 0.6;
    }
  `]
})
export class VariantInformationComponent {
  constructor (private modalService: NgbModal) {}

  @Input() variant;

  viewDrugDetails(reference: DrugReference) {
    const modalRef = this.modalService.open(DrugDetailsModalComponent, {size: "lg"});
    modalRef.componentInstance.drugReference = reference;
  }

  viewClassifications() {
    const modalRef = this.modalService.open(ClassificationsModalComponent, {size: "lg"});
    modalRef.componentInstance.variant = this.variant;
  }
}
