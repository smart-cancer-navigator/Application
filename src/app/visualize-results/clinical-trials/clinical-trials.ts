/**
 * A reference to a given clinical trial, which carries an ID property used to obtain more information about it.
 */
export class ClinicalTrialReference {
  nci_id: string;
  phase: string;
  brief_title: string;
  principal_investigator: string;

  constructor(_nci_id: string, _phase: string, _brief_title: string, _principal_investigator: string) {
    this.nci_id = _nci_id;
    this.phase = _phase;
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
    super(clinicalTrialReference.nci_id, clinicalTrialReference.phase, clinicalTrialReference.brief_title, clinicalTrialReference.principal_investigator);

    this.official_title = _official_title;
    this.brief_summary = _brief_summary;
  }
}
