/**
 * The best way to learn is through the experiences of others, and accessing the databse of past association
 * often is the best way to glean such information.
 */

import {Component, forwardRef, Input, OnInit} from "@angular/core";
import {AssocsService} from "./assocs.service";
import {AssocReference, Assoc, AssocDrug, AssocDisease} from "./assocs";
import {Variant} from "../../genomic-data";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {Observable} from "rxjs";
import {DrugReference} from "../drugs/drug";
import {DrugDetailsModalComponent} from "../drugs/drug-details-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DrugModalComponent} from "./drug-modal.component";
import {DiseaseModalComponent} from "./disease-modal.component";

export const ASSOCS_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AssocsComponent),
  multi: true
};

@Component({
  selector: "assocs",
  template: `    
      <br>
      <h3 class="display-5" *ngIf="assoc !== null">Gene-Drug Associations</h3>
      <table class="table table-bordered"  *ngIf="assoc !== null">
          <thead>
          </thead>
          <tbody>
          <tr>
              <td class="text-lg-center" [ngStyle]="{'background-color': '#F2F2F2'}">Known Drugs</td>
              <td>
                  <button *ngFor="let assocDrug of assoc.assocDrugs"
                          [ngStyle]="{'background-color': getDrugColor(assocDrug)}"
                          placement="top" ngbTooltip="{{assocDrug.assocAmount}}" 
                          class="btn btn-light" (click)="viewDrugDetails(assocDrug)"
                  >
                      {{assocDrug.drug}}
                  </button>
              </td>
          </tr>
          </tbody>
      </table>

      <br>
      <h3 class="display-5" *ngIf="assoc !== null">Gene-Disease Associations</h3>
      <table class="table table-bordered"  *ngIf="assoc !== null">
          <thead>
          </thead>
          <tbody>
          <tr>
              <td class="text-lg-center" [ngStyle]="{'background-color': '#F2F2F2'}">Known Diseases</td>
              <td>
                  <button *ngFor="let assocDisease of assoc.assocDiseases"
                          [ngStyle]="{'background-color': getDiseaseColor(assocDisease)}"
                          placement="top" ngbTooltip="{{assocDisease.assocAmount}}"
                          class="btn btn-light" (click)="viewDiseaseDetails(assocDisease)"
                  >
                      {{assocDisease.disease}}
                  </button>
              </td>
          </tr>
          </tbody>
      </table>


<!--      <br>-->
<!--      <h3 class="display-5">association</h3>-->
<!--      <table class="table table-sm table-bordered" *ngIf="assoc !== null">-->
<!--          <thead>-->
<!--          <tr class="text-left">-->
<!--              <th class="name">Variant Name</th>-->
<!--              <th class="env">Enviromental Contexts</th>-->
<!--              <th class="phenotype">Phenotypes</th>-->
<!--              <th class="disease">Diseases</th>-->
<!--              <th class="drug">Drugs</th>-->
<!--              <th class="response">Response</th>-->
<!--              <th class="level">Evidence Level</th>-->
<!--              <th class="label">Evidence Label</th>-->
<!--              <th class="feature">Features</th>-->
<!--              <th class="url">Publication Url</th>-->
<!--          </tr>-->
<!--          </thead>-->
<!--          <tbody>-->
<!--          <tr *ngFor="let assocReference of assoc.assocReferences">-->
<!--              <td>{{assocReference.variantName}}</td>-->
<!--              <td>{{assocReference.envContexts}}</td>-->
<!--              <td>{{assocReference.phenotypes}}</td>-->
<!--              <td>{{assocReference.diseases}}</td>-->
<!--              <td>{{assocReference.drugs}}</td>-->
<!--              <td>{{assocReference.response}}</td>-->
<!--              <td>{{assocReference.evidence_level}}</td>-->
<!--              <td>{{assocReference.evidence_label}}</td>-->
<!--              <td>{{assocReference.features}}</td>-->
<!--              <td>-->
<!--                  <button *ngFor="let url of getUrls(assocReference)" class="btn btn-light btn-link"-->
<!--                          (click)="openUrl(url)">{{url}}</button>-->
<!--              </td>-->
<!--          </tr>-->
<!--          </tbody>-->
<!--      </table>-->


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
          width: 30px;
      }

      .response {
          width: 10%;
      }

      .level {
          width: 7.5%;
      }

      .label {
          width: 7.5%;
      }

      .drug {
          overflow: scroll;
          width: 20px;
      }
  `],
  providers: [ASSOCS_CONTROL_VALUE_ACCESSOR]
})

