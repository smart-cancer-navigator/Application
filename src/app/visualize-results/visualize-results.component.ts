/**
 * Wrapper class of tabs for a bunch of post- data-entry components (Clinical Trials, etc.)
 */

import { Component, OnInit } from '@angular/core';
import { Variant } from '../global/genomic-data';
import { USER_SELECTED_VARIANTS } from '../data-entry/data-entry-form.component';

@Component({
  selector: 'visualize-results',
  template: `
    <div class="root">
      <ngb-tabset [destroyOnHide]="false" >
        <ngb-tab *ngFor="let variant of variants; let i = index;" title="{{variant.toIntelligentDisplayRepresentation()}}">
          <ng-template ngbTabContent>
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
    </div>
  `
})
export class VisualizeResultsComponent implements OnInit {
  variants: Variant[];

  ngOnInit() {
    this.variants = USER_SELECTED_VARIANTS;
  }
}
