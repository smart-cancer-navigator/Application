/**
 * A reference to a given association.
 */

export class AssocReference {
  /**
   <th>Variant Name</th>
   <th>Phenotypes</th>
   <th>Drug Labels</th>
   <th>Publication Url</th>
   <th>Diseases</th>
   <th>Drugs</th>
   <th>Response</th>
   <th>Evidence Level</th>
   */
  constructor(
    _variantName: string,
    _phenotypes: string,
    _publicationUrl: string,
    _diseases: string,
    _drugs: string,
    _response: string,
    _evidence_level: string,
    _evidence_label: string
)
  {
    this.variantName = _variantName;
    this.phenotypes = _phenotypes;
    this.publicationUrl = _publicationUrl;
    this.diseases = _diseases;
    this.drugs = _drugs;
    this.response = _response;
    this.evidence_level = _evidence_level;
    this.evidence_label = _evidence_label;

  }
  variantName: string;
  phenotypes: string;
  publicationUrl: string;
  diseases: string;
  drugs: string;
  response: string;
  evidence_level: string;
  evidence_label: string;

}
