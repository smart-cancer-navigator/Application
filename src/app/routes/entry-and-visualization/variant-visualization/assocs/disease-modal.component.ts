import {Component, Input} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Variant} from "../../genomic-data";
import {AssocReference, Assoc, AssocDisease} from "./assocs";

/**
 * A modal to show association detail for a specific disease
 */

@Component({
  selector: "disease-modal",
  templateUrl: 'disease-modal.component.html'

})

export class DiseaseModalComponent {
  constructor(public activeModal: NgbActiveModal) {
  }

  @Input() assocDisease: AssocDisease;

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
