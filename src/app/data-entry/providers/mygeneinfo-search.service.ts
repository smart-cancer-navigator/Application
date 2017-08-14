/**
 * MyVariant.info compiles variant database information from across the web and provides in an easy-to-query
 * online API.
 */
import { IGeneDatabase } from "../data-entry.service";
import { Observable } from "rxjs/Observable";
import { Variant } from "../../global/genomic-data";

import { Http } from "@angular/http";
import { Injectable } from "@angular/core";


/**
 * Since the myvariant.info response JSON is MASSIVE and depends to a large extent on the query, these locations
 * map the keys of the JSON where values may be stored.
 */

@Injectable()
export class MyGeneInfoSearchService implements IGeneDatabase {

  constructor (private http: Http) {}

  public updateVariantOrigin = (variant: Variant): Observable<Variant> => {
    if (!variant.origin || !variant.origin.entrezID) {
      console.log("Required fields were not provided");
      return Observable.of(variant);
    }

    // Query for gene stuff.
    return this.http.get("http://mygene.info/v3/gene/" + variant.origin.entrezID)
      .map(response => {
        const responseJSON = response.json();

        variant.origin.name = responseJSON.name;
        variant.origin.description = responseJSON.summary;

        return variant;
      });
  }
}
