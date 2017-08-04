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
    <input #HGVSInput type="text" placeholder="Type Here" (input)="search(HGVSInput.value)" [style.background-color]="currentlyValidHGVS ? 'green' : 'red'" >
  `,
  styles: [`
    input {
      height: 60px;
      font-size: 40px;
      text-align: center;
      border: 1px solid #979797;
      border-radius: 4px;
      padding: 0;
      margin: 10px 0 0;
      width: calc(100% - 12px);
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
