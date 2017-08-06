/**
 * Wrapper class of tabs for a bunch of post- data-entry components (Clinical Trials, etc.)
 */

import { Component, OnInit } from '@angular/core';
import { Variant } from '../global/genomic-data';
import { USER_SELECTED_VARIANTS } from '../data-entry/data-entry.component';

@Component({
  selector: 'visualize-results',
  template: `
    <h2 class="display-2">Results</h2>
    <ngb-accordion #acc="ngbAccordion">
      <ngb-panel *ngFor="let variant of variants; let i = index;" title="{{variant.optionName()}}">
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
                    <td>Score</td>
                    <td ngbPopover="Gene Score defines Pathogenicity." triggers="mouseenter:mouseleave">{{variant.origin.score}}</td>
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
                    <td *ngIf="variant.description && variant.description !== ''" >{{variant.description}}</td>
                    <td *ngIf="!variant.description || variant.description === ''" ><i>Knowledge Base Gap</i></td>
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
                    <td *ngIf="variant.types.length > 0" >{{variant.types.join(', ')}}</td>
                    <td *ngIf="variant.types.length === 0" ><i>Knowledge Base Gap</i></td>
                  </tr>
                  <tr>
                    <td>Effective Drugs</td>
                    <td *ngIf="variant.drugs.length > 0" >{{variant.drugs.join(', ')}}</td>
                    <td *ngIf="variant.drugs.length === 0" ><i>Knowledge Base Gap</i></td>
                  </tr>
                  <tr>
                    <td>Variant Location</td>
                    <td>Chromosome {{variant.chromosome}}, {{variant.start !== variant.end ? 'Nucleotides ' +  variant.start + ' to ' + variant.end : 'Nucleotide ' + variant.start}}</td>
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
