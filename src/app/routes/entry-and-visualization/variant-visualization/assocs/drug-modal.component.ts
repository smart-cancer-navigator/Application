import {Component, Input} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Variant} from "../../genomic-data";
import {AssocReference, Assoc, AssocDrug} from "./assocs";

/**
 * A modal to show association detail for a specific drug
 */

@Component({
  selector: "drug-modal",
  templateUrl: 'drug-modal.component.html'
})


export class DrugModalComponent {
  constructor(public activeModal: NgbActiveModal) {
  }

  @Input() assocDrug: AssocDrug;

  getPublicationUrls(assocReference: AssocReference) {
    return assocReference.publicationUrls;
  }

  getSourceUrls(assocReference: AssocReference) {
    return assocReference.sourceUrls;
  }


  openUrl(url: string) {
    if (url !== "NA") {
      window.open(url, "_blank");
    }
  }

}
