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
    _envContexts: string[],
    _phenotypes: string[],
    _publicationUrls: string,
    _diseases: string,
    _drug: string,
    _response: string,
    _evidence_level: string,
    _evidence_label: string
)
  {
    this.variantName = _variantName;
    this.envContexts = _envContexts;
    this.phenotypes = _phenotypes;
    this.publicationUrls = _publicationUrls.split(",");
    this.diseases = _diseases.split(",");
    this.drug = _drug;
    this.response = _response;
    this.evidence_level = _evidence_level;
    this.evidence_label = _evidence_label;

  }
  variantName: string;
  envContexts: string[];
  phenotypes: string[];
  publicationUrls: string[];
  diseases: string[];
  drug: string;
  response: string;
  evidence_level: string;
  evidence_label: string;

}
