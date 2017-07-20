import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { CancerType } from './cancertype';
import { CancerTypeSearchService } from './cancertype-search.service';

import { Gene } from './gene';
import { GeneSearchService } from './gene-search.service';
import {SMARTReferenceService} from './smart-reference.service';

@Component({
  selector: 'data-entry',
  template: `    
    
  `,
  styles: [`
    
  `]
})

export class DataEntryComponent implements OnInit {
  cancertype: CancerType;

  constructor(
    private cancertypeSearchService: CancerTypeSearchService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
  }

  goBack(): void {
    this.location.back();
  }
}
