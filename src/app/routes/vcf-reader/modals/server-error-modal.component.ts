import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "server-error-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title" style="color:red">Server Error</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>The server could not convert your VCF file into a FHIR-style JSON file.</p>
      <p>Please ensure that your VCF file is properly formatted and follows the proper naming conventions.</p>
      <p>To see how your file should be named, please see the link at the bottom of this page.</p>
    </div>
  `,
  styles: [`
  `]
})
export class ServerErrorModalComponent {
  constructor (public activeModal: NgbActiveModal) {}
}
