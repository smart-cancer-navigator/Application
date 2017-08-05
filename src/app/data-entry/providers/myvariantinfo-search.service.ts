/**
 * MyVariant.info compiles variant database information from across the web and provides in an easy-to-query
 * online API.
 */
import { IDatabase } from './database-services.interface';
import { Observable } from 'rxjs/Observable';
import { Gene, Variant } from '../../global/genomic-data';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

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
    // Special cases in which results cannot be filtered.
    if (searchTerm.length < 3) {
      console.log('Search term is not long enough!  Returning empty Variant array');
      return Observable.of<Variant[]>([]); // Return empty observable array.
    }

    // Get new keywords.
    const newKeywords: string[] = searchTerm.split(' ');

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
          console.log(potentialConflict.keyword + ' is not a conflict.');
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
      };

      const quickQuerySuffix = '&fields=_id&size=15';

      // Determine gene HUGO likelihood.
      const geneHUGOQuery = this.queryEndpoint + this.constructORConcatenation(MY_VARIANT_LOCATIONS.GeneHUGO, newKeyword) + quickQuerySuffix;

      // Determine variant name likelihood.
      const variantNameQuery = this.queryEndpoint + this.constructORConcatenation(MY_VARIANT_LOCATIONS.VariantName, newKeyword) + quickQuerySuffix;

      // Determine HGVS ID likelihood.
      const hgvsIDQuery = this.queryEndpoint + this.constructORConcatenation(['_id'], newKeyword) + quickQuerySuffix;

      // Create large observable fork.
      checkObservables.push(
        Observable.forkJoin([determineLikelihoodBasedOnQuery(geneHUGOQuery), determineLikelihoodBasedOnQuery(variantNameQuery), determineLikelihoodBasedOnQuery(hgvsIDQuery)])
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
