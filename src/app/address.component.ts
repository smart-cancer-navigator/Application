import {Component, Injectable, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'address',
  template: `
  <div [formGroup]="adressForm">
    <input type="text" class="form-control" formControlName="street" placeholder="street">
    <small [hidden]="adressForm.controls.street.valid" class="text-danger">Street is required</small>
    <input type="text" class="form-control" formControlName="postcode" placeholder="postcode">
  </div>
  `,
  styles: [`    
    .text-danger {
      color: red;
    }
  `]
})
@Injectable()
export class AddressComponent {
  @Input() public adressForm: FormGroup;
}
