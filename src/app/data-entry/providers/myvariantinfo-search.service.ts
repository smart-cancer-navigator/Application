/**
 * MyVariant.info compiles variant database information from across the web and provides in an easy-to-query
 * online API.
 */
import { IDatabase } from './database-services.interface';
import { Observable } from 'rxjs/Observable';
import { Gene, Variant } from '../../global/genomic-data';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';

/**
 * Since the myvariant.info response JSON is MASSIVE and depends to a large extent on the query, these locations
 * map the keys of the JSON where values may be stored.
 */
const MY_VARIANT_LOCATIONS = {
  'GeneHUGO': [
    'civic.entrez_name',
    'cadd.gene.genename',
    'cgi.gene',
    'docm.default_gene_name',
    'docm.gene_name',
    'snpeff.genename',
    'snpeff.gene_id',
    'clinvar.gene.symbol'
  ],
  'VariantName': [
    'civic.name',
    'dbnsfp.mutationtaster.AAE',
    'dbnsfp.mutpred.aa_change'/*,

    'cgi.protein_change (of format BRAF:p.V600E)',
    'docm.aa_change (p. V600E)',
    'emv.egl_protein (p.Val600Glu | p.V600E)'
    */
  ],
  'EntrezID': [
    'civic.entrez_id',
    'clinvar.gene.id'
  ],
  'Drug': [
    'cgi.drug',
    'civic.drugs.name'
  ],
  'Description': [
    'civic.description'
  ],
  'Somatic': [
    'civic.evidence_items.variant_origin'
  ],
  'ChromosomePos': [
    'chrom'
  ],
  'StartPos': [
    'vcf.position',
    'hg19.start'
  ],
  'EndPos': [
    'vcf.position',
    'hg19.end'
  ],
  'VariantTypes': [
    'civic.variant_types'
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
  constructor(private http: Http) {
    const constructCommaConcatenation = (stringArray: string[]): string => {
      let commaString = stringArray[0];
      for (const toInclude of stringArray) {
        commaString = commaString + ',' + toInclude;
      }
      return commaString;
    };

    this.includeString = constructCommaConcatenation(MY_VARIANT_LOCATIONS.GeneHUGO) + ',' + constructCommaConcatenation(MY_VARIANT_LOCATIONS.VariantName) + ',' + constructCommaConcatenation(MY_VARIANT_LOCATIONS.EntrezID);
  }

  // Create these in the constructor so that we don't constantly re-create them.
  includeString: string = '';

  queryEndpoint = 'http://myvariant.info/v1/query?q=';

  currentKeywords: VariantSearchKeyword[] = [];

  /**
   * Utility method to query in accordance with myvariant.info API.
   * @param {string[]} stringArray
   * @param {string} desiredVal
   * @returns {string}
   */
  public constructORConcatenation(stringArray: string[], desiredVal: string): string {
    let currentString = stringArray[0] + ':' + desiredVal + '*';
    for (let i = 1; i < stringArray.length; i++) {
      currentString = currentString + '%20OR%20' + stringArray[i] + ':' + desiredVal + '*';
    }
    return currentString;
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
    // Get new keywords.
    const newKeywords: string[] = searchTerm.split(' ');

    // Prune out keywords which are less than 3 characters.
    for (let i = 0; i < newKeywords.length; i++) {
      if (newKeywords[i].length < 3) {
        newKeywords.splice(i, 1);
      }
    }

    /**
     * Figure out conflicts.  This is done by looking through the keyword array for each keyword object.
     * If it is found, then the item is removed from the new keywords array.  Otherwise, the keyword is
     * removed from the current keywords array.
     */
    const managePotentialConflict = (potentialConflict: VariantSearchKeyword) => {
      // Figure out conflicting keywords.
      for (const newKeyword of newKeywords) {
        if (newKeyword === potentialConflict.keyword) {
          // Remove the potential conflict and its corresponding keyword.
          newKeywords.splice(newKeywords.indexOf(potentialConflict.keyword), 1);
          return;
        }
      }

      // It must've not been found if we reach here.
      this.currentKeywords.splice(this.currentKeywords.indexOf(potentialConflict), 1);
      console.log(potentialConflict.keyword + ' is a conflict.');
    };
    for (const potentialConflict of this.currentKeywords) {
      // Wrapped in a method so that we can return if need be.
      managePotentialConflict(potentialConflict);
    }

    // Gets populated, forked, and then mapped.
    const checkObservables: Observable <void>[] = [];

    // Now the array only has the conflict keywords.
    for (const newKeyword of newKeywords) {
      // Since all checks follow same format.
      const determineLikelihoodBasedOnQuery = (queryString: string): Observable <number> => {
        console.log('Querying ' + queryString);
        return this.http.get(queryString)
          .map(result => {
            console.log('Got as response', result.json());
            return result.json().hits.length;
          });
      };

      const quickQuerySuffix = '&fields=_id&size=15';

      // Query for relative likelihoods.
      const checkQueries: Observable<number>[] = [];
      if (!isNaN(Number(newKeyword))) {
        checkQueries.push(Observable.of(-6)); // Reserved value to indicate to the observable that this is an entrez ID.
      } else if (newKeyword.indexOf('chr') >= 0) {
        checkQueries.push(Observable.of(-5)); // Reserved value to indicate HGVS ID.
      } else {
        // Gene HUGO Query.
        checkQueries.push(determineLikelihoodBasedOnQuery(this.queryEndpoint + this.constructORConcatenation(MY_VARIANT_LOCATIONS.GeneHUGO, newKeyword) + quickQuerySuffix));
        // Variant Name Query
        checkQueries.push(determineLikelihoodBasedOnQuery(this.queryEndpoint + this.constructORConcatenation(MY_VARIANT_LOCATIONS.VariantName, newKeyword) + quickQuerySuffix));
      }

      // Create large observable fork.
      checkObservables.push(
        Observable.forkJoin(checkQueries)
          .map((results: number[]) => {
            console.log('Results were ', results);

            // Figure out purpose of keyword.
            const largestValue = Math.max.apply( Math, results );
            let purpose: KeywordPurpose;
            switch (largestValue) {
              case -6:
                purpose = KeywordPurpose.ENTREZ_ID;
                break;
              case -5:
                purpose = KeywordPurpose.HGVS_ID;
                break;
              case results[0]:
                purpose = KeywordPurpose.Gene_HUGO_Symbol;
                break;
              case results[1]:
                purpose = KeywordPurpose.Variant_Name;
                break;
            }

            this.currentKeywords.push(new VariantSearchKeyword(newKeyword, purpose));
          }));
    }

    // Map the keywords (has to be done this way based on how Observables work).
    return Observable.forkJoin(checkObservables)
      .map((results: void[]) => {
        console.log('Current keywords are ', this.currentKeywords);
        return this.currentKeywords;
      })
      // Merge map so that we wait for the forked observable to complete.
      .mergeMap(keywords => {
        // Apply keywords to query.
        let finalQuery = this.queryEndpoint;
        let arrayToUse: string[];
        for (let i = 0; i < keywords.length; i++) {
          switch (keywords[i].purpose) {
            case KeywordPurpose.Gene_HUGO_Symbol:
              arrayToUse = MY_VARIANT_LOCATIONS.GeneHUGO;
              break;
            case KeywordPurpose.Variant_Name:
              arrayToUse = MY_VARIANT_LOCATIONS.VariantName;
              break;
            case KeywordPurpose.HGVS_ID:
              arrayToUse = ['_id'];
              break;
            case KeywordPurpose.ENTREZ_ID:
              arrayToUse = MY_VARIANT_LOCATIONS.EntrezID;
          }

          finalQuery = finalQuery + this.constructORConcatenation(arrayToUse, keywords[i].keyword);

          // Add 'AND' requirement
          if (i < keywords.length - 1) {
            finalQuery = finalQuery + '%20AND%20';
          }
        }

        // Add suffix.
        finalQuery = finalQuery + '&fields=' + this.includeString + '&size=15';

        console.log('To get variants, querying ' + finalQuery);

        return this.http.get(finalQuery)
          .map(result => {
            const mappedJSON = result.json();

            const variantResults: Variant[] = [];

            if (!mappedJSON.hits) {
              return variantResults;
            }

            console.log('Got Result JSON from myvariant', mappedJSON);

            // Used to check whether a given property exists in the mapped JSON.
            const verifyKeyValue = (jsonToSearch: any, header: string): any => {
              let obj = jsonToSearch;
              for (const subHeader of header.split('.')) {
                if (obj instanceof Array) {
                  if (obj.length > 0) {
                    obj = obj[0];
                  } else {
                    return null;
                  }
                }

                if (!obj.hasOwnProperty(subHeader)) {
                  return null;
                }

                obj = obj[subHeader];
              }
              return obj;
            };
            const findValue = (jsonToSearch: any, potentialHeaders: string[]): any => {
              for (const potentialHeader of potentialHeaders) {
                const potentialValue = verifyKeyValue(jsonToSearch, potentialHeader);
                if (potentialValue !== null) {
                  return potentialValue;
                }
              }
              return '';
            };

            // For every result.
            for (const hit of mappedJSON.hits) {
              // Gene construction.
              const geneHUGO: string = findValue(hit, MY_VARIANT_LOCATIONS.GeneHUGO);
              const geneEntrez: number = Number(findValue(hit, MY_VARIANT_LOCATIONS.EntrezID));
              const variantGene = new Gene(geneHUGO, '', 1, geneEntrez);

              // Variant construction
              const variantName: string = findValue(hit, MY_VARIANT_LOCATIONS.VariantName);
              const variantDescription: string = findValue(hit, MY_VARIANT_LOCATIONS.Description);
              const somatic: boolean = findValue(hit, MY_VARIANT_LOCATIONS.Somatic).toLowerCase().indexOf('somatic') >= 0;
              const chromPos: number = Number(findValue(hit, MY_VARIANT_LOCATIONS.ChromosomePos));
              const startPos: number = Number(findValue(hit, MY_VARIANT_LOCATIONS.StartPos));
              const endPos: number = Number(findValue(hit, MY_VARIANT_LOCATIONS.EndPos));
              const types: string[] = findValue(hit, MY_VARIANT_LOCATIONS.VariantTypes);

              // Construct variant.
              variantResults.push(new Variant(variantGene, variantName, hit._id, hit._score, variantDescription, somatic, types, chromPos, startPos, endPos));
            }

            return variantResults;
          });
      });
  }
}
