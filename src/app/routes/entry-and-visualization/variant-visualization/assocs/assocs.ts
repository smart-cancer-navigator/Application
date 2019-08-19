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
    _envContexts: string,
    _phenotypes: string,
    _diseases: string,
    _drugs: string,
    _response: string,
    _evidence_level: string,
    _evidence_label: string,
    _features: string,
    _publicationUrls: string,
    _genes: string[],

  )
  {
    this.variantName = _variantName;
    this.envContexts = _envContexts;
    this.phenotypes = _phenotypes;
    this.publicationUrls = _publicationUrls.split(",");
    this.genes = _genes;

    this.diseases = _diseases;
    this.drugs = _drugs;
    this.response = _response;
    this.evidence_level = _evidence_level;
    this.evidence_label = _evidence_label;
    this.features = _features;

  }

  variantName: string;
  envContexts: string;
  phenotypes: string;
  genes: string[];
  publicationUrls: string[];
  features: string;
  diseases: string;
  drugs: string;
  response: string;
  evidence_level: string;
  evidence_label: string;
}

export class AssocRelation {

  constructor(
    _gene: string,
    _drugs: string[],
    _diseases: string[],
    _geneDrugs: number[],
    _geneDiseases: number[],
  )
  {
    this.diseases = _diseases;
    this.drugs = _drugs;
    this.gene = _gene;
    this.geneDiseases = _geneDiseases;
    this.geneDrugs = _geneDrugs;
  }

  diseases: string[];
  gene: string;
  drugs: string[];
  geneDrugs: number[];
  geneDiseases: number[];
}

export class Assocs{
  constructor(
    _genes: string[],
    _drugs: string[],
    _diseases: string[],
    _assocReference: AssocReference[],
    _assocRelations: AssocRelation[]
  )
  {
    this.diseases = _diseases;
    this.drugs = _drugs;
    this.genes = _genes;
    this.assocReference = _assocReference;
    this.assocRelations = _assocRelations;

  }
  diseases: string[];
  genes: string[];
  drugs: string[];
  assocReference: AssocReference[];
  assocRelations: AssocRelation[];

}
