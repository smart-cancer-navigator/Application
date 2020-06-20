/**
 * A part of the result visualization component, which displays the drugs that will be effective against genes
 * or variants.
 */

import { Component, Input, OnInit } from "@angular/core";
import { Drug, DrugReference } from "./drug";
import { DrugsSearchService } from "./drugs-search.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "drugs-modal",
  templateUrl: 'drug-details-modal.component.html'
})
export class DrugDetailsModalComponent implements OnInit {
  constructor (public drugSearchService: DrugsSearchService, public activeModal: NgbActiveModal) {}

  @Input() drugReference: DrugReference;
  drugModel: Drug;

  ngOnInit() {
    if (!this.drugReference) {
      return;
    }

    this.drugSearchService.searchByReference(this.drugReference).subscribe(drug => {
      console.log("Got drug from reference", drug);
      this.drugModel = drug;
    });
  }
}
