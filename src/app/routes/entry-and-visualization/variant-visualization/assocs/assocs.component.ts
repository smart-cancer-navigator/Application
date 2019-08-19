/**
 * The best way to learn is through the experiences of others, and accessing the databse of past association
 * often is the best way to glean such information.
 */

import {Component, forwardRef, Input, OnInit} from "@angular/core";
import {AssocsService} from "./assocs.service";
import {AssocReference, AssocRelation, Assocs} from "./assocs";
import {Variant} from "../../genomic-data";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {Observable} from "rxjs";

export const ASSOCS_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AssocsComponent),
  multi: true
};

@Component({
  selector: "assocs",
  template: `    
      <table class="table table-sm table-bordered">
          <thead>
          <tr class="text-left">
              <th class="name">Variant Name</th>
              <th class="env">Enviromental Contexts</th>
              <th class="phenotype">Phenotypes</th>
              <th class="disease">Diseases</th>
              <th class="drug">Drugs</th>
              <th class="response">Response</th>
              <th class="level">Evidence Level</th>
              <th class="label">Evidence Label</th>
              <th class="feature">Features</th>
              <th class="url">Publication Url</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let assoc of assocs.assocReference">
              <td>{{assoc.variantName}}</td>
              <td>{{assoc.envContexts}}</td>
              <td>{{assoc.phenotypes}}</td>
              <td>{{assoc.diseases}}</td>
              <td>{{assoc.drugs}}</td>
              <td>{{assoc.response}}</td>
              <td>{{assoc.evidence_level}}</td>
              <td>{{assoc.evidence_label}}</td>
              <td>{{assoc.features}}</td>
              <td>
                  <button *ngFor="let url of getUrls(assoc)" class="btn btn-light btn-link"
                          (click)="openUrl(url)">{{url}}</button>
              </td>
          </tr>
          </tbody>
      </table>
      
      <br>
      <h3 class="display-5">gene-drug</h3>
      <table class="table table-sm table-bordered">
          <thead>
          <tr>
              <th></th>
              <th *ngFor="let drug of assocs.drugs">{{drug}}</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let relation of assocs.assocRelations">
              <td>{{relation.gene}}</td>
              <td *ngFor="let geneDrug of relation.geneDrugs">{{geneDrug}}</td>
          </tr>
          </tbody>
      </table>
      
      <br>
      <h3 class="display-5">gene-disease</h3>
      <table class="table table-sm table-bordered">
          <thead>
          <tr>
              <th></th>
              <th *ngFor="let disease of assocs.diseases">{{disease}}</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let relation of assocs.assocRelations">
              <td>{{relation.gene}}</td>
              <td *ngFor="let geneDisease of relation.geneDiseases">{{geneDisease}}</td>
          </tr>
          </tbody>
      </table>

  `,
  styles: [` 
    tr {
        white-space: normal;
    }
    table {
        width: 100%;
        table-layout: auto;
    }
    .feature {
        width:30px;
    }
    .response {
        width:10%;
    }
    .level {
        width:7.5%;
    }
    .label {
        width:7.5%;
    }
    .drug {
        overflow: scroll;
        width:20px;
    }
  `],
  providers: [ASSOCS_CONTROL_VALUE_ACCESSOR]
})

export class AssocsComponent {
  constructor(public assocsService: AssocsService) {
  }

  // association references.
  assocs: Assocs;


  // The internal data model (for ngModel)
  _currentlySelected: Variant = null;
  get currentlySelected(): any {
    return this._currentlySelected;
  }

  set currentlySelected(v: any) {
    if (v !== this.currentlySelected) {
      this._currentlySelected = v;
      this.assocsService.searchAssocs(v).subscribe(assocs => this.assocs = assocs);
      this.onChangeCallback(v);
    }
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.currentlySelected) {
      this.currentlySelected = value;
    }
  }


  // Placeholders for the callbacks which are later provided by the Control Value Accessor
  private onTouchedCallback: () => void = () => {
  }


  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  private onChangeCallback: (_: any) => void = () => {
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  getUrls(reference: AssocReference) {
    return reference.publicationUrls;
  }



  openUrl(url: string) {
    window.open(url, "_blank");
  }

}
