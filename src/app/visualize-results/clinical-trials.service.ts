/**
 * The clinical trials API provides a method through which one can glean data obtained via clinicaltrials.gov.
 * Note that the API is available at clinicaltrialsapi.cancer.gov instead.
 */
import { Variant } from '../global/genomic-data';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

/**
 * Based on the Angular and RxJS documentation, this is the best way to deal with sequential HTTP requests (those
 * that have results which vary based on the results to prior queries).
 */
import 'rxjs/add/operator/mergeMap';

/**
 * A reference to a given clinical trial, which carries an ID property used to obtain more information about it.
 */
export class ClinicalTrialReference {
  nci_id: string;
  brief_title: string;
  principal_investigator: string;

  constructor(_nci_id: string, _brief_title: string, _principal_investigator: string) {
    this.nci_id = _nci_id;
    this.brief_title = _brief_title;
    this.principal_investigator = _principal_investigator;
  }
}

/**
 * The extension of a clinical trial reference which provides access to more data about a given trial.
 */
export class ClinicalTrial extends ClinicalTrialReference {
  official_title: string;
  brief_summary: string;

  constructor (clinicalTrialReference: ClinicalTrialReference, _official_title: string, _brief_summary: string) {
    super(clinicalTrialReference.nci_id, clinicalTrialReference.brief_title, clinicalTrialReference.principal_investigator);

    this.official_title = _official_title;
    this.brief_summary = _brief_summary;
  }
}

/**
 * Both searches for and provides data for different clinical trials.
 */
@Injectable()
export class ClinicalTrialsSearchService {
  constructor (public http: Http) {}

  /**
   * What I'm trying to do for this method is obtain some examples of clinical trials being carried out on the
   * variants (also gene, but preferably variants) that the user filled out.  We get a max of 10 clinical trials
   * for each gene/variant combo.  The priority trials go to the variant (we query based on name, then HGVS ID),
   * and then finally we query for trials that involved this gene if that doesn't work out.
   */
  searchClinicalTrials = (variant: Variant): Observable<ClinicalTrialReference[]> => {

    // Gets a list of clinical trial references from the single JSON object.
    const clinicalTrialJSONtoReferences = (jsonObject: any): ClinicalTrialReference[] => {
      const references: ClinicalTrialReference[] = [];
      for (const trial of jsonObject.trials) {
        references.push(new ClinicalTrialReference(trial.nci_id, trial.brief_title, trial.principal_investigator));
      }

      return references;
    }

    const desiredTrials: number = 10;

    // 1. Query for variant name in the clinical trials database.
    const variantNameQuery: string = 'https://clinicaltrialsapi.cancer.gov/v1/clinical-trials?size=' + desiredTrials + '&_fulltext=' + variant.variant_name + '&include=brief_title&include=nci_id&include=principal_investigator';
    return this.http
      .get(variantNameQuery)
      .mergeMap(result1 => {
        console.log('1. Got name query', result1);

        const result1References = clinicalTrialJSONtoReferences(result1.json());

        // If we don't have the max number of trials already.
        if (result1References.length < desiredTrials) {

          // 2. Query for the variant HGVS ID in the clinical trials database.
          const hgvsQuery = 'https://clinicaltrialsapi.cancer.gov/v1/clinical-trials?size=' + (desiredTrials - result1References.length) + '&_fulltext=' + variant.hgvs_id + '&include=brief_title&include=nci_id&include=principal_investigator';
          return this.http
            .get(hgvsQuery)
            .map(result2 => {
              console.log('2. Got HGVS query', result2);

              const referenceArray2: ClinicalTrialReference[] = result1References;

              // For every HGVS clinical trial reference.
              for (const result2Reference of clinicalTrialJSONtoReferences(result2.json())) {
                let existsInArray = false;

                for (const currentReference of referenceArray2) {
                  if (result2Reference.brief_title === currentReference.brief_title) {
                    existsInArray = true;
                    break; // This reference must already be part of the array.
                  }
                }

                // Add it to the array if it doesn't already exist.
                if (!existsInArray) {
                  referenceArray2.push(result2Reference);
                }
              }

              return referenceArray2;
            });
        } else {
          console.log('Returning result 1 references since long enough');
          return Observable.of(result1References);
        }
      })
      .mergeMap(result2References => {
        if (result2References.length < desiredTrials) {

          // 2. Query for the variant HGVS ID in the clinical trials database.
          const hugoQuery: string = 'https://clinicaltrialsapi.cancer.gov/v1/clinical-trials?size=' + (desiredTrials - result2References.length) + '&_fulltext=' + variant.origin.hugo_symbol + '&include=brief_title&include=nci_id&include=principal_investigator';
          return this.http
            .get(hugoQuery)
            .map(result3 => {
              console.log('3. Got HUGO query', result3);

              const referenceArray3: ClinicalTrialReference[] = result2References;
              const result3References = clinicalTrialJSONtoReferences(result3.json());

              // For every HGVS clinical trial reference.
              for (const result3Reference of result3References) {
                let existsInArray = false;

                for (const currentReference of referenceArray3) {
                  if (result3Reference.brief_title === currentReference.brief_title) {
                    existsInArray = true;
                    break; // This reference must already be part of the array.
                  }
                }

                // Add it to the array if it doesn't already exist.
                if (!existsInArray) {
                  referenceArray3.push(result3Reference);
                }
              }

              return referenceArray3;
            });
        } else {
          console.log('Returning result 2 references since long enough');
          return Observable.of(result2References);
        }
      });
  }

  getDetailsFor = (clinicalTrialReference: ClinicalTrialReference): Observable<ClinicalTrial> => {
    return this.http.get('https://clinicaltrialsapi.cancer.gov/v1/clinical-trials?size=1&include=official_title&include=brief_summary&nci_id=' + clinicalTrialReference.nci_id)
      .map(response => {
        const fullTrialData = response.json();

        return new ClinicalTrial(clinicalTrialReference, fullTrialData.trials[0].official_title, fullTrialData.trials[0].brief_summary);
      });
  }
}
