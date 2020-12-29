/**
 * A part of the result visualization component, which displays the drugs that will be effective against genes
 * or variants.
 */

import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "download-error-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title" style="color:red">Download Error</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>It does not seem that you are logged into the {{systemName}} system.</p>
      <p>Please click the "Login to {{systemName}}" button to log into the system, then come back to this page to download the data.</p>
    </div>
  `,
  styles: [`
  `]
})
export class DownloadErrorModalComponent {
  constructor (public activeModal: NgbActiveModal) {}

  @Input() systemName: string;
}
