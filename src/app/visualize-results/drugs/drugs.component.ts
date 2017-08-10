/**
 * A part of the result visualization component, which displays the drugs that will be effective against genes
 * or variants.
 */

import {Component, Input, OnInit} from "@angular/core";
import {Drug, DrugReference} from "./drug";
import {DrugsSearchService} from "./drugs-search.service";

@Component({
  selector: "drugs-info",
  template: `
    <br>
    <h3 class="display-3">
      {{forReference.name}}
      <small class="text-muted" *ngIf="drugModel !== undefined"></small>
    </h3>

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
          <td>{{interaction.geneTarget.hugo_symbol}}</td>
          <td>
            <table class="table table-bordered" *ngIf="interaction.interactionTypes !== undefined && interaction.interactionTypes.length > 0">
              <thead>
              <td>Interaction Type</td>
              <td>Sources</td>
              </thead>
              <tbody>
              <tr *ngFor="let interactionType of interaction.interactionTypes">
                <td style="width: 20%">{{interactionType.name}}</td>
                <td style="width: 80%" *ngIf="interactionType.sources !== undefined">{{interactionType.sources.join(', ')}}</td>
              </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </ng-container>
      </tbody>
    </table>
  `,
  styles: [`
  `]
})
export class DrugsComponent implements OnInit {
  constructor (public drugSearchService: DrugsSearchService) {}

  @Input() forReference: DrugReference;
  drugModel: Drug;

  ngOnInit() {
    this.drugSearchService.searchByReference(this.forReference).subscribe(drug => {
      console.log("Got drug from reference", drug);
      this.drugModel = drug;
    });
  }
}
