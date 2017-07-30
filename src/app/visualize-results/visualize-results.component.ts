import { Component, OnInit } from '@angular/core';
import { GENE_VARIATIONS } from '../data-entry/data-entry-form.component';
import { VisualizeResultsService } from './visualize-results.service';
/**
 * This component and its corresponding route is used to display data about the gene and variants selected by
 * the user in the previous step.
 */

@Component({
  selector: 'visualize-results',
  template: `
    <div id="tabChoices">
      <div id="tabScroller" [style.width.px]="tabChoices.length * 300">
        <button *ngFor="let tabChoice of tabChoices; let i=index;" (click)="selectedTabIndex = i"
                [style.background-color]="selectedTabIndex !== i ? '#e9e9e9' : '#ffffff'"
                [style.border-bottom]="selectedTabIndex === i ? '0' : '1px solid black'">{{tabChoice}}
        </button>
      </div>
    </div>

    <div id="tabContentBorder">
      <!-- Drugs Tab -->
      <div id="drugsInfo" class="tabContent" *ngIf="selectedTabIndex === 0">
        <h1>Drugs Info</h1>
      </div>

      <!-- Clinical Trials Tab -->
      <div id="clinicalTrialsInfo" class="tabContent" *ngIf="selectedTabIndex === 1">
        <h1>Clinical Trials Info</h1>
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

    #tabScroller {
      height: 100%;
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
  `]
})
export class VisualizeResultsComponent implements OnInit {
  constructor (visualizeResultsService: VisualizeResultsService) {}

  tabChoices: string[] = ['Effective Drugs', 'Clinical Trials', 'Variant Types'];
  selectedTabIndex: number = 0;

  ngOnInit(): void {
    console.log('Gene Variations', GENE_VARIATIONS);
  }
}
