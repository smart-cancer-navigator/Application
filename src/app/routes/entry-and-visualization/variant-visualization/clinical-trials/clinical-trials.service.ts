/**
 * The clinical trials API provides a method through which one can glean data obtained via clinicaltrials.gov.
 * Note that the API is available at clinicaltrialsapi.cancer.gov instead.
 */
import { Variant } from "../../genomic-data";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ClinicalTrialReference, ClinicalTrial } from "./clinical-trials";
import { Drug, DrugReference } from "../drugs/drug";

/**
 * Based on the Angular and RxJS documentation, this is the best way to deal with sequential HTTP requests (those
 * that have results which vary based on the results to prior queries).
 */
import "rxjs/add/operator/mergeMap";

/**
 * Both searches for and provides data for different clinical trials.
 */
@Injectable()
export class ClinicalTrialsService {
  constructor (public http: HttpClient) {}

  // Reduces typing involved :P
  queryEndpoint = "https://clinicaltrialsapi.cancer.gov/v1/clinical-trials?";

  /**
   * What I"m trying to do for this method is obtain some examples of clinical trials being carried out on the
   * variants (also gene, but preferably variants) that the user filled out.  We get a max of 10 clinical trials
   * for each gene/variant combo.  The priority trials go to the variant (we query based on name, then HGVS ID),
   * and then finally we query for trials that involved this gene if that doesn"t work out.
   */
  searchClinicalTrials = (variant: Variant): Observable<ClinicalTrialReference[]> => {

    // Gets a list of clinical trial references from the single JSON object.
    const clinicalTrialJSONtoReferences = (jsonObject: Object): ClinicalTrialReference[] => {
      const references: ClinicalTrialReference[] = [];
      for (const trial of jsonObject["trials"]) {
        const drugsArray: DrugReference[] = [];
        for (const intervention of trial.arms[0].interventions) {
          if (intervention.intervention_type === "Drug") {
            const newDrug = new DrugReference(intervention.intervention_name);
            drugsArray.push(newDrug);
          }
        }
        references.push(new ClinicalTrialReference(trial.nci_id, trial.phase.phase, trial.brief_title, drugsArray, trial.principal_investigator));
      }

      return references;
    };

    // Requirements before constructing queries.
    const desiredTrials: number = 10;
    const includes: string[] = ["brief_title", "nci_id", "principal_investigator", "phase.phase", "arms"];

    // Determine includes.
    let includeString = "";
    for (const include of includes) {
      includeString = includeString + "&include=" + include;
    }

    // 1. Query for variant name in the clinical trials database.
    return this.http
      .get(this.queryEndpoint + "size=" + desiredTrials + "&_fulltext=" + encodeURIComponent(variant.variantName) + includeString)
      .mergeMap(result1 => {
        console.log("1. Got name query results:", result1);

        const result1References = clinicalTrialJSONtoReferences(result1);

        // If we don"t have the max number of trials already.
        if (result1References.length < desiredTrials) {

          // 2. Query for the variant HGVS ID in the clinical trials database.
          return this.http
            .get(this.queryEndpoint + "size=" + (desiredTrials - result1References.length) + "&_fulltext=" + variant.hgvsID + includeString)
            .map(result2 => {
              console.log("2. Got HGVS query results:", result2);

              const referenceArray2: ClinicalTrialReference[] = result1References;

              // For every HGVS clinical trial reference.
              for (const result2Reference of clinicalTrialJSONtoReferences(result2)) {
                let existsInArray = false;

                for (const currentReference of referenceArray2) {
                  if (result2Reference.brief_title === currentReference.brief_title) {
                    existsInArray = true;
                    break; // This reference must already be part of the array.
                  }
                }

                // Add it to the array if it doesn"t already exist.
                if (!existsInArray) {
                  referenceArray2.push(result2Reference);
                }
              }

              return referenceArray2;
            });
        } else {
          console.log("Returning result 1 references since long enough");
          return Observable.of(result1References);
        }
      })
      .mergeMap(result2References => {
        if (result2References.length < desiredTrials) {

          // 2. Query for the variant HGVS ID in the clinical trials database.
          return this.http
            .get(this.queryEndpoint + "size=" + (desiredTrials - result2References.length) + "&_fulltext=" + variant.origin.hugoSymbol + includeString)
            .map(result3 => {
              console.log("3. Got HUGO query results:", result3);

              const referenceArray3: ClinicalTrialReference[] = result2References;
              const result3References = clinicalTrialJSONtoReferences(result3);

              // For every HGVS clinical trial reference.
              for (const result3Reference of result3References) {
                let existsInArray = false;

                for (const currentReference of referenceArray3) {
                  if (result3Reference.brief_title === currentReference.brief_title) {
                    existsInArray = true;
                    break; // This reference must already be part of the array.
                  }
                }

                // Add it to the array if it doesn"t already exist.
                if (!existsInArray) {
                  referenceArray3.push(result3Reference);
                }
              }

              return referenceArray3;
            });
        } else {
          console.log("Returning result 2 references since long enough");
          return Observable.of(result2References);
        }
      });
  }

  getDetailsFor = (clinicalTrialReference: ClinicalTrialReference): Observable<ClinicalTrial> => {
    return this.http.get(this.queryEndpoint + "size=1&include=official_title&include=brief_summary&nci_id=" + clinicalTrialReference.nci_id)
      .map(response => {
        return new ClinicalTrial(clinicalTrialReference, response["trials"][0].official_title, response["trials"][0].brief_summary);
      });
  }
}
