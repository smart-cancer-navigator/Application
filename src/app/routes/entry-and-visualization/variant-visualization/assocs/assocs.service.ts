import {Variant} from "../../genomic-data";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AssocReference, AssocRelation, Assocs} from "./assocs";
/**
 * Based on the Angular and RxJS documentation, this is the best way to deal with sequential HTTP requests (those
 * that have results which vary based on the results to prior queries).
 */
import "rxjs/add/operator/mergeMap";


@Injectable()
export class AssocsService {
  constructor(public http: HttpClient) {
  }

  queryEndpoint = "https://search.cancervariants.org/api/v1/associations?size=100&q=";


  searchAssocs = (variant: Variant): Observable<Assocs> => {

    // Gets a list of assoc references from the single JSON object.
    const assocJSONtoReferences = (jsonObject: Object): AssocReference[] => {
      console.log("assoc json:", jsonObject);
      const references: AssocReference[] = [];
      for (const hits of jsonObject["hits"].hits) {
        // parse envContexts from json
        const envContexts: string[] = [];
        if (hits.association.environmentalContexts !== undefined && hits.association.environmentalContexts.length > 0) {
          for (const environmentalContext of hits.association.environmentalContexts) {
            envContexts.push(environmentalContext.id);
          }
        } else {
          console.log("no environmentalContexts", hits.association);
        }
        // parse drugs from json
        const drugs: string[] = [];
        if (hits.drugs !== undefined && hits.drugs.length > 0) {
          for (const drug of hits.drugs.split(",")) {
            drugs.push(drug);
          }
        } else {
          drugs.push("NA");
          console.log("no drugs", hits);
        }

        // parse diseases from json
        const diseases: string[] = [];
        if (hits.diseases !== undefined && hits.diseases.length > 0) {
          for (const disease of hits.diseases.split(",")) {
            diseases.push(disease);
          }
        } else {
          diseases.push("NA");
          console.log("no diseases", hits);
        }
        // parse features from json
        const features: string[] = [];
        if (hits.features !== undefined && hits.features.length > 0) {
          for (const feature of hits.features) {
            if (feature.description !== undefined) {
              features.push(feature.description);
            }
          }
        }

        // parse phenotypes from json
        const phenotypes: string[] = [];
        if (hits.association.phenotypes.length > 0) {
          for (const phenotype of hits.association.phenotypes) {
            phenotypes.push(phenotype.id);
          }
        } else {
          console.log("no phenotypes", hits.association);
          phenotypes.push("NA");

        }
        // parse genes for relation from json
        const genes: string[] = [];
        if (hits.genes.length > 0) {
          for (const gene of hits.genes) {
            genes.push(gene);
          }
        } else {
          console.log("no genes", hits.association);
          genes.push("NA");

        }

        // create new object for row
        references.push(new AssocReference(
          variant.variantName,
          envContexts.join(",  "),
          phenotypes.join(",  "),
          diseases.join(",  "),
          drugs.join(",  "),
          hits.association.response_type,
          hits.association.evidence_level,
          hits.association.evidence_label,
          features.join(",  "),
          hits.publications,
          genes,
        ));
      }
      return references;

    };

    // Requirements before constructing queries.
    const hgvs_id = variant.hgvsID.replace(":", "%5C%3A").replace(">", "%3E");
    const evidence_label = "%20%20%2Bassociation.evidence_label%3AA";
    return this.http
      .get(this.queryEndpoint + hgvs_id)
      // .get(this.queryEndpoint + hgvs_id)
      .mergeMap(result2 => {
        console.log("api:", this.queryEndpoint + hgvs_id + "%20%20%2Bassociation.evidence_label%3AA");
        console.log("Got assoc query result2:", result2);
        const resultReferences = assocJSONtoReferences(result2);

        const genes: string[] = [];
        const drugs: string[] = [];
        const diseases: string[] = [];
        const geneDrugs = new Map();
        const geneDiseases = new Map();
        const assocRelations: AssocRelation[] = [];

        // get gene/drug/disease set
        console.log("resultReferences", resultReferences);
        for (const result of resultReferences) {
          for (const gene of result.genes) {
            if (gene === "NA" || genes.includes(gene)) {
            }
            else {
              genes.push(gene);
            }
          }
          for (const drug of result.drugs.split(",")) {
            if (drug === "NA" || drugs.includes(drug)) {
            }
            else {
              drugs.push(drug);
            }
          }
          for (const disease of result.diseases.split(",")) {
            if (disease === "NA" || diseases.includes(disease) && disease !== "NA") {
            }
            else {
              diseases.push(disease);
            }
          }
        }

        // get gene-drug/gene-disease connection count
        for (const gene of genes) {
          // gene-drug connection count
          for (const drug of drugs) {
            geneDrugs.set(drug, 0);
          }

          for (const result of resultReferences) {
            for (const gene2 of result.genes) {
              if (gene2 === gene) {
                for (const drug2 of result.drugs.split(",")) {
                  if (drug2 !== "NA" ){
                  console.log("map", drug2);
                  const number: number = geneDrugs.get(drug2);
                  console.log("map", geneDrugs.get(drug2));
                  geneDrugs.delete(drug2);
                  geneDrugs.set(drug2, number + 1);
                  console.log("map", geneDrugs.get(drug2));
                }
              }
              }
            }
          }

          // gene-disease connection count
          for (const disease of diseases) {
            geneDiseases.set(disease, 0);
          }

          for (const result of resultReferences) {
            for (const gene2 of result.genes) {
              if (gene2 === gene) {
                for (const disease2 of result.diseases.split(",")) {
                  if (disease2 !== "NA" ){
                    console.log("map", disease2);
                    const number: number = geneDiseases.get(disease2);
                    console.log("map", geneDiseases.get(disease2));
                    geneDiseases.delete(disease2);
                    geneDiseases.set(disease2, number + 1);
                    console.log("map", geneDiseases.get(disease2));
                  }


                }
              }
            }
          }


          // transfer to number array
          const drugAmount = [];
          for (const drug of drugs) {
            drugAmount.push(geneDrugs.get(drug));
          }
          const diseaseAmount = [];
          for (const disease of diseases) {
            diseaseAmount.push(geneDiseases.get(disease));
          }

          // construct AssocRelation object
          assocRelations.push(new AssocRelation(
            gene,
            drugs,
            diseases,
            drugAmount,
            diseaseAmount
            )
          );
        }

        // construct Assoc object
        const assocs: Assocs = new Assocs(
          genes,
          drugs,
          diseases,
          resultReferences,
          assocRelations
        );

        return Observable.of(assocs);
      });

  }
}
