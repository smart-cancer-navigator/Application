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
    'civic.evidence_items[].disease.display_name'
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
          const scrubbedString = currentFocus.replace(/\[.*?\]/g, '');

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
    desiredVal = desiredVal.replace(/[:]/g, '\\$&');
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
      if (newKeywords[i].length < 1) {
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
      } else if (newKeyword.toLowerCase().indexOf('chr') >= 0 || newKeyword.toLowerCase().indexOf('civic') >= 0) {
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
              console.log('Classification results were ', results);

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

      return this.http.get(finalQuery)
        .map(result => {
          const mappedJSON = result.json();

          console.log('Final Query result from ' + finalQuery, mappedJSON);
          if (!mappedJSON.hits) {
            return [];
          }

          // Used to check whether a given property exists in the mapped JSON.
          const variantResults: Variant[] = [];
          // For every result.
          for (const hit of mappedJSON.hits) {
            // Looks at all paths and merges the data provided in each one to form a single variant.
            const mergePathsData = (potentialHeaders: string[], searchAll: boolean): string[] => {
              let compilation: string[] = [];
              for (const potentialHeader of potentialHeaders) {
                const potentialValue = this.parseLocationPath(hit, potentialHeader);
                if (potentialValue !== null) {
                  if (potentialValue instanceof Array) {
                    for (const subValue of potentialValue) {
                      compilation.push(subValue);
                    }
                  } else {
                    compilation.push(potentialValue);
                  }
                  if (!searchAll) {
                    break;
                  }
                }
              }

              // Don't search for duplicates if there's only one value!
              if (searchAll) {
                // Remove duplicates from array (thanks StackOverflow!)
                compilation = compilation.reduce(function(p, c, i, a){
                  if (p.indexOf(c) === -1) {
                    p.push(c);
                  } else {
                    p.push('');
                  }
                  return p;
                }, []);
                // Remove all empty strings from array.
                compilation = compilation.filter(function (filterItem) {
                  return filterItem !== '';
                });
              }

              if (compilation.length === 0) {
                compilation.push(''); // Empty string so that errors aren't thrown.
              }

              return compilation;
            };

            // Since names, HUGO symbols, and such shouldn't include spaces.
            const ensureValidString = (someString: string): string => {
              return someString.indexOf(' ') >= 0 ? someString.substring(0, someString.indexOf(' ')) : someString;
            };

            // Gene construction.
            const geneHUGO: string = ensureValidString(mergePathsData(MY_VARIANT_LOCATIONS.GeneHUGO, false)[0]);
            const geneEntrez: number = Number(mergePathsData(MY_VARIANT_LOCATIONS.EntrezID, false)[0]);
            const variantGene = new Gene(geneHUGO, '', 1, geneEntrez);
            // Query for gene name.
            this.http.get('http://mygene.info/v3/query?q=symbol:' + variantGene.hugo_symbol + '%20AND%20_id:' + variantGene.entrez_id + '&fields=name,_score&size=1')
              .map(response => {
                const responseJSON = response.json();
                if (!responseJSON.hits || responseJSON.hits.length === 0) {
                  return new Gene(geneHUGO, '', 1, geneEntrez);
                }
                return new Gene(geneHUGO, responseJSON.hits[0].name, responseJSON.hits[0]._score, geneEntrez);
              })
              .subscribe(gene => {
                // Change by property instead of whole object because otherwise changes don't propagate.
                variantGene.name = gene.name;
                variantGene.score = gene.score;
              });

            // Variant construction
            const variantName: string = ensureValidString(mergePathsData(MY_VARIANT_LOCATIONS.VariantName, false)[0]);
            const variantDescription: string = mergePathsData(MY_VARIANT_LOCATIONS.Description, false)[0];
            const somatic: boolean = mergePathsData(MY_VARIANT_LOCATIONS.Somatic, false)[0].toLowerCase().indexOf('somatic') >= 0;
            const chromosome: string = mergePathsData(MY_VARIANT_LOCATIONS.ChromosomePos, false)[0]; // Can be 'X' or 'Y'
            const startPos: number = Number(mergePathsData(MY_VARIANT_LOCATIONS.StartPos, false)[0]);
            const endPos: number = Number(mergePathsData(MY_VARIANT_LOCATIONS.EndPos, false)[0]);
            const drugs: string[] = mergePathsData(MY_VARIANT_LOCATIONS.Drug, true);
            const types: string[] = mergePathsData(MY_VARIANT_LOCATIONS.VariantTypes, true);
            const diseases: string[] = mergePathsData(MY_VARIANT_LOCATIONS.Disease, true);

            // Construct variant.
            variantResults.push(new Variant(variantGene, variantName, hit._id, hit._score, variantDescription, somatic, types, drugs, diseases, chromosome, startPos, endPos));
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
