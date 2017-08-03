/**
 * Wrapper class of tabs for a bunch of post- data-entry components (Clinical Trials, etc.)
 */

import { Component } from '@angular/core';

@Component({
  selector: 'visualize-results',
  template: `
    <div class="root">
      <ngb-tabset>
        <ngb-tab title="Relevant Clinical Trials">
          <ng-template ngbTabContent>
            <clinical-trials></clinical-trials>
          </ng-template>
        </ngb-tab>
        <ngb-tab title="Drugs">
          <ng-template ngbTabContent>
            <p>Tab 2 Content</p>
          </ng-template>
        </ngb-tab>
      </ngb-tabset>
    </div>
  `,
  styles: [`    
    table {
      width: 100%;
    }
  `]
})
export class VisualizeResultsComponent {
}
