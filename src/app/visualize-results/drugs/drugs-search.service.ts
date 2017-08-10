/**
 * This service, like the data entry service, queries for and merges duplicate drugs for given genes.
 */

import {Drug, DrugReference} from "./drug";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Gene} from "../../global/genomic-data";

@Injectable()
export class DrugsSearchService {
  constructor (private http: Http) {}

  public searchByReference(reference: DrugReference): Observable <Drug> {
    return this.http.get("http://dgidb.genome.wustl.edu/api/v1/interactions.json?drugs=" + (reference.name.indexOf(" ") >= 0 ? reference.name.substring(0, reference.name.indexOf(" ")) : reference.name))
      .map(result => {
        const resultJSON = result.json();

        const newDrug = new Drug(reference.name);

        if (!(resultJSON.matchedTerms && resultJSON.matchedTerms.length >= 0)) {
          return;
        }

        newDrug.geneTargets = [];
        const geneAlreadyPresentInTargets = (gene: Gene): boolean => {
          for (const geneTarget of newDrug.geneTargets) {
            if (geneTarget.hugo_symbol === gene.hugo_symbol) {
              return true;
            }
          }
          return false;
        };
        for (const interaction of resultJSON.matchedTerms[0].interactions) {
          const newGene = new Gene(interaction.geneName);
          if (!geneAlreadyPresentInTargets(newGene)) {
            newDrug.geneTargets.push(newGene);
          }
        }

        return newDrug;
      });
  }
}
