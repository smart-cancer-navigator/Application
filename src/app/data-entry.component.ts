import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'data-entry',
  template: `    
    
  `,
  styles: [`
  `]
})

export class DataEntryComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Do something with the ParamMap
  }
}