export class AssocsComponent {
  constructor(public assocsService: AssocsService, private modalService: NgbModal) {
  }

  // association references.
  assoc: Assoc = null;
  drugMaxCount: number = 0;
  diseaseMaxCount: number = 0;

  drugColors: Array<any> = ["#ffffff", "#ebfaeb", "#c2f0c2", "#99e699", "#85e085", "#5cd65c", "#33cc33", "#2eb82e", "#29a329"];
  diseaseColors: Array<any> = ["#ffffff", "#ffe6e6", "#ffcccc", "#ffb3b3", "#ff9999", "#ff6666", "#ff4d4d", "#ff3333", "#e60000"];


  // The internal data model (for ngModel)
  _currentlySelected: Variant = null;
  get currentlySelected(): any {
    return this._currentlySelected;
  }

  set currentlySelected(v: any) {
    if (v !== this.currentlySelected) {
      this._currentlySelected = v;
      this.assocsService.searchAssocs(v).subscribe(assoc => this.assoc = assoc);
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
    if (this.assoc !== null && this.assoc.assocDrugs.length > 0) {
      for (const assocDrug of this.assoc.assocDrugs) {
        if (assocDrug.assocAmount > this.drugMaxCount){
          this.drugMaxCount = assocDrug.assocAmount;
        }
      }

    }
    if (this.assoc !== null && this.assoc.assocDiseases.length > 0) {
      for (const assocDisease of this.assoc.assocDiseases) {
        if (assocDisease.assocAmount > this.diseaseMaxCount){
          this.diseaseMaxCount = assocDisease.assocAmount;
        }
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  getUrls(assocReference: AssocReference) {
    return assocReference.publicationUrls;
  }

  openUrl(url: string) {
    window.open(url, "_blank");
  }

  viewDrugDetails(assocDrug: AssocDrug) {
    const modalRef = this.modalService.open(DrugModalComponent, {size: "lg"});
    modalRef.componentInstance.assocDrug = assocDrug;

  }

  getDrugColor(assocDrug: AssocDrug) {
    const degree =  assocDrug.assocAmount;
    if ( degree <= 1) {
      return this.drugColors[0];
    }
    else if ( degree <= 2) {
      return this.drugColors[1];
    }
    else if ( degree <= 3) {
      return this.drugColors[2];
    }
    else if ( degree <= 6) {
      return this.drugColors[3];
    }
    else if ( degree <= 10) {
      return this.drugColors[4];
    }
    else if ( degree <= 20) {
      return this.drugColors[5];
    }
    else if ( degree <= 30) {
      return this.drugColors[6];
    }
    else if ( degree <= 50) {
      return this.drugColors[7];
    }
    else {
      return this.drugColors[8];
    }

  }

  viewDiseaseDetails(assocDisease: AssocDisease) {
    const modalRef = this.modalService.open(DiseaseModalComponent, {size: "lg"});
    modalRef.componentInstance.assocDisease = assocDisease;

  }

  getDiseaseColor(assocDisease: AssocDisease) {
    const degree =  assocDisease.assocAmount;
    if ( degree <= 1) {
      return this.diseaseColors[0];
    }
    else if ( degree <= 5) {
      return this.diseaseColors[1];
    }
    else if ( degree <= 10) {
      return this.diseaseColors[2];
    }
    else if ( degree <= 25) {
      return this.diseaseColors[3];
    }
    else if ( degree <= 50) {
      return this.diseaseColors[4];
    }
    else if ( degree <= 75) {
      return this.diseaseColors[5];
    }
    else if ( degree <= 100) {
      return this.diseaseColors[6];
    }
    else if ( degree <= 150) {
      return this.diseaseColors[7];
    }
    else {
      return this.diseaseColors[8];
    }

  }
}
