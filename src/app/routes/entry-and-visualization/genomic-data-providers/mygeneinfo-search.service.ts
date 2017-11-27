/**
 * MyVariant.info compiles variant database information from across the web and provides in an easy-to-query
 * online API.
 */
import { Observable } from "rxjs/Observable";
import { Pathway, Variant } from "../genomic-data";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JSONNavigatorService } from "./utilities/json-navigator.service";
import { IGeneDatabase } from "../variant-selector/variant-selector.service";


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

  constructor (private http: HttpClient, private jsonNavigator: JSONNavigatorService) {}

  public updateVariantOrigin = (variant: Variant): Observable<Variant> => {
    if (!variant.origin || !variant.origin.entrezID) {
      console.log("Required fields were not provided");
      return Observable.of(variant);
    }

    // Query for gene stuff.
    return this.http.get("https://mygene.info/v3/gene/" + variant.origin.entrezID)
      .map(response => {
        console.log("Got for gene annotation ", response);

        if (response["name"]) {
          variant.origin.name = response["name"];
        }
        if (response["alias"]) {
          if (response["alias"] instanceof Array) {
            variant.origin.aliases = response["alias"];
          } else {
            variant.origin.aliases = [response["alias"]];
          }
        }
        if (response["summary"]) {
          variant.origin.description = response["summary"];
        }
        if (response["type_of_gene"]) {
          variant.origin.type = response["type_of_gene"];
        }

        if (response["genomic_pos"]) {
          variant.origin.chromosome = response["genomic_pos"].chr;
          variant.origin.start = response["genomic_pos"].start;
          variant.origin.end = response["genomic_pos"].end;
          variant.origin.strand = response["genomic_pos"].strand;
        }

        if (response["pathway"] && response["pathway"].wikipathways) {
          for (const wikipathway of response["pathway"].wikipathways) {
            variant.origin.pathways.push(new Pathway(wikipathway.id, wikipathway.name));
          }
        }

        return variant;
      });
  }
}
