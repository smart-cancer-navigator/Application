/**
 * This component and its corresponding route is used to display data about the gene and variants selected by
 * the user in the previous step.
 */

import { Component, OnInit } from '@angular/core';
import { GENE_VARIATIONS, GeneDataRow } from '../data-entry/data-entry-form.component';
import { ClinicalTrialReference, ClinicalTrialsSearchService } from './clinical-trials.service';

@Component({
  selector: 'visualize-results',
  template: `
    <div id="tabChoices">
      <button *ngFor="let tabChoice of tabChoices; let i=index;" (click)="selectedTabIndex = i"
              [style.background-color]="selectedTabIndex !== i ? '#e9e9e9' : '#ffffff'"
              [style.border-bottom]="selectedTabIndex === i ? '0' : '1px solid black'"
              [style.width.%]="100/(tabChoices.length)">{{tabChoice}}
      </button>
    </div>

    <!-- TODO: maybe separate each one of these below into individual components? -->
    <div id="tabContentBorder">
      <!-- Drugs Tab -->
      <div id="drugsInfo" class="tabContent" *ngIf="selectedTabIndex === 0">
        <h1>Related Clinical Trials/Drugs</h1>
        
        <!-- New table for each gene/variant -->
        <div *ngFor="let geneVariation of geneVariants; let i = index;">
          <h2><i>{{geneVariation.variant.toIntelligentDisplayRepresentation()}}</i></h2>
          <table border="1">
            <tr>
              <th>Clinical Trial ID</th>
              <th>Brief Title</th>
              <th>Principal Investigator</th>
            </tr>
            <tr *ngFor="let clinicalTrial of clinicalTrials[i]">
              <td>{{clinicalTrial.nci_id}}</td>
              <td>{{clinicalTrial.brief_title}}</td>
              <td>{{clinicalTrial.principal_investigator}}</td>
            </tr>
          </table>
        </div>
        
      </div>
      
      <!-- Variant Types Tab -->
      <div id="variantTypesTab" class="tabContent" *ngIf="selectedTabIndex === 2">
        <h1>Variant Types Info</h1>
      </div>
    </div>
  `,
  styles: [`
    #tabChoices {
      height: 30px;
      overflow-x: scroll;
      overflow-y: hidden;
      width: 100%;
    }

    ::-webkit-scrollbar {
      display: none;
    }

    #tabChoices button {
      float: left;
      width: 300px;
      height: 100%;
      border: 1px solid black;
      border-collapse: collapse;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      background-color: white;
      font-size: 20px;
      outline: none;
    }

    #tabContentBorder {
      width: calc(100% - 12px);
      height: 800px;
      border: 1px solid black;
      border-top: 0;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      padding: 5px;
    }

    .tabContent {
      height: 100%;
      width: 100%;
    }
    
    table {
      width: 100%;
    }
  `]
})
export class VisualizeResultsComponent implements OnInit {
  constructor (public clinicalTrialsSearchService: ClinicalTrialsSearchService) {}

  tabChoices: string[] = ['Clinical Trials/Drugs', 'Gene/Variant Descriptions/Types', 'Pathogenicities'];
  selectedTabIndex: number = 0;

  // One set of clinical trials per gene variant.
  geneVariants: GeneDataRow[];
  clinicalTrials: ClinicalTrialReference[][] = [];

  ngOnInit(): void {
    console.log('Gene Variations', GENE_VARIATIONS);
    this.geneVariants = GENE_VARIATIONS;

    // Populate clinical trials.
    for (const geneVariant of this.geneVariants) {
      this.clinicalTrials.push([]);
      this.clinicalTrialsSearchService.searchClinicalTrials(geneVariant.variant).subscribe(trials => this.clinicalTrials[this.clinicalTrials.length - 1] = trials);
    }
  }
}
