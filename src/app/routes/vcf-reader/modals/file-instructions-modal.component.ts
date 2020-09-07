/**
 * A part of the result visualization component, which displays the drugs that will be effective against genes
 * or variants.
 */

import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "file-instructions-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">How to Properly Format your VCF File</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>See <a href="https://en.wikipedia.org/wiki/Variant_Call_Format" target="_blank">here</a> for general details on VCF files.</p>
      <p>For the application to work properly, the following information has to be given in the file name:</p>
      <ul>
        <li><strong>Patient ID</strong>: any string without whitespace</li>
        <li><strong>Build</strong>: one of ‘b36’ (aka NCBI Build 36, hg18), ‘b37’ (aka GRCh37, hg19), or ‘b38’ (aka GRCh38, hg38)</li>
        <li><strong>Gene name</strong>: a valid <a href="https://www.genenames.org/" target="_blank">HGNC gene symbol</a></li>
      </ul>
      <p>The file name must be in the following format: [patientId].[b36|b37|b38].[HGNC gene symbol].vcf</p>
      <p>Example file name: NA120003.b37.CYP2D6.vcf</p>
    </div>
  `,
  styles: [`
  `]
})
export class FileInstructionsModalComponent {
  constructor (public activeModal: NgbActiveModal) {}
}
