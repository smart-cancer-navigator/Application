/**
 * Wrapper class of tabs for a bunch of post- data-entry components (Clinical Trials, etc.)
 */

import { Component, OnInit } from '@angular/core';
import { Variant } from '../global/genomic-data';
import { USER_SELECTED_VARIANTS } from '../data-entry/data-entry-form.component';

@Component({
  selector: 'visualize-results',
  template: `
    <ngb-accordion #acc="ngbAccordion">
      <ngb-panel *ngFor="let variant of variants; let i = index;" title="{{variant.toIntelligentDisplayRepresentation()}}">
        <ng-template ngbPanelContent>
          <ngb-tabset [destroyOnHide]="false" >
            <ngb-tab title="Gene">
              <ng-template ngbTabContent>
                
                <br>
                <h3 class="display-3">
                  {{variant.origin.hugo_symbol}}
                  <small class="text-muted">{{variant.origin.name}}</small>
                </h3>
                
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
                  <tr>
                    <td>Gene Location</td>
                    <td>Chromosome {{variant.chromosome}}, Nucleotides {{variant.start}} to {{variant.end}}</td>
                  </tr>
                  </tbody>
                </table>
              </ng-template>
            </ngb-tab>
            
            <ngb-tab title="Variant">
              <ng-template ngbTabContent>
                
                <br>
                <h3 class="display-3">{{variant.variant_name}}</h3>
                
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
                  <tr>
                    <td>Gene Location</td>
                    <td>Chromosome {{variant.chromosome}}, Nucleotides {{variant.start}} to {{variant.end}}</td>
                  </tr>
                  </tbody>
                </table>
              </ng-template>
            </ngb-tab>

            <ngb-tab title="Clinical Trials">
              <ng-template ngbTabContent>
                <clinical-trials [forVariant]="variant"></clinical-trials>
              </ng-template>
            </ngb-tab>
          </ngb-tabset>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>
  `,
  styles: [`    
    small {
      font-size: 25px;
    }
  `]
})
export class VisualizeResultsComponent implements OnInit {
  variants: Variant[];

  ngOnInit() {
    this.variants = USER_SELECTED_VARIANTS;
  }
}
