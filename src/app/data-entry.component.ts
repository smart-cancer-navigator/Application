import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

class GeneVariantType {
  gene: string;
  variant: string;
  type: string;
}

@Component({
  selector: 'data-entry',
  template: `    
    
  `,
  styles: [`
  `]
})

export class DataEntryComponent implements OnInit {
  geneVariantTypeArray: GeneVariantType[] = [
    {gene: 'PX41', variant: '225E', type: 'Missense Variant' },
    {gene: 'BRCA1', variant: '226B', type: 'Loss of Function Variant' }
  ];

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Do something with the ParamMap
  }
}
