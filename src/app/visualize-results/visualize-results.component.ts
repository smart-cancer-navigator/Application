/**
 * Wrapper class of tabs for a bunch of post- data-entry components (Clinical Trials, etc.)
 */

import { Component, OnInit } from '@angular/core';
import { Variant } from '../global/genomic-data';
import { USER_SELECTED_VARIANTS } from '../data-entry/data-entry-form.component';

@Component({
  selector: 'visualize-results',
  template: `
    <ngb-tabset [destroyOnHide]="false" >
      <ngb-tab *ngFor="let variant of variants; let i = index;" title="{{variant.toIntelligentDisplayRepresentation()}}">
        <ng-template ngbTabContent>
          
          <!-- A bit of info about the variant/gene -->
          <table class="table table-bordered table-striped">
            <thead>
            </thead>
            <tbody>
            <tr>
              <td>Description</td>
              <td>{{variant.description}}</td>
            </tr>
            <tr>
              <td>Score</td>
              <td ngbPopover="Variant Score defines Pathogenicity." triggers="mouseenter:mouseleave">{{variant.score}}</td>
            </tr>
            <tr>
              <td>Variant Origin</td>
              <td>{{variant.somatic ? 'Somatic' : 'Germline'}}</td>
            </tr>
            <tr>
              <td>Variant Type</td>
              <td>{{variant.types}}</td>
            </tr>
            </tbody>
          </table>
          
          <ngb-accordion #acc="ngbAccordion">
            <ngb-panel title="Relevant Clinical Trials">
              <ng-template ngbPanelContent>
                <clinical-trials [forVariant]="variant"></clinical-trials>
              </ng-template>
            </ngb-panel>
          </ngb-accordion>
        </ng-template>
      </ngb-tab>
    </ngb-tabset>
  `
})
export class VisualizeResultsComponent implements OnInit {
  variants: Variant[];

  ngOnInit() {
    this.variants = USER_SELECTED_VARIANTS;
  }
}
