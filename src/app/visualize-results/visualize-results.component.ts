/**
 * This component and its corresponding route is used to display data about the gene and variants selected by
 * the user in the previous step.
 */

import { Component, OnInit } from '@angular/core';
import { USER_SELECTED_VARIANTS } from '../data-entry/data-entry-form.component';
import { ClinicalTrialReference, ClinicalTrialsSearchService } from './clinical-trials.service';
import { Variant } from '../global/genomic-data';

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
        <div *ngFor="let variant of variants; let i = index;">
          <h2><i>{{variant.toIntelligentDisplayRepresentation()}}</i></h2>
          <table border="1">
            <tr>
              <th>Clinical Trial ID</th>
              <th>Brief Title</th>
              <th>Principal Investigator</th>
            </tr>
            <tr *ngFor="let clinicalTrial of clinicalTrials[i]" class="variantRow">
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
    
    .variantRow {
      background-color: white;
      opacity: 1;
    }
    
    .variantRow:hover {
      opacity: 0.5;
    }
  `]
})
export class VisualizeResultsComponent implements OnInit {
  constructor (public clinicalTrialsSearchService: ClinicalTrialsSearchService) {}

  tabChoices: string[] = ['Clinical Trials/Drugs', 'Gene/Variant Descriptions/Types', 'Pathogenicities'];
  selectedTabIndex: number = 0;

  // One set of clinical trials per gene variant.
  variants: Variant[];
  clinicalTrials: ClinicalTrialReference[][] = [];

  ngOnInit(): void {
    console.log('Got Gene Variants', USER_SELECTED_VARIANTS);
    this.variants = USER_SELECTED_VARIANTS;

    // Populate clinical trials.
    for (let variantIndex = 0; variantIndex < this.variants.length; variantIndex++) {
      this.clinicalTrials.push([]);
      this.clinicalTrialsSearchService.searchClinicalTrials(this.variants[variantIndex]).subscribe(trials => this.clinicalTrials[variantIndex] = trials);
    }
  }
}
