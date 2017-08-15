/**
 * MyVariant.info compiles variant database information from across the web and provides in an easy-to-query
 * online API.
 */
import { IGeneDatabase } from "../data-entry.service";
import { Observable } from "rxjs/Observable";
import {Pathway, Variant} from "../../global/genomic-data";

import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import {JSONNavigatorService} from "./utilities/json-navigator.service";


/**
 * Since the myvariant.info response JSON is MASSIVE and depends to a large extent on the query, these locations
 * map the keys of the JSON where values may be stored.
 */


const GENE_DATA_LOCATIONS = {
  "Aliases": [
    "alias[]"
  ]
};

@Injectable()
export class MyGeneInfoSearchService implements IGeneDatabase {

  constructor (private http: Http, private jsonNavigator: JSONNavigatorService) {}

  public updateVariantOrigin = (variant: Variant): Observable<Variant> => {
    if (!variant.origin || !variant.origin.entrezID) {
      console.log("Required fields were not provided");
      return Observable.of(variant);
    }

    // Query for gene stuff.
    return this.http.get("http://mygene.info/v3/gene/" + variant.origin.entrezID)
      .map(response => {
        const responseJSON = response.json();

        console.log("Got for gene annotation ", responseJSON);

        if (responseJSON.name) {
          variant.origin.name = responseJSON.name;
        }
        if (responseJSON.alias) {
          variant.origin.aliases = responseJSON.alias;
        }
        if (responseJSON.summary) {
          variant.origin.description = responseJSON.summary;
        }
        if (responseJSON.type_of_gene) {
          variant.origin.type = responseJSON.type_of_gene;
        }

        if (responseJSON.pathway && responseJSON.pathway.wikipathways) {
          for (const wikipathway of responseJSON.pathway.wikipathways) {
            variant.origin.pathways.push(new Pathway(wikipathway.id, wikipathway.name));
          }
        }

        return variant;
      });
  }
}
