/**
 * The clinical trials API provides a method through which one can glean data obtained via clinicaltrials.gov.
 * Note that the API is available at clinicaltrialsapi.cancer.gov instead.
 */
import { Gene, Variant } from '../global/genomic-data';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

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

export class ClinicalTrial extends ClinicalTrialReference {
  official_title: string;
  brief_summary: string;

  constructor (clinicalTrialReference: ClinicalTrialReference, _official_title: string, _brief_summary: string) {
    super(clinicalTrialReference.nci_id, clinicalTrialReference.brief_title, clinicalTrialReference.principal_investigator);

    this.official_title = _official_title;
    this.brief_summary = _brief_summary;
  }
}

@Injectable()
export class ClinicalTrialsSearchService {
  constructor (public http: Http) {}

  searchClinicalTrials = (variant: Variant): Observable<ClinicalTrialReference[]> => {
    console.log('Called!');

    return this.http.get('https://clinicaltrialsapi.cancer.gov/v1/clinical-trials?size=5&_fulltext=' + variant.variant_name + '&include=brief_title&include=nci_id&include=principal_investigator')
      .map(result => {
        console.log('Got', result);
        return result.json();
      })
      .map(resultJSON => {
        console.log('Clinical Trial JSON', resultJSON);

        // Create all clinical trial references.
        const references: ClinicalTrialReference[] = [];
        for (const trial of resultJSON.trials) {
          references.push(new ClinicalTrialReference(trial.nci_id, trial.brief_title, trial.principal_investigator));
        }

        console.log('Got ', references);

        return references;
      });
  }

  obtainClinicalTrial = (clinicalTrialReference: ClinicalTrialReference): ClinicalTrial => {
    return null;
  }
}
