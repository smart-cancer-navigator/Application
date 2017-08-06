/**
 * MyVariant.info compiles variant database information from across the web and provides in an easy-to-query
 * online API.
 */
import { IDatabase } from '../data-entry.service';
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
    'dbnsfp.mutationtaster.AAE[0]',
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
    'cgi[].drug',
    'civic.evidence_items[].drugs[].name'
  ],
  'Disease': [
    'civic.evidence_items'
  ],
  'Description': [
    'civic.description'
  ],
  'Somatic': [
    'civic.evidence_items[0].variant_origin'
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
    'civic.variant_types.display_name',
    'civic.variant_types[].display_name'
  ]
};

// Can't be declared inside class for some reason.
const enum KeywordPurpose {
  Gene_HUGO_Symbol,
  Variant_Name,
  HGVS_ID,
  ENTREZ_ID
}

// Stores the keyword string and the purpose enum.
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
    // Scrub the locations of all bracket indicators.
    for (const key of Object.keys(MY_VARIANT_LOCATIONS)) {
      const compilation: string[] = [];
      for (let i = 0; i < MY_VARIANT_LOCATIONS[key].length; i++) {
        const currentFocus = MY_VARIANT_LOCATIONS[key][i];
        if (currentFocus.indexOf('[') >= 0) {

          // REGULAR EXPRESSIONS AHHHHH (test here: http://regexr.com/)
          const scrubbedString = currentFocus.replace(/[\[\]]+/g, '');

          console.log('Scrubbed ' + currentFocus + ' to ' + scrubbedString);
          compilation.push(scrubbedString);
        } else {
          compilation.push(currentFocus);
        }
      }
      this.scrubbedLocations[key] = compilation;
    }

    // Add all values of the MY_VARIANT_LOCATIONS array to the include string.
    let currentString: string = '';
    for (const key of Object.keys(this.scrubbedLocations)) {
      for (const location of this.scrubbedLocations[key]) {
        currentString = currentString + location + ',';
      }
    }
    // Remove the final comma.
    this.includeString = currentString.substring(0, currentString.length - 1);
  }

  // Create these in the constructor so that we don't constantly re-create them.
  includeString: string = '';
  scrubbedLocations: any = {};
  queryEndpoint: string = 'http://myvariant.info/v1/query?q=';
  currentKeywords: VariantSearchKeyword[] = [];
  lastSuggestionSet: Observable<Variant[]> = Observable.of<Variant[]>([]);

  /**
   * Allows users to pass the string 'civic.evidence_items[0].display_name' and this method to interpret it.
   *
   * If the user passes civic.evidence_items[].display_name, they want a string array of all display_names.
   * If the user passes civic.evidence_items[0].display_name, they want a single string.
   *
   * @param jsonToSearch   The JSON to parse through.
   * @param {string} path   The path to search for.
   * @returns {string | Array<string>}  The array or string to return.  
   */
  private navigateToPath(inJSON: any, path: string): any {
    let current = inJSON;
    for (const key of path.split('.')) {
      if (current instanceof Array) {
        return null;
      }
      if (!current.hasOwnProperty(key)) {
        return null;
      }
      current = current[key];
    }
    return current;
  }
  private parseLocationPath(jsonToSearch: any, path: string): string | string[] {
    // Figure out whether the user added any [] in.
    if (path.indexOf('[') >= 0 && path.indexOf(']') >= 0) {
      // Figure out the array stuff.
      const prePath = path.substring(0, path.indexOf('['));
      // Navigate to prePath.
      const current = this.navigateToPath(jsonToSearch, prePath);

      if (!(current instanceof Array)) {
        return null;
      }

      // Post path.
      let index = Number(path[path.indexOf('[') + 1]);
      if (isNaN(index)) {
        index = -1;
      }
      const postPath = path.substring(path.indexOf(']') + 2);

      // User wrote civic.evidence_items[] not [0]
      if (index === -1) { // Will return array
        let compilation: string[] = [];
        for (const subJSON of current) {
          // Recursive call (in case more [] are included)
          const subJSONValue = this.parseLocationPath(subJSON, postPath);
          if (subJSONValue === null) {
            return null;
          }

          if (subJSONValue instanceof Array) {
            for (const subJSONArrayValue of subJSONValue) {
              compilation.push(subJSONArrayValue);
            }
          } else {
            compilation.push(subJSONValue);
          }
        }
        compilation = compilation.filter(function (filterItem) {
          return filterItem !== null && filterItem !== '';
        });
        return compilation;
      } else {
        return this.parseLocationPath(current[index], postPath);
      }
    } else {
      return this.navigateToPath(jsonToSearch, path);
    }
  }

  /**
   * Utility method to query in accordance with myvariant.info API.
   * @param {string[]} stringArray
   * @param {string} desiredVal
   * @returns {string}
   */
  public constructORConcatenation(stringArray: string[], desiredVal: string): string {
    desiredVal = encodeURIComponent(desiredVal);
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

    if (newKeywords.length === 0) {
      console.log('Returning last suggestion set', this.lastSuggestionSet);
      return this.lastSuggestionSet;
    }

    // Gets populated, forked, and then mapped.
    const checkObservables: Observable <void>[] = [];

    // Now the array only has the conflict keywords, so we can classify the purposes of the other keywords.
    for (const newKeyword of newKeywords) {
      // Since all checks follow same format.
      const determineLikelihoodBasedOnQuery = (queryString: string): Observable <number> => {
        console.log('Querying ' + queryString);
        return this.http.get(queryString)
          .map(result => {
            return result.json().hits.length;
          });
      };

      const quickQuerySuffix = '&fields=_id&size=15';

      // Don't create duplicate purposes.
      const purposeAlreadyExists = (purpose: KeywordPurpose): boolean => {
        for (const keyword of this.currentKeywords) {
          if (keyword.purpose === purpose) {
            return true;
          }
        }
        return false;
      };

      // Query for relative likelihoods.
      if (!isNaN(Number(newKeyword))) {
        if (!purposeAlreadyExists(KeywordPurpose.ENTREZ_ID)) {
          this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.ENTREZ_ID));
        }
      } else if (newKeyword.indexOf('chr') >= 0) {
        if (!purposeAlreadyExists(KeywordPurpose.HGVS_ID)) {
          this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.HGVS_ID));
        }
      } else {
        const geneHUGOQuery = determineLikelihoodBasedOnQuery(this.queryEndpoint + this.constructORConcatenation(this.scrubbedLocations.GeneHUGO, newKeyword) + quickQuerySuffix);
        const variantNameQuery = determineLikelihoodBasedOnQuery(this.queryEndpoint + this.constructORConcatenation(this.scrubbedLocations.VariantName, newKeyword) + quickQuerySuffix);

        // Create large observable fork.
        checkObservables.push(
          Observable.forkJoin([geneHUGOQuery, variantNameQuery])
            .map((results: number[]) => {
              console.log('Results were ', results);

              // Figure out purpose of keyword.
              if (results[0] > results[1]) {
                if (!purposeAlreadyExists(KeywordPurpose.Gene_HUGO_Symbol)) {
                  this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.Gene_HUGO_Symbol));
                }
              } else if (results[0] < results[1]) {
                if (!purposeAlreadyExists(KeywordPurpose.Variant_Name)) {
                  this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.Variant_Name));
                }
              } else { // Results must be equal.
                if (!purposeAlreadyExists(KeywordPurpose.Gene_HUGO_Symbol)) {
                  this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.Gene_HUGO_Symbol));
                } else if (!purposeAlreadyExists(KeywordPurpose.Variant_Name)) {
                  this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.Variant_Name));
                }
              }
            }));
      }
    }

    const getVariantArrayObservable = (): Observable<Variant[]> => {
      console.log('Creating final observable with keywords', this.currentKeywords);
      // Apply keywords to query.
      let finalQuery = this.queryEndpoint;
      let arrayToUse: string[];
      if (this.currentKeywords.length > 1) {
        finalQuery = finalQuery + '(';
      }
      for (let i = 0; i < this.currentKeywords.length; i++) {
        switch (this.currentKeywords[i].purpose) {
          case KeywordPurpose.Gene_HUGO_Symbol:
            arrayToUse = this.scrubbedLocations.GeneHUGO;
            break;
          case KeywordPurpose.Variant_Name:
            arrayToUse = this.scrubbedLocations.VariantName;
            break;
          case KeywordPurpose.HGVS_ID:
            arrayToUse = ['_id'];
            break;
          case KeywordPurpose.ENTREZ_ID:
            arrayToUse = this.scrubbedLocations.EntrezID;
        }

        finalQuery = finalQuery + this.constructORConcatenation(arrayToUse, this.currentKeywords[i].keyword);

        // Add 'AND' requirement
        if (i < this.currentKeywords.length - 1) {
          finalQuery = finalQuery + ')%20AND%20(';
        }
      }
      if (this.currentKeywords.length > 1) {
        finalQuery = finalQuery + ')';
      }

      // Add suffix.
      finalQuery = finalQuery + '&fields=' + this.includeString + '&size=15';

      console.log('To get variants, querying ' + finalQuery);

      return this.http.get(finalQuery)
        .map(result => {
          const mappedJSON = result.json();

          console.log('Final Query result:', mappedJSON);

          const variantResults: Variant[] = [];

          if (!mappedJSON.hits) {
            return variantResults;
          }

          // Used to check whether a given property exists in the mapped JSON.
          const searchPotentialFields = (jsonToSearch: any, potentialHeaders: string[]): any => {
            for (const potentialHeader of potentialHeaders) {
              const potentialValue = this.parseLocationPath(jsonToSearch, potentialHeader);
              if (potentialValue !== null) {
                return potentialValue;
              }
            }
            return '';
          };

          // For every result.
          for (const hit of mappedJSON.hits) {
            // Gene construction.
            const geneHUGO: string = searchPotentialFields(hit, MY_VARIANT_LOCATIONS.GeneHUGO);
            const geneEntrez: number = Number(searchPotentialFields(hit, MY_VARIANT_LOCATIONS.EntrezID));
            const variantGene = new Gene(geneHUGO, '', 1, geneEntrez);

            // Variant construction
            const variantName: string = searchPotentialFields(hit, MY_VARIANT_LOCATIONS.VariantName);
            const variantDescription: string = searchPotentialFields(hit, MY_VARIANT_LOCATIONS.Description);
            const somatic: boolean = searchPotentialFields(hit, MY_VARIANT_LOCATIONS.Somatic).toLowerCase().indexOf('somatic') >= 0;
            const chromosome: string = searchPotentialFields(hit, MY_VARIANT_LOCATIONS.ChromosomePos); // Can be 'X' or 'Y'
            const startPos: number = Number(searchPotentialFields(hit, MY_VARIANT_LOCATIONS.StartPos));
            const endPos: number = Number(searchPotentialFields(hit, MY_VARIANT_LOCATIONS.EndPos));

            const ensureValidArray = (item: string | string[]): string[] => {
              let items: string[];
              if (!(item instanceof Array)) {
                items = [item];
              } else {
                items = item;
              }
              items = items.filter(function (filterItem) {
                return filterItem !== '';
              });
              return items;
            };
            const drugs: string[] = ensureValidArray(searchPotentialFields(hit, MY_VARIANT_LOCATIONS.Drug));
            const types: string[] = ensureValidArray(searchPotentialFields(hit, MY_VARIANT_LOCATIONS.VariantTypes));

            // Construct variant.
            variantResults.push(new Variant(variantGene, variantName, hit._id, hit._score, variantDescription, somatic, types, drugs, chromosome, startPos, endPos));
          }

          return variantResults;
        });
    };

    if (checkObservables.length > 0) {
      // Map the keywords (has to be done this way based on how Observables work).
      return Observable.forkJoin(checkObservables)
      // Merge map so that we wait for the forked observable to complete.
        .mergeMap((results: void[]) => {
          this.lastSuggestionSet = getVariantArrayObservable();
          return this.lastSuggestionSet;
        });
    } else { // If this is an entrez ID or an HGVS ID based on special circumstances.
      this.lastSuggestionSet = getVariantArrayObservable();
      return this.lastSuggestionSet;
    }
  }
}
