/**
 * This component contains the HTML for the filterable dropdown component employed when the user
 * selects the patient disease being observed, or the gene/variant/type queried from the
 * gene-database-manager service.
 */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'filterable-dropdown',
  template: `    
  `,
  styles: [`
  `]
})

export class FilterableDropdownComponent implements OnInit {
  constructor(
    private dropdownData: string[]
  ) {}

  ngOnInit(): void {
    this.provideData(this.dropdownData);
  }

  provideData(data: string[]): void {
  }

  receiveChoice(): string {
    return '';
  }
}
