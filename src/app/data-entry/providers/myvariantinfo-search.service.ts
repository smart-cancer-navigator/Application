/**
 * MyVariant.info compiles variant database information from across the web and provides in an easy-to-query
 * online API.
 */
import { IDatabase } from './database-services.interface';
import { Observable } from 'rxjs/Observable';
import { Gene, Variant } from '../../global/genomic-data';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

const MY_VARIANT_LOCATIONS = {
  'GeneLocations': [
    'civic.entrez_name',
    'cadd.gene.genename',
    'cgi.gene',
    'docm.default_gene_name',
    'docm.gene_name',
    'snpeff.genename',
    'snpeff.gene_id',
    'clinvar.gene.symbol'
  ],
  'VariantLocations': [
    'civic.name',
    'dbnsfp.mutationtaster.AAE[0]',
    'dbnsfp.mutpred.aa_change[0]',
    'cgi.protein_change (of format BRAF:p.V600E)',
    'docm.aa_change (p. V600E)',
    'emv.egl_protein (p.Val600Glu | p.V600E)'
  ],
  'EntrezIDLocations': [
    'civic.entrez_id',
    'clinvar.gene.id'
  ],
  'DrugLocations': [
    'cgi.drug',
    'civic.drugs.name'
  ]
};

// Can't be declared inside class for some reason.
const enum KeywordPurpose {
  Gene_HUGO_Symbol,
  Variant_Name,
  HGVS_ID,
  ENTREZ_ID,
  Unknown
}

class VariantSearchKeyword {
  constructor (_keyword: string, _purpose: KeywordPurpose) {
    this.keyword = _keyword;
    this.purpose = _purpose;
  }

  public keyword: string;
  public purpose: KeywordPurpose;
}

@Injectable()
export class MyVariantInfoSearchService implements IDatabase {
  constructor(private http: Http) {}

  currentKeywords: VariantSearchKeyword[] = [];

  public constructORConcatentation(stringArray: string[], desiredVal: string): string {
    let currentString = stringArray[0] + ':' + desiredVal + '*';
    for (let i = 1; i < MY_VARIANT_LOCATIONS.GeneLocations.length; i++) {
      currentString = currentString + '%20OR%20' + currentString[i] + ':' + desiredVal + '*';
    }
    return currentString;
  }

  public dissectSearch = (searchString: string): Observable<VariantSearchKeyword[]> => {
    // Special cases in which results cannot be filtered.
    if (searchString.length < 3) {
      this.currentKeywords = [];
    }

    // Get new keywords.
    const newKeywords: string[] = searchString.split(' ');

    // Figure out conflicts.
    for (const potentialConflict of this.currentKeywords) {
      // Figure out conflicting keywords.
      for (const newKeyword of newKeywords) {
        if (newKeyword === potentialConflict.keyword) {
          // Remove the potential conflict and its corresponding keyword.
          this.currentKeywords.splice(this.currentKeywords.indexOf(potentialConflict), 1);
          newKeywords.splice(newKeywords.indexOf(potentialConflict.keyword), 1);
          break;
        }
      }
    }

    // Gets populated, forked, and then mapped.
    const checkObservables: Observable <void>[] = [];

    // Now the array only has the conflict keywords.
    for (const newKeyword of newKeywords) {
      // Check if this is an entrez ID (shortcut)
      if (!isNaN(Number(newKeyword))) {
        this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.ENTREZ_ID));
        continue; // Next keyword, please!
      }

      // Check if this number is an HGVS ID.
      if (newKeyword.indexOf('chr') >= 0) {
        this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.HGVS_ID));
        continue; // Next keyword, please!
      }

      // Since all checks follow same format.
      const determineLikelihoodBasedOnQuery = (queryString: string): Observable <number> => {
        console.log('Querying ' + queryString);
        return this.http.get(queryString)
          .map(result => {
            console.log('Got ' + result.json() + ' as response');
            return result.json().hits.length;
          });
      }

      // Determine gene HUGO likelihood.
      const geneHUGOQuery = 'http://myvariant.info/v1/query?q=' + this.constructORConcatentation(MY_VARIANT_LOCATIONS.GeneLocations, newKeyword) + '*&fields=_id&size=15';

      // Determine variant name likelihood.
      const variantNameQuery = 'http://myvariant.info/v1/query?q=' + this.constructORConcatentation(MY_VARIANT_LOCATIONS.VariantLocations, newKeyword) + '*&fields=_id&size=15';

      // Determine HGVS ID likelihood.
      const hgvsIDQuery = 'http://myvariant.info/v1/query?q=_id=' + newKeyword + '*&fields=_id&size=15';

      // Create large observable fork.
      checkObservables.push(Observable.forkJoin([determineLikelihoodBasedOnQuery(geneHUGOQuery), determineLikelihoodBasedOnQuery(variantNameQuery), determineLikelihoodBasedOnQuery(hgvsIDQuery)])
        .map((results: number[]) => {
          console.log('Results were ' + results);
          if (results[0] > results[1]) {
            if (results[0] > results[2]) {
              this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.Gene_HUGO_Symbol));
            } else {
              this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.HGVS_ID));
            }
          } else {
            if (results[1] > results[2]) {
              this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.Variant_Name));
            } else {
              this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.HGVS_ID));
            }
          }
        }));
    }

    // Fork the array AGAIN.
    return Observable.forkJoin(checkObservables)
      .map(results => {
        console.log('Current keywords are ', this.currentKeywords);
        return this.currentKeywords;
      });
  }

  /**
   * Works as follows:
   * 1. The keyword is dissected (split by spaces), and then test queries are sent to figure out the likely purpose of each
   * keyword (3 chars required before any predictions made).
   * 2. Based on the likelihood of each of the words made previously, a list of variants are compiled and sent back to the
   * filterable search component, where the user selects one from the list.
   * @param {string} searchTerm
   * @returns {Observable<Variant[]>}
   */
  public search = (searchTerm: string): Observable<Variant[]> => {
    return this.dissectSearch(searchTerm)
      .mergeMap(keywords => {
        // Apply keywords to query.
        let currentQuery = 'http://myvariant.info/v1/query?q=';
        let arrayToUse: string[];
        for (let i = 0; i < keywords.length; i++) {
          switch (keywords[i].purpose) {
            case KeywordPurpose.Gene_HUGO_Symbol:
              arrayToUse = MY_VARIANT_LOCATIONS.GeneLocations;
              break;
            case KeywordPurpose.Variant_Name:
              arrayToUse = MY_VARIANT_LOCATIONS.VariantLocations;
              break;
            case KeywordPurpose.HGVS_ID:
              arrayToUse = ['_id'];
              break;
          }

          currentQuery = currentQuery + this.constructORConcatentation(arrayToUse, keywords[i].keyword);

          // Add 'AND' requirement
          if (i === keywords.length - 1) {
            currentQuery = currentQuery + '%20AND%20';
          }
        }

        // Add suffix.
        currentQuery = currentQuery + '&fields=all&size=15';

        return this.http.get(currentQuery)
          .map(result => {
            console.log('Finally got result JSON', result.json());
            return new Variant();
          });
      })
      .map(result => result.json())
      .map(resultJSON => {
        const variantResults: Variant[] = [];
        if (!resultJSON.hits) {
          return variantResults;
        }

        console.log('Got Result JSON from myvariant', resultJSON);

        // For every result.
        for (const hit of resultJSON.hits) {
          // Add constructed variant to the array.
          variantResults.push(this.parseVariantFromJSONHit(hit));
        }

        return variantResults;
      }));
  }
}
