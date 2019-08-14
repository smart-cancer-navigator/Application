import {Variant} from "../../genomic-data";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AssocReference} from "./assocs";
/**
 * Based on the Angular and RxJS documentation, this is the best way to deal with sequential HTTP requests (those
 * that have results which vary based on the results to prior queries).
 */
import "rxjs/add/operator/mergeMap";


@Injectable()
export class AssocsService {
  constructor (public http: HttpClient) {}

  queryEndpoint = "https://search.cancervariants.org/api/v1/associations?size=20&from=1&q=";


  searchAssocs = (variant: Variant): Observable<AssocReference[]> => {

    // Gets a list of assoc references from the single JSON object.
    const assocJSONtoReferences = (jsonObject: Object): AssocReference[] => {
      console.log("assoc json:", jsonObject);
      const references: AssocReference[] = [];
      for (const hits of jsonObject["hits"].hits) {

        const envContexts: string[] = [];
        // if (hits.association.environmentalContexts.length > 0){
        //   console.log("envContexts", hits.association.environmentalContexts);
        //   for (const envContext of hits.association.environmentalContexts) {
        //     console.log("envContext", hits.association.envContext);
        //     envContexts.push(envContext.id);
        //   }
        // }
        // else{
        //   console.log("no envContexts", hits.association);
        // }


        const phenotypes: string[] = [];
        if (hits.association.phenotypes.length > 0){
          for (const phenotype of hits.association.phenotypes) {
            phenotypes.push(phenotype.id);
          }
        }
        else{
          console.log("no phenotypes", hits.association);
        }
          references.push(new AssocReference(
          variant.variantName,
          envContexts,
          phenotypes,
          hits.publications,
          hits.diseases,
          hits.drugs,
          hits.association.response_type,
          hits.association.evidence_level,
          hits.association.evidence_label
        ));
      }
      return references;
    };

    // Requirements before constructing queries.

    const hgvs_id = variant.hgvsID.replace(":", "%5C%3A").replace(">", "%3E");
    console.log("api:", this.queryEndpoint + hgvs_id);
    return this.http
      .get(this.queryEndpoint + hgvs_id)
      .mergeMap(result1 => {
        console.log("Got assoc query results:", result1);
        const result1References = assocJSONtoReferences(result1);

        return Observable.of(result1References);

      });
  }
}
