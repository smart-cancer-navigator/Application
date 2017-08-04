/**
 * This component works to make finding patient gene alterations far easier, inspired by the search at
 * https://ckb.jax.org/geneVariant/find.  Unfortunately, based on the way that external databases are structured,
 * this service only works for previously defined data.
 */

import { Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core';

import { Variant } from '../../../global/genomic-data';
import { HGVSValidatorService } from './hgvs-validator.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'data-entry-hgvs',
  template: `
    <div id="root">
      <input #HGVSInput type="text" class="form-control" placeholder="HGVS ID" (input)="search(HGVSInput.value)" [style.border-color]="currentlyValidHGVS ? 'green' : 'red'" >
    </div>
  `,
  styles: [`
    #root {
      margin-top: 5px;
    }
    
    input {
      height: 60px;
      font-size: 40px;
    }
  `]
})

@Injectable()
export class DataEntryHGVSComponent {

  constructor (private hgvsValidatorService: HGVSValidatorService) {}

  currentlyValidHGVS: boolean = false;
  @Output() selectNewVariant: EventEmitter<Variant> = new EventEmitter();

  // Push a search term into the observable stream.
  previousSubscription: Subscription;
  search(term: string): void {
    this.currentlyValidHGVS = false; // Otherwise takes a while to update.

    if (this.previousSubscription) {
      this.previousSubscription.unsubscribe();
    }

    this.previousSubscription = this.hgvsValidatorService.getHGVS(term).subscribe(responseVariant => {
      if (responseVariant !== null) {
        console.log('Emitting', responseVariant);
        this.selectNewVariant.emit(responseVariant);
        this.currentlyValidHGVS = true;
      } else {
        this.selectNewVariant.emit(null);
        this.currentlyValidHGVS = false;
      }
    });
  }
}
