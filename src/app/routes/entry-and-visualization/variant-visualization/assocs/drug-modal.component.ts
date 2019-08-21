import {Component, Input} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Variant} from "../../genomic-data";
import {AssocReference, Assoc, AssocDrug} from "./assocs";

@Component({
  selector: "assocs-modal",
  template: `
      <div class="modal-header">
          <h4 class="modal-title text-muted">Drug Detail</h4>
          <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
              <span aria-hidden="true">&times;</span>
          </button>
      </div>
      <div class="modal-body">
          <br>
          <h4 class="display-4 text-muted">{{assocDrug.drug}}</h4>
          <br>
          <table class="table table-sm table-bordered">
              <thead>
              <tr>
                  <th class="response text-center px-3">Response</th>
                  <th class="label text-center px-3">Evidence Label</th>
                  <th class="url px-3">Source Url</th>
                  <th class="url px-3">Publication Url</th>

              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let assocReference of assocDrug.assocReferences">
                  <td class="text-center">{{assocReference.response}}</td>
                  <td class="text-center">{{assocReference.evidence_label}}</td>
                  <td>
                      <button *ngFor="let url of getSourceUrls(assocReference)" class="btn btn-light btn-link"
                              placement="left" ngbTooltip="{{assocReference.description}}"
                              (click)="openUrl(url)">{{url}}</button>
                  </td>

                  <td>
                      <button *ngFor="let url of getPublicationUrls(assocReference)" class="btn btn-light btn-link"
                              (click)="openUrl(url)">{{url}}</button>
                  </td>
              </tr>
              </tbody>
          </table>
          <br>
          <br>
          <br>
          <br>
          <br>

      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close
          </button>
      </div>

  `,
  styles: [`
      .modal-title {
          width: 75%;
      }

      .modal-body {
          overflow-x: auto;
      }

      table {
          table-layout: auto;
          width: initial;
          overflow: scroll;
      }

      .response {
          width: 25%;
      }

      .label {
          width: 25%;
      }

      .label {
          width: 50%;
          overflow-x: hidden;
      }

  `],

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
