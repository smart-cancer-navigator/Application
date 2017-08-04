/**
 * This service validates the HGVS ID for a given variant using the interfaces provided at database-services.
 */
import { Http } from '@angular/http';
import { HGVSIdentifier } from '../../providers/database-services.interface';
import { MyVariantInfoSearchService } from '../../providers/myvariantinfo-search.service';
import { Observable } from 'rxjs/Observable';
import { Variant } from '../../../global/genomic-data';
import { Injectable } from '@angular/core';

@Injectable()
export class HGVSValidatorService {
  constructor (private myVariantHGVSValidator: MyVariantInfoSearchService) {}

  hgvsValidationServices: HGVSIdentifier[] = [this.myVariantHGVSValidator];

  getHGVS = (hgvsID: string): Observable <Variant> => {
    return Observable.forkJoin(this.hgvsValidationServices
      .map(searchService => searchService.validateHGVS(hgvsID))
    ).map((variantArray: Variant[]) => {
        let currentVariant: Variant = null;

        // Variant merging/placing loop.
        for (const variant of variantArray) {
          if (!variant) {
            continue; // Continue on to next variant.
          }

          if (currentVariant === null) {
            currentVariant = variant;
          } else {
            currentVariant.mergeWith(variant);
          }
        }

        console.log('Returning ' + currentVariant + ' in response to ' + hgvsID);

        return currentVariant;
      }
    );
  }
}
