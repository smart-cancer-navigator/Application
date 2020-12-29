/**
 * A part of the result visualization component, which displays the drugs that will be effective against genes
 * or variants.
 */

import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Variant } from "../../genomic-data";

@Component({
  selector: "classifications-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{variant.optionName()}} classifictions</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <!-- A bit of info about the drug -->
      <table class="table table-bordered table-striped" *ngIf="variant !== undefined">
        <thead>
        </thead>
        <tbody>
        <ng-container *ngIf="variant.classifications !== undefined && variant.classifications.length > 0">
          <tr>
            <td style="font-weight: bold;">Classification</td>
            <td style="font-weight: bold;">Sources</td>
          </tr>
          <tr *ngFor="let classification of variant.classifications">
            <td>{{classification.name}}</td>
            <td *ngIf="classification.sources !== undefined && classification.sources.length > 0">
              {{classification.sources.join(', ')}}
            </td>
          </tr>
        </ng-container>
        </tbody>
      </table>
      <br>
    </div>
  `,
  styles: [`
  `]
})
export class ClassificationsModalComponent {
  constructor (public activeModal: NgbActiveModal) {}

  @Input() variant: Variant;
}
