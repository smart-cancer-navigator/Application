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
    _hgvsID: string,
    _variantName: string,
    _description: string,
    _envContexts: string,
    _phenotypes: string,
    _diseases: string,
    _drugs: string,
    _response: string,
    _evidence_level: string,
    _evidence_label: string,
    _features: string,
    _sourceUrls: string,
    _publicationUrls: string,
    _genes: string[],

  )
  {
    this.hgvsID = _hgvsID;
    this.variantName = _variantName;
    this.description = _description;
    this.envContexts = _envContexts;
    this.phenotypes = _phenotypes;
    this.publicationUrls = _publicationUrls.split(",");
    this.sourceUrls = _sourceUrls.split(",");
    this.genes = _genes;

    this.diseases = _diseases;
    this.drugs = _drugs;
    this.response = _response;
    this.evidence_level = _evidence_level;
    this.evidence_label = _evidence_label;
    this.features = _features;

  }
  hgvsID: string;
  variantName: string;
  description: string;
  envContexts: string;
  phenotypes: string;
  genes: string[];
  sourceUrls: string[];
  publicationUrls: string[];
  features: string;
  diseases: string;
  drugs: string;
  response: string;
  evidence_level: string;
  evidence_label: string;
}

export class AssocDrug {

  constructor(

    _hgvsID: string,
    _gene: string,
    _drug: string,
    _assocAmount: number,
    _assocReferences: AssocReference[],
  )
  {
    this.hgvsID = _hgvsID;
    this.drug = _drug;
    this.assocAmount = _assocAmount;
    this.assocReferences = _assocReferences;
  }
  hgvsID: string;
  drug: string;
  assocAmount: number;
  assocReferences: AssocReference[];
}

export class AssocDisease {

  constructor(

    _hgvsID: string,
    _gene: string,
    _disease: string,
    _assocAmount: number,
    _assocReferences: AssocReference[],
  )
  {
    this.hgvsID = _hgvsID;
    this.disease = _disease;
    this.assocAmount = _assocAmount;
    this.assocReferences = _assocReferences;
  }
  hgvsID: string;
  disease: string;
  assocAmount: number;
  assocReferences: AssocReference[];
}

export class Assoc {

  constructor(
    _hgvsID: string,
    _gene: string,
    _drugs: string[],
    _diseases: string[],
    _assocDrugs: AssocDrug[],
    _assocDiseases: AssocDisease[],

    _assocReferences: AssocReference[]
  )
  {

    this.hgvsID = _hgvsID;
    this.diseases = _diseases;
    this.drugs = _drugs;
    this.gene = _gene;
    this.assocDrugs = _assocDrugs;
    this.assocDiseases = _assocDiseases;
    this.assocReferences = _assocReferences;
  }
  hgvsID: string;
  diseases: string[];
  gene: string;
  drugs: string[];
  assocDrugs: AssocDrug[];
  assocDiseases: AssocDisease[];
  assocReferences: AssocReference[];
}
