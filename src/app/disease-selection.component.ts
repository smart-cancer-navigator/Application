/**
 * Since the SMART app is unable to figure out which disease an oncologist is looking at without
 * any sort of user data (based on the organization of FHIR objects), this component provides an
 * interface through which the user can accomplish this.
 */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'disease-selection',
  template: `    
    <h1>Select Patient Disease</h1>
    <filterable-dropdown></filterable-dropdown>
  `,
  styles: [`    
  `]
})

export class DiseaseSelectionComponent implements OnInit {
  ngOnInit(): void {

  }
}
