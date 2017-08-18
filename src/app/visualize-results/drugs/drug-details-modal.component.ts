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
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{drugReference.name}} details</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <!-- A bit of info about the drug -->
      <table class="table table-bordered table-striped" *ngIf="drugModel !== undefined">
        <thead>
        </thead>
        <tbody>
        <tr *ngIf="drugModel.description !== undefined">
          <td>Description</td>
          <td>{{drugModel.description}}</td>
        </tr>
        <ng-container *ngIf="drugModel.interactions !== undefined && drugModel.interactions.length > 0">
          <tr>
            <td style="font-weight: bold;">Gene</td>
            <td style="font-weight: bold;">Interaction Types</td>
          </tr>
          <tr *ngFor="let interaction of drugModel.interactions">
            <td>{{interaction.geneTarget.hugoSymbol}}</td>
            <td>
              <table class="table table-bordered"
                     *ngIf="interaction.interactionTypes !== undefined && interaction.interactionTypes.length > 0">
                <thead>
                <td>Interaction Type</td>
                <td>Sources</td>
                </thead>
                <tbody>
                <tr *ngFor="let interactionType of interaction.interactionTypes">
                  <td style="width: 20%">{{interactionType.name}}</td>
                  <td style="width: 80%" *ngIf="interactionType.sources !== undefined">
                    {{interactionType.sources.join(', ')}}
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </ng-container>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
  `]
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
