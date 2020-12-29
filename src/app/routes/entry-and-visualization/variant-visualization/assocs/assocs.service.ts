import {Variant} from "../../genomic-data";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AssocReference, Assoc, AssocDrug, AssocDisease} from "./assocs";
/**
 * Based on the Angular and RxJS documentation, this is the best way to deal with sequential HTTP requests (those
 * that have results which vary based on the results to prior queries).
 */
import "rxjs/add/operator/mergeMap";


@Injectable()
export class AssocsService {
  constructor(public http: HttpClient) {
  }

  queryEndpoint = "https://search.cancervariants.org/api/v1/associations?size=1000&q=";


  searchAssocs = (variant: Variant): Observable<Assoc> => {
    // Gets a list of assoc references from the single JSON object.
    const jsontoReferences = (jsonObject: Object): AssocReference[] => {
      console.log("assoc json:", jsonObject);
      const references: AssocReference[] = [];
      for (const hit of jsonObject["hits"].hits) {

        // parse envContexts from json
        const envContexts: string[] = [];
        if (hit.association.environmentalContexts !== undefined && hit.association.environmentalContexts.length > 0) {
          for (const environmentalContext of hit.association.environmentalContexts) {
            envContexts.push(environmentalContext.id);
          }
        } else {
        }
        // parse drugs from json
        const drugs: string[] = [];
        if (hit.drugs !== undefined && hit.drugs.length > 0 && hit.drugs !== "N/A") {
          for (let drug of hit.drugs.split(",")) {
            drug = drug.trim();
            drugs.push(drug);
          }
        } else {
          drugs.push("NA");
          console.log("no drugs", hit);
          console.log("no drugs gene", hit.genes);

        }

        // parse diseases from json
        const diseases: string[] = [];
        if (hit.diseases !== undefined && hit.diseases.length > 0 && hit.diseases !== "N/A") {
          const diseases2 = hit.diseases.split(";").join(",");
          for (const disease of diseases2.split(",")) {
            diseases.push(disease);
          }
        } else {
          diseases.push("NA");
        }
        // parse features from json
        const features: string[] = [];
        if (hit.features !== undefined && hit.features.length > 0) {
          for (const feature of hit.features) {
            if (feature.description !== undefined) {
              features.push(feature.description);
            }
          }
        }

        // parse phenotypes from json
        const phenotypes: string[] = [];
        if (hit.association.phenotypes.length > 0) {
          for (const phenotype of hit.association.phenotypes) {
            phenotypes.push(phenotype.id);
          }
        } else {
          phenotypes.push("NA");

        }

        // parse source_urls from json
        let source_urls: string = "NA";
        if (hit.source_url !== undefined) {
          source_urls = hit.source_url;
        }
        else if (hit.association.source_link !== undefined){
          source_urls = hit.hit.association.source_link;
        }

        // parse genes for relation from json
        const genes: string[] = [];
        if (hit.genes.length > 0) {
          for (const gene of hit.genes) {
            genes.push(gene);
          }
        } else {
          genes.push("NA");
        }

        // parse genes for relation from json
        let response: string = "NA";
        if (hit.association.response_type !== undefined
          && hit.association.response_type !== null
          && hit.association.response_type !== "NA"
          && hit.association.response_type !== "N/A"
        ) {
          response = hit.association.response_type.toLowerCase();
        }
        else{
          console.log("no response", hit);
        }


        // create new object for row
        references.push(new AssocReference(
          variant.hgvsID,
          variant.variantName,
          hit.association.description,
          envContexts.join(",  "),
          phenotypes.join(",  "),
          diseases.join(",  "),
          drugs.join(",  "),
          response,
          hit.association.evidence_level,
          hit.association.evidence_label,
          features.join(",  "),
          source_urls,
          hit.publications,
          genes,
        ));
      }

      references.sort((a, b) => a.evidence_level < b.evidence_level ? -1 : a.evidence_level > b.evidence_level ? 1 : 0);

      return references;

    };

    // Gets a list of assocDrug from the searching-gene assocReference.
    const getAssocDrugs = (resultGenes: AssocReference[]): AssocDrug[] => {
      const gene: string = variant.origin.hugoSymbol;
      const drugs: string[] = [];
      const geneDrugs = new Map();
      const assocDrugs: AssocDrug[] = [];
      // filter for response
      const resultDrugs: AssocReference[] = [];
      for (const result of resultGenes) {
          if (result.response !== "NA" && result.response !== "N/A") {
            resultDrugs.push(result);
          }
      }

      // get drug set
      console.log("resultGenes", resultDrugs);
      for (const result of resultDrugs) {
        for (let drug of result.drugs.split(",")) {
          drug = drug.trim();
          if (drug === "" || drug === " " || drug === "  " || drug === "NA" || drug === "N/A" || drugs.includes(drug)) {
          } else {
            drugs.push(drug);
          }
        }
      }

      // gene-drug connection count
      for (const drug of drugs) {
        geneDrugs.set(drug, 0);
      }

      for (const drug of drugs) {
        let drugAmount = 0;
        const references: AssocReference[] = [];
        for (const resultGene of resultDrugs) {
          // filter for dirty data
          for (let drug2 of resultGene.drugs.split(",")) {
            drug2 = drug2.trim();
            if (drug2 === drug) {
              drugAmount = drugAmount + 1;
              references.push(resultGene);
            }
          }
        }
        if (drugAmount !== 0){
          references.sort((a, b) => a.evidence_level < b.evidence_level ? -1 : a.evidence_level > b.evidence_level ? 1 : 0);
          assocDrugs.push(new AssocDrug(
            variant.hgvsID,
            gene,
            drug,
            drugAmount,
            references
          ));
        }

      }
      return assocDrugs;

    };

    // Gets a list of assocDiseases from the searching-gene assocReference.
    const getAssocDiseases = (resultDiseases: AssocReference[]): AssocDisease[] => {
      const gene: string = variant.origin.hugoSymbol;
      const diseases: string[] = [];
      const geneDiseases = new Map();
      const assocDiseases: AssocDisease[] = [];

      // get disease set
      console.log("resultDiseases", resultDiseases);
      for (const result of resultDiseases) {
        for (let disease of result.diseases.split(",")) {
          disease = disease.trim();
          if (disease === "" || disease === " " || disease === "  " || disease === "NA" || disease === "N/A" || diseases.includes(disease)) {
          } else {
            diseases.push(disease);
          }
        }
      }

      // gene-disease connection count
      for (const disease of diseases) {
        geneDiseases.set(disease, 0);
      }

      for (const disease of diseases) {
        let diseaseAmount = 0;
        const references: AssocReference[] = [];
        for (const resultGene of resultDiseases) {
          // filter for dirty data
          for (let disease2 of resultGene.diseases.split(",")) {
            disease2 = disease2.trim();
            if (disease2 === disease) {
              diseaseAmount = diseaseAmount + 1;
              references.push(resultGene);
            }
          }
        }
        if (diseaseAmount !== 0){
          references.sort((a, b) => a.evidence_level < b.evidence_level ? -1 : a.evidence_level > b.evidence_level ? 1 : 0);
          assocDiseases.push(new AssocDisease(
            variant.hgvsID,
            gene,
            disease,
            diseaseAmount,
            references
          ));
        }

      }
      return assocDiseases;

    };

    // Requirements before constructing queries.
    return this.http
      .get(this.queryEndpoint + variant.hgvsID.replace(":", "%5C%3A").replace(">", "%3E"))
      .mergeMap(result2 => {
        console.log("Got assoc query result2:", result2);
        const resultReferences = jsontoReferences(result2);

        const gene: string = variant.origin.hugoSymbol;
        console.log("gene name", gene);
        const drugs: string[] = [];
        const diseases: string[] = [];

        console.log("resultReferences", resultReferences);
        // get drug set (all the genes)
        /*
        for (const result of resultReferences) {
          for (let drug of result.drugs.split(",")) {
            drug = drug.trim();
            if (drug === "" || drug === " " || drug === "  " || drug === "NA" || drug === "N/A" || drugs.includes(drug)) {
            } else {
              drugs.push(drug);
            }
          }
        }
        */
        // get disease set (all the genes)
        /*
        for (const result of resultReferences) {
          for (let disease of result.diseases.split(",")) {

            disease = disease.trim();
            if (disease === "NA" || diseases.includes(disease) && disease !== "NA") {
            } else {
              diseases.push(disease);
            }
          }
        }
         */

        // filter for gene searched to faster the page load
        const resultGenes: AssocReference[] = [];
        for (const result of resultReferences) {
          for (const gene2 of result.genes) {
            if (gene2 === gene) {
              resultGenes.push(result);
            }
          }
        }

        const assocDrugs: AssocDrug[] = getAssocDrugs(resultGenes);
        const assocDiseases: AssocDisease[] = getAssocDiseases(resultGenes);


        // construct Assoc object
        const assoc: Assoc = new Assoc(
          variant.hgvsID,
          gene,
          drugs,
          diseases,
          assocDrugs,
          assocDiseases,
          resultReferences
        );
        return Observable.of(assoc);
      });

  }
}
