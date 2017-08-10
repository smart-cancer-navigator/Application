/**
 * One of the primary things that clinicians will need to see are the drugs which are most likely to be effective
 * against different genes and variants.
 */

import { Gene } from "../../global/genomic-data";
import {IMergeable, MergeProperties} from "../../global/data-merging";

export class DrugReference {
  constructor (_name: string) {
    this.name = _name;
  }

  name: string;

  brief_name = (): string => {
    return (this.name.indexOf(" ") >= 0 ? this.name.substring(0, this.name.indexOf(" ")) : this.name);
  }
}

export class Drug extends DrugReference implements IMergeable {
  constructor (_name: string) {
    super(_name);
  }

  code: string;
  geneTargets: Gene[];
  description: string;
  source: string;
  aliases: string[];

  mergeable = (other: Drug) => {
    return this.name === other.name;
  }

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  merge = (other: Drug) => {
    this.code = MergeProperties(this.code, other.code);
    this.geneTargets = MergeProperties(this.geneTargets, other.geneTargets);
    this.description = MergeProperties(this.description, other.description);
    this.source = MergeProperties(this.source, other.source);
    this.aliases = MergeProperties(this.aliases, other.aliases);
  }

  geneTargetsString = (): string => {
    let currentString = this.geneTargets[0].hugo_symbol;
    for (let i = 1; i < this.geneTargets.length; i++) {
      currentString = currentString + ", " + this.geneTargets[i].hugo_symbol;
    }
    return currentString;
  }
}

