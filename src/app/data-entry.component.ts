/**
 * Data entry is an essential part of the final application that will be built, and it must be built in
 * a way which permits dynamic addition and removal of form elements.  Since Angular makes modularity
 * insanely easy and you can build custom input selectors, this shouldn't require too much code.
 * (Following https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2) to some
 * extent.
 */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Customer } from './customer.interface';

@Component({
  selector: 'data-entry',
  template: `
    <form [formGroup]="myForm" novalidate (ngSubmit)="save(myForm)">
      <!-- Gene Variation List -->
      <div formArrayName="geneVariations">
        <div *ngFor="let geneVariation of myForm.controls.geneVariations.controls; let i=index" class="entryPanel">
          <div class="panel-heading">
            <p>Variation {{i + 1}}</p>
            <button *ngIf="myForm.controls.geneVariations.controls.length > 1" (click)="removeGeneVariation(i)">X
            </button>
          </div>
          <div class="panel-body" [formGroupName]="i">
            <address [adressForm]="myForm.controls.geneVariations.controls[i]"></address>
          </div>
        </div>
      </div>

      <button type="button" (click)="addGeneVariation()" style="cursor: default">Add Address</button>

      <button type="submit" class="btn btn-primary pull-right" [disabled]="!myForm.valid">Submit</button>

      <div>myForm details:-</div>
      <pre>Is myForm valid?: <br>{{myForm.valid | json}}</pre>
      <pre>form value: <br>{{myForm.value | json}}</pre>
    </form>
  `,
  styles: [`
    .entryPanel {
      border: 1px solid black;
      border-radius: 5px;
    }

    .panel-heading {
      height: 30px;
      padding: 0;
      background-color: #c8c8c8;
    }

    .panel-heading p {
      float: left;
      margin: 5px;
      font-size: 15px;
      text-align: left;
      width: 150px;
    }

    .panel-heading button {
      outline: none;
      margin: 0;
      height: 30px;
      width: 30px;
      float: right;
      background-color: red;
      border: 1px solid white;
      border-radius: 5px;
      opacity: 1;
    }

    .panel-heading button:hover {
      opacity: 0.7;
    }
    
    .panel-heading button:active {
      opacity: 0.5;
    }
    
    .panel-body {
      width: 100%;
    }
    
    address {
      width: 100%;
    }
  `]
})
export class DataEntryComponent implements OnInit {
  public myForm: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      geneVariations: this._fb.array([])
    });

    // add address
    this.addGeneVariation();

    /* subscribe to addresses value changes */
    // this.myForm.controls['addresses'].valueChanges.subscribe(x => {
    //   console.log(x);
    // })
  }

  initAddress() {
    return this._fb.group({
      street: ['', Validators.required],
      postcode: ['']
    });
  }

  addGeneVariation() {
    const control = <FormArray>this.myForm.controls['geneVariations'];
    const addrCtrl = this.initAddress();

    control.push(addrCtrl);

    /* subscribe to individual address value changes */
    // addrCtrl.valueChanges.subscribe(x => {
    //   console.log(x);
    // })
  }

  removeGeneVariation(i: number) {
    const control = <FormArray>this.myForm.controls['geneVariations'];
    control.removeAt(i);
  }

  save(model: Customer) {
    // call API to save
    // ...
    console.log(model);
  }
}
