/**
 * CIViC (Clinical Interpretations of Variants in Cancer) is a database which provides genes, variants,
 * and variant types for a wide variety of cancer-causing factors.
 */
import { VariantDataProvider } from './database-services.interface';
import { Observable } from 'rxjs/Observable';
import { Gene, Variant } from './genomic-data';
import { Http } from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class MyVariantInfoSearchService implements VariantDataProvider {

  constructor(private http: Http) {}

  /**
   * The variants for the CIViC Search Service
   */
  public provideVariants = (searchTerm: string, additionalContext: Gene): Observable<Variant[]> => {
    return this.http.get('myvariant.info/v1/query?q=civic.entrez_name%3A' + additionalContext.entrez_name + '%20AND%20civic.name%3A' + searchTerm + '*&fields=civic.entrez_name%2Ccivic.name&size=15')
      .map(result => result.json())
      .map(resultJSON => {
        const variantResults: Variant[] = [];
        for (const hit of resultJSON.hits) {
          const variant: Variant = new Variant();
          variant.hgvs_id = hit._id;
          variant.score = hit._score;
          variant.entrez_name = hit.civic.name;
          variant.entrez_id = 1; // TODO: add this
          variant.origin = additionalContext;

          variantResults.push(variant);
        }

        return variantResults;
      });
  }

  public validateHGVSID = (hgvsID: string): Observable<boolean> => {
    if (hgvsID === '') {
      console.log('Search is empty');
      return Observable.of(false);
    }

    return this.http.get('http://myvariant.info/v1/variant/' + hgvsID + '?fields=_id')
      .map(result => result.json())
      .map(resultJSON => {
        console.log('Validation JSON:', resultJSON);
        return true;
      }).catch((err: any) => { // Regardless that this error is being caught, it will still show up in the console.
        return Observable.of(false);
      });
  }
}
