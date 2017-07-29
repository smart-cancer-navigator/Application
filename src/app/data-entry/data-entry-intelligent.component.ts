/**
 * This component constitutes three filterable search menus into a single component, making it easier for the
 * data entry component to populate the form.
 */

import { AfterViewInit, Component, HostListener, Injectable, Input, ViewChild } from '@angular/core';

import { Gene, Variant } from '../global/genomic-data';
import { RobustGeneSearchService } from './robust-gene-search.service';
import { RobustVariantSearchService } from './robust-variant-search.service';
import { GeneDataRow } from './data-entry-form.component';

@Component({
  selector: 'data-entry-intelligent',
  template: `
    <input #MainSearch type="text" placeholder="Type Here" (focus)="suggestionsOpen = true" (blur)="suggestionsOpen = false">
    <div id="popupSuggestionPanel" *ngIf="suggestionsOpen" [style.width.px]="desiredPopupWidth">
      
    </div>
  `,
  styles: [`
    input {
      height: 60px;
      font-size: 40px;
      text-align: center;
      border: 1px solid #979797;
      border-radius: 4px;
      padding: 0;
      margin: 10px 0 0;
      width: calc(100% - 12px);
    }

    #popupSuggestionPanel {
      display: block;
      position: absolute;

      height: 300px;
      background-color: white;
      border: 1px solid black;
      border-top: 0;
    }
  `],
  providers: [RobustGeneSearchService, RobustVariantSearchService]
})

@Injectable()
export class DataEntryIntelligentComponent implements AfterViewInit {

  suggestionsOpen: boolean = false;

  @Input() geneDataRow: GeneDataRow;

  onGeneSelected = (gene: Gene) => {
    this.geneDataRow.gene = gene;
    this.variantSearchService.onGeneChosen(gene);
  }

  onVariantSelected = (variant: Variant) => {
    this.geneDataRow.variant = variant;
  }


  /**
   * Automatically resize suggestion panel based on text box size.
   */
  desiredPopupWidth: number = 0;

  ngAfterViewInit() {
    setTimeout(() => this.recalculatePopupWidth(), 20);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.recalculatePopupWidth();
  }

  @ViewChild('MainSearch') mainSearch: any;
  recalculatePopupWidth = () => {
    this.desiredPopupWidth = this.mainSearch.nativeElement.offsetWidth - 2;
    console.log('Set to ' + this.desiredPopupWidth);
  }

  constructor (public geneSearchService: RobustGeneSearchService, public variantSearchService: RobustVariantSearchService) {}
}
