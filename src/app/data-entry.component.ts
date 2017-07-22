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
            <button class="clickable" *ngIf="myForm.controls.geneVariations.controls.length > 1"
                    (click)="removeRow(i)">X
            </button>
          </div>
          <div class="panel-body" [formGroupName]="i">
            <gene-data-row [geneDataFormGroup]="myForm.controls.geneVariations.controls[i]"></gene-data-row>
          </div>
        </div>
      </div>

      <button type="button" (click)="addRow()" style="cursor: default" class="finalizeButton clickable">Add Row</button>
      <button type="submit" [disabled]="!myForm.valid" class="finalizeButton clickable">Submit</button>

      <div>myForm details:-</div>
      <pre>Is myForm valid?: <br>{{myForm.valid | json}}</pre>
      <pre>form value: <br>{{myForm.value | json}}</pre>
    </form>
  `,
  styles: [`
    .entryPanel {
      border: 0.5px solid black;
      border-radius: 5px;
      margin-bottom: 5px;
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
      width: calc(100% - 40px);
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
      padding: 0;
      font-size: 20px;
      color: white;
    }

    .clickable {
      opacity: 1;
    }

    .clickable:hover {
      opacity: 0.7;
    }

    .clickable:active {
      opacity: 0.5;
    }
    
    button:disabled {
      opacity: 0.5;
    }

    .panel-body {
      width: 100%;
      padding: 10px;
    }

    address {
      width: 100%;
    }

    .finalizeButton {
      width: calc(50% - 2px);
      height: 30px;
      border: 1px solid black;
      border-radius: 10px;
      background-color: #718599;
      color: white;
      font-size: 20px;
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

    // add row
    this.addRow();

    /* subscribe to addresses value changes */
    // this.myForm.controls['addresses'].valueChanges.subscribe(x => {
    //   console.log(x);
    // })
  }

  addRow() {
    const control = <FormArray>this.myForm.controls['geneVariations'];
    const newRow = this._fb.group({
      street: ['', Validators.required],
      postcode: ['']
    });

    control.push(newRow);

    /* subscribe to individual address value changes */
    // addrCtrl.valueChanges.subscribe(x => {
    //   console.log(x);
    // })
  }

  removeRow(i: number) {
    const control = <FormArray>this.myForm.controls['geneVariations'];
    control.removeAt(i);
  }

  save(model: Customer) {
    // call API to save
    // ...
    console.log(model);
  }
}
