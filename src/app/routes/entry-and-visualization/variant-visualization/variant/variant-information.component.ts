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
  templateUrl: 'variant-information.component.html'
})
export class VariantInformationComponent {
  constructor (private modalService: NgbModal) {}

  @Input() variant;


  // viewDrugDetails(reference: DrugReference) {
  //   const modalRef = this.modalService.open(DrugDetailsModalComponent, {size: "lg"});
  //   modalRef.componentInstance.drugReference = reference;
  // }

  viewClassifications() {
    const modalRef = this.modalService.open(ClassificationsModalComponent, {size: "lg"});
    modalRef.componentInstance.variant = this.variant;
  }
}
