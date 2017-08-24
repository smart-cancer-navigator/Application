/**
 * One of the primary things that clinicians will need to see are the drugs which are most likely to be effective
 * against different genes and variants.
 */

import { Gene } from "../../genomic-data";
import { IMergeable, MergeProperties } from "../../data-merging";

export class DrugReference {
  constructor (_name: string) {
    this.name = _name;
  }

  name: string;

  brief_name = (): string => {
    return (this.name.indexOf(" ") >= 0 ? this.name.substring(0, this.name.indexOf(" ")) : this.name);
  }
}

export class InteractionType {
  constructor (_name: string, _sources: string[]) {
    this.name = _name;
    this.sources = _sources;
  }
  name: string;
  sources: string[];
}

export class GeneInteraction {
  constructor (_geneTarget: Gene, _sourceClassifications: InteractionType[]) {
    this.geneTarget = _geneTarget;
    this.interactionTypes = _sourceClassifications;
  }
  geneTarget: Gene;
  interactionTypes: InteractionType[];
}

export class Drug extends DrugReference implements IMergeable {
  constructor (_name: string) {
    super(_name);
  }

  description: string;
  interactions: GeneInteraction[];

  mergeable = (other: Drug) => {
    return this.name === other.name;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  merge = (other: Drug) => {
    this.description = MergeProperties(this.description, other.description);
    this.interactions = MergeProperties(this.interactions, other.interactions);
  }
}

