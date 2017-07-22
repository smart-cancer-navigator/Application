import {Component, Injectable, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Gene } from './gene-variant-type';

@Component({
  selector: 'gene-data-row',
  template: `
    <div [formGroup]="geneDataFormGroup">
      <input type="text" class="form-control" formControlName="street" placeholder="street">
      <small [hidden]="geneDataFormGroup.controls.street.valid" class="text-danger">Street is required</small>
      <input type="text" class="form-control" formControlName="postcode" placeholder="postcode">
    </div>
  `,
  styles: [`    
    .text-danger {
      color: red;
    }
    
    filterable-search {
      width: 33%;
    }
  `]
})

@Injectable()
export class GeneDataRowComponent {
  @Input() public geneDataFormGroup: FormGroup;
}
