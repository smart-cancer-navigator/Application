/**
 * A reference to a given clinical trial, which carries an ID property used to obtain more information about it.
 */
import { DrugReference } from "../drugs/drug";

export class ClinicalTrialReference {
  constructor(_nci_id: string, _phase: string, _brief_title: string, _drugs: DrugReference[], _principal_investigator: string) {
    this.nci_id = _nci_id;
    this.phase = _phase;
    this.brief_title = _brief_title;
    this.drugs = _drugs;
    this.principal_investigator = _principal_investigator;
  }

  nci_id: string;
  phase: string;
  brief_title: string;
  drugs: DrugReference[];
  principal_investigator: string;

  drugsToString = (): string => {
    if (!this.drugs || this.drugs.length === 0) {
      return "";
    }

    let drugsString = this.drugs[0].name;
    for (let i = 1; i < this.drugs.length; i++) {
      if (i < this.drugs.length - 1) {
        drugsString = drugsString + ", " + this.drugs[i].name;
      } else {
        drugsString = drugsString + ", and " + this.drugs[i].name;
      }

    }

    return drugsString;
  }
}

/**
 * The extension of a clinical trial reference which provides access to more data about a given trial.
 */
export class ClinicalTrial extends ClinicalTrialReference {
  constructor (clinicalTrialReference: ClinicalTrialReference, _official_title: string, _brief_summary: string) {
    super(clinicalTrialReference.nci_id, clinicalTrialReference.phase, clinicalTrialReference.brief_title, clinicalTrialReference.drugs, clinicalTrialReference.principal_investigator);

    this.official_title = _official_title;
    this.brief_summary = _brief_summary;
  }

  official_title: string;
  brief_summary: string;
}
