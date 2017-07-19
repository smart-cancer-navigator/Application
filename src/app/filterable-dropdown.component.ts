/**
 * This component contains the HTML for the filterable dropdown component employed when the user
 * selects the patient disease being observed, or the gene/variant/type queried from the
 * gene-database-manager service.
 */

import {Component, Input, OnInit} from '@angular/core';
import { Dropdown } from './dropdown';

@Component({
  selector: 'filterable-dropdown',
  template: `    
    <input type="text" [(ngModel)]="dropdownReference.selected" placeholder="{{dropdownReference.purpose}}"/>
    <div>
      <button *ngFor="let option of dropdownReference.options">{{option}}</button>
    </div>
  `,
  styles: [`
  `]
})

export class FilterableDropdownComponent implements OnInit {

  @Input() // Tells Angular that this property should be included in the selector declaration.
  dropdownReference: Dropdown;

  ngOnInit(): void {
  }

}
