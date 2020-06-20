/**
 * A part of the result visualization component, which displays the drugs that will be effective against genes
 * or variants.
 */

import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Variant } from "../../genomic-data";

@Component({
  selector: "classifications-modal",
  templateUrl: 'classifications-modal.component.html'
})
export class ClassificationsModalComponent {
  constructor (public activeModal: NgbActiveModal) {}

  @Input() variant: Variant;
}
