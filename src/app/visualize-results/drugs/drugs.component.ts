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
      <small class="text-muted" *ngIf="drugModel !== undefined" >{{drugModel.source}}</small>
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
      <tr *ngIf="drugModel.geneTargets !== undefined && drugModel.geneTargets.length > 0">
        <td>Gene Targets</td>
        <td>{{drugModel.geneTargetsString()}}</td>
      </tr>
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
