/**
 * Visualizing the data for the gene: a tab on the result visualization.
 */

import { Component, Input } from "@angular/core";
import { Gene } from "../../genomic-data";

@Component({
  selector: "gene-information",
  template: `
    <ng-container *ngIf="gene !== undefined">
      <br>
      <h3 class="display-3">
        {{gene.hugoSymbol}}
        <small class="text-muted">{{gene.name}}</small>
      </h3>

      <div style="width: 70%; float: left;">
        <div class="card">
          <!--<img class="card-img-top" src="..." alt="Card image cap">-->
          <div class="card-block">
            <h4 class="card-title">Gene Description</h4>
            <p class="card-text">{{gene.description}}</p>
          </div>
        </div>

        <div class="card">
          <div class="card-block" *ngIf="gene.pathways !== undefined && gene.pathways.length > 0">
            <h4 class="card-title">Gene Pathways</h4>
            <p class="card-text">{{gene.pathwaysString()}}</p>
          </div>
        </div>
      </div>

      <div class="card" style="width: 30%; float: left;">
        <!--<img class="card-img-top" src="..." alt="Card image cap">-->
        <div class="card-block">
          <h4 class="card-title">Gene Details</h4>
          <!-- A bit of info about the variant/gene -->
          <table class="table table-bordered">
            <thead>
            </thead>
            <tbody>
            <tr *ngIf="gene.entrezID !== undefined">
              <td>Entrez ID</td>
              <td>{{gene.entrezID}}</td>
            </tr>
            <tr *ngIf="gene.type !== undefined">
              <td>Type</td>
              <td>{{gene.type}}</td>
            </tr>
            <tr *ngIf="gene.aliases !== undefined && gene.aliases.length > 0">
              <td>Aliases</td>
              <td>{{gene.aliases.join(", ")}}</td>
            </tr>
            <tr *ngIf="gene.chromosome !== undefined">
              <td>Chromosome</td>
              <td>{{gene.chromosome}}</td>
            </tr>
            <tr *ngIf="gene.strand !== undefined">
              <td>Strand</td>
              <td>{{gene.strand}}</td>
            </tr>
            <tr *ngIf="gene.start !== undefined && gene.end !== undefined">
              <td>Nucleotides</td>
              <td>{{gene.start}} to {{gene.end}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    small {
      font-size: 25px;
    }
    
    .card {
      padding: 10px;
    }
  `]
})
export class GeneInformationComponent {
  @Input() gene: Gene;
}
