/**
 * One of the primary things that clinicians will need to see are the drugs which are most likely to be effective
 * against different genes and variants.
 */

import { Gene } from "../../global/genomic-data";
import {IMergeable, MergeProperties} from "../../global/data-merging";

export class Drug implements IMergeable {
  constructor (_name: string) {
    this.name = _name;
  }

  name: string;
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
}

