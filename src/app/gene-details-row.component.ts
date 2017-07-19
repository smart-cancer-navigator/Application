/**
 * This component contains a row of 3 filterable-dropdown components, which the user can use to select
 * the gene, variant, and type for a given patient mutation.  It can be either previously populated
 * from a given FHIR JSON object (or possibly XML report), or manually filled in.
 *
 * This component queries data from the gene-database-manager to provide options for the user to fill
 * in, which are then passed to the filterable dropdown component.
 */

import { Component } from '@angular/core';
import { Dropdown } from './dropdown';

const DROPDOWNS: Dropdown[] = [
  { purpose: 'Gene', selected: '', options: [] }
];

@Component({
  selector: 'gene-details-row',
  template: `    
    <filterable-dropdown *ngFor="let dropdown of dropdowns" [dropdownReference]="dropdown"></filterable-dropdown>
  `,
  styles: [`
  `]
})

export class GeneDetailsRow {
  dropdowns = DROPDOWNS;
}
