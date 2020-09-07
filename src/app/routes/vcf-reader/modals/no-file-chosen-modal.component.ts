/**
 * A part of the result visualization component, which displays the drugs that will be effective against genes
 * or variants.
 */

import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "no-file-chosen-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title" style="color:red">No File Chosen</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Please import a VCF file first.</p>
      <p>To do so, click the "Choose File" button to select a file from your computer.</p>
      <p>Then, click the "Upload file".</p>
    </div>
  `,
  styles: [`
  `]
})
export class NoFileChosenModalComponent {
  constructor (public activeModal: NgbActiveModal) {}
}
