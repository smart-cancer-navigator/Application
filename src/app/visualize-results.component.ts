import { Component, OnInit } from '@angular/core';
import { GENE_VARIATIONS } from './data-entry-form.component';
/**
 * This component and its corresponding route is used to display data about the gene and variants selected by
 * the user in the previous step.
 */

@Component({
  selector: 'visualize-results',
  template: `
  `,
  styles: [`
  `]
})
export class VisualizeResultsComponent implements OnInit {
  ngOnInit(): void {
    console.log('Gene Variations', GENE_VARIATIONS);
  }
}
