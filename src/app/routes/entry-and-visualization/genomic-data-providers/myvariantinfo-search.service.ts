/**
 * MyVariant.info compiles variant database information from across the web and provides in an easy-to-query
 * online API.
 */
import { Observable } from "rxjs/Observable";
import {Classification, Gene, GeneReference, Variant, VariantReference} from "../genomic-data";
import { DrugReference } from "../variant-visualization/drugs/drug";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { JSONNavigatorService } from "./utilities/json-navigator.service";
import { IVariantDatabase } from "../variant-selector/variant-selector.service";

import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";

/**
 * Since the myvariant.info response JSON is MASSIVE and depends to a large extent on the query, these locations
 * map the keys of the JSON where values may be stored.
 */
const MY_VARIANT_LOCATIONS = {
  "GeneHUGO": [
    "civic.entrez_name",
    "cadd.gene.genename",
    "cgi.gene",
    "docm.default_gene_name",
    "docm.gene_name",
    "snpeff.genename",
    "snpeff.gene_id",
    "clinvar.gene.symbol" 
  ],
  "VariantName": [
    "civic.name",
    "dbnsfp.mutationtaster.AAE[0]",
    "dbnsfp.mutpred.aa_change"/*,
    "cgi.protein_change (of format BRAF:p.V600E)",
    "docm.aa_change (p. V600E)",
    "emv.egl_protein (p.Val600Glu | p.V600E)"
    */
  ],
  "EntrezID": [
    "civic.entrezID",
    "clinvar.gene.id"
  ],
  "Drug": [
    "cgi.drug",
    "cgi[].drug",
    "civic.evidence_items[].drugs[].name",
    "civic.evidence_items.drugs[].name"
  ],
  "Disease": [
    "civic.evidence_items.disease.display_name",
    "civic.evidence_items[].disease.display_name",
    "clinvar.rcv.conditions.name",
    "clinvar.rcv[].conditions.name",
    "clinvar.rcv[].conditions[].name",
    "clinvar.rcv.conditions[].name"
  ],
  "Description": [
    "civic.description"
  ],
  "Somatic": [
    "civic.evidence_items[0].variant_origin",
    "clinvar.rcv.origin"
  ],
  "ChromosomePos": [
    "chrom"
  ],
  "StartPos": [
    "vcf.position",
    "hg19.start"
  ],
  "EndPos": [
    "vcf.position",
    "hg19.end"
  ],
  "VariantTypes": [
    "civic.variant_types.display_name",
    "civic.variant_types[].display_name"
  ],
  "HGVSID": [
    "_id"
  ],
  "ClinicalSignificance": [
    "clinvar.rcv", // Cool my script even works for sub JSON objects :)
    "clinvar.rcv[]"
  ]
};

// Can"t be declared inside class for some reason.
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
export class MyVariantInfoSearchService implements IVariantDatabase {
  constructor(private http: HttpClient, private jsonNavigator: JSONNavigatorService)
  {
    // Scrub the locations of all bracket indicators.
    for (const key of Object.keys(MY_VARIANT_LOCATIONS))
    {
      const compilation: string[] = [];
      for (let i = 0; i < MY_VARIANT_LOCATIONS[key].length; i++)
      {
        const currentFocus = MY_VARIANT_LOCATIONS[key][i];
        if (currentFocus.indexOf("[") >= 0)
        {

          // REGULAR EXPRESSIONS AHHHHH (test here: http://regexr.com/)
          const scrubbedString = currentFocus.replace(/\[.*?\]/g, "");

          console.log("Scrubbed " + currentFocus + " to " + scrubbedString);
          compilation.push(scrubbedString);
        } else
        {
          compilation.push(currentFocus);
        }
      }
      this.scrubbedLocations[key] = compilation;
    }

    // Add all values of the MY_VARIANT_LOCATIONS array to the include string.
    for (const key of Object.keys(this.scrubbedLocations)) {
      for (const location of this.scrubbedLocations[key]) {
        this.allFieldsIncludeString = this.allFieldsIncludeString + location + ",";
      }
    }
    // Remove the final comma.
    this.allFieldsIncludeString = this.allFieldsIncludeString.substring(0, this.allFieldsIncludeString.length - 1);

    // Add fields required for references to reference include string.
    for (const key of ["GeneHUGO", "VariantName", "EntrezID"])
      for (const location of this.scrubbedLocations[key])
        this.referenceFieldsIncludeString = this.referenceFieldsIncludeString + location + ",";
    // Remove the final comma.
    this.referenceFieldsIncludeString = this.referenceFieldsIncludeString.substring(0, this.allFieldsIncludeString.length - 1);
  }

  // Create these in the constructor so that we don"t constantly re-create them.
  allFieldsIncludeString: string = "";
  referenceFieldsIncludeString: string = "";

  scrubbedLocations: any = {};
  queryEndpoint: string = "https://myvariant.info/v1/query?q=";
  currentKeywords: VariantSearchKeyword[] = [];
  lastSuggestionSet: Observable<VariantReference[]> = Observable.of<VariantReference[]>([]);

  /**
   * Utility method to query in accordance with myvariant.info API.
   * @param {string[]} stringArray
   * @param {string} desiredVal
   * @returns {string}
   */
  public constructORConcatenation(stringArray: string[], desiredVal: string, include_prefixed_args: boolean): string {
    desiredVal = desiredVal.replace(/[:]/g, "\\$&");
    // desiredVal = encodeURIComponent(desiredVal);
    let currentString = "";
    if (include_prefixed_args) 
    {
      currentString = stringArray[0].replace(/_/g, "") + ":" + desiredVal + "*" + "%20OR%20" + stringArray[0] + ":" + desiredVal;
    }
    else
    {
      currentString = stringArray[0] + ":" + desiredVal;
    }

    for (let i = 1; i < stringArray.length; i++) {
      if (include_prefixed_args) {
        currentString = currentString + "%20OR%20" + stringArray[i] + ":" + desiredVal + "*";
      }
      currentString = currentString + "%20OR%20" + stringArray[i] + ":" + desiredVal;
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
  public searchByString = (searchTerm: string): Observable<VariantReference[]> => {
    // Get new keywords.
    const newKeywords: string[] = searchTerm.split(" ");

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

      // It must"ve not been found if we reach here.
      this.currentKeywords.splice(this.currentKeywords.indexOf(potentialConflict), 1);
      console.log(potentialConflict.keyword + " is a conflict.");
    };
    for (const potentialConflict of this.currentKeywords) {
      // Wrapped in a method so that we can return if need be.
      managePotentialConflict(potentialConflict);
    }

    if (newKeywords.length === 0) {
      console.log("Returning last suggestion set", this.lastSuggestionSet);
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
            return result["hits"].length;
          });
      };

      const quickQuerySuffix = "&fields=_id&size=15";

      // Don"t create duplicate purposes.
      const purposeAlreadyExists = (purpose: KeywordPurpose): boolean => {
        for (const keyword of this.currentKeywords) {
          if (keyword.purpose === purpose) {
            return true;
          }
        }
        return false;
      };

      // Query for relative likelihoods.
      if (!isNaN(Number(newKeyword)))
      {
        if (!purposeAlreadyExists(KeywordPurpose.ENTREZ_ID))
          this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.ENTREZ_ID));
      }
      else if (newKeyword.toLowerCase().indexOf("chr") >= 0 || newKeyword.toLowerCase().indexOf("civic") >= 0)
      {
        if (!purposeAlreadyExists(KeywordPurpose.HGVS_ID))
          this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.HGVS_ID));
      }
      else
      {
        const geneHUGOQuery = determineLikelihoodBasedOnQuery(this.queryEndpoint + this.constructORConcatenation(this.scrubbedLocations.GeneHUGO, newKeyword, true) + quickQuerySuffix);
        const variantNameQuery = determineLikelihoodBasedOnQuery(this.queryEndpoint + this.constructORConcatenation(this.scrubbedLocations.VariantName, newKeyword, true) + quickQuerySuffix);

        // Create large observable fork.
        checkObservables.push(
          Observable.forkJoin([geneHUGOQuery, variantNameQuery])
            .map((results: number[]) => {
              console.log("Classification results were ", results);

              // Figure out purpose of keyword.
              if (results[0] > results[1])
              {

                if (!purposeAlreadyExists(KeywordPurpose.Gene_HUGO_Symbol))
                  this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.Gene_HUGO_Symbol));

              }
              else if (results[0] < results[1])
              {

                if (!purposeAlreadyExists(KeywordPurpose.Variant_Name))
                  this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.Variant_Name));

              }
              else
              {
                // Results must be equal.
                if (!purposeAlreadyExists(KeywordPurpose.Gene_HUGO_Symbol))
                  this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.Gene_HUGO_Symbol));

                else if (!purposeAlreadyExists(KeywordPurpose.Variant_Name))
                  this.currentKeywords.push(new VariantSearchKeyword(newKeyword, KeywordPurpose.Variant_Name));

              }
            }));
      }
    }

    const getVariantArrayObservable = (): Observable<VariantReference[]> => {
      console.log("Creating final observable with keywords", this.currentKeywords);
      // Apply keywords to query.
      let finalQuery = this.queryEndpoint;
      let arrayToUse: string[];
      if (this.currentKeywords.length > 1) {
        finalQuery = finalQuery + "(";
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
            arrayToUse = this.scrubbedLocations.HGVSID;
            break;
          case KeywordPurpose.ENTREZ_ID:
            arrayToUse = this.scrubbedLocations.EntrezID;
        }

        finalQuery = finalQuery + this.constructORConcatenation(arrayToUse, this.currentKeywords[i].keyword, true);

        // Add "AND" requirement
        if (i < this.currentKeywords.length - 1) {
          finalQuery = finalQuery + ")%20AND%20(";
        }
      }
      if (this.currentKeywords.length > 1) {
        finalQuery = finalQuery + ")";
      }

      // Add suffix.
      finalQuery = finalQuery + "&fields=" + this.referenceFieldsIncludeString + "&size=15";

      return this.http.get(finalQuery)
        .map(result => {
          console.log("Final Query result from " + finalQuery, result);
          if (!result["hits"])
            return [];

          // Used to check whether a given property exists in the mapped JSON.
          const variantResults: VariantReference[] = [];

          // For every result.
          for (const hit of result["hits"]) {
            // Since names, HUGO symbols, and such shouldn"t include spaces.
            const ensureValidString = (someString: string): string => {
              return someString.indexOf(" ") >= 0 ? someString.substring(0, someString.indexOf(" ")) : someString;
            };

            // Gene construction.
            const variantGene = new GeneReference(ensureValidString(this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.GeneHUGO, false)[0]), Number(this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.EntrezID, false)[0]));

            // Variant construction
            variantResults.push(new VariantReference(variantGene, ensureValidString(this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.VariantName, false)[0]), hit._id));
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
  };

  getByReference = (reference: VariantReference): Observable<Variant> => {
    console.log("Creating final observable with keywords", this.currentKeywords);

    // Apply key fields to query.
    let queryConstruct = this.queryEndpoint;
    let alreadyAdded = 0;
    const addORConstructToQuery = (orConstruct: string) => {
      if (alreadyAdded > 0) {
        queryConstruct = queryConstruct + "%20OR%20(";
      } else {
        queryConstruct = queryConstruct + "(";
      }
      queryConstruct = queryConstruct + orConstruct + ")";
      alreadyAdded++;
    };
    if (reference.origin) {
      if (reference.origin.hugoSymbol && reference.origin.hugoSymbol !== "") {
        addORConstructToQuery(this.constructORConcatenation(this.scrubbedLocations.GeneHUGO, reference.origin.hugoSymbol, true));
      }
      if (reference.origin.entrezID && reference.origin.entrezID !== -1) {
        addORConstructToQuery(this.constructORConcatenation(this.scrubbedLocations.EntrezID, reference.origin.entrezID.toString(), false));
      }
    }

    if (reference.hgvsID && reference.hgvsID !== "") {
      addORConstructToQuery(this.constructORConcatenation(this.scrubbedLocations.HGVSID, reference.hgvsID, false));
    }
    if (reference.variantName && reference.variantName !== "") {
      addORConstructToQuery(this.constructORConcatenation(this.scrubbedLocations.VariantName, reference.variantName, true));
    }
    // Add suffix.
    queryConstruct = queryConstruct + "&fields=" + this.allFieldsIncludeString + "&size=15";

    return this.http.get(queryConstruct)
      .map(result => {
        console.log("Final Query result from " + queryConstruct, result);
        if (!result["hits"])
          return null;

        // For every result.
        if (!(result["hits"] && result["hits"].length > 0))
          return null;

        const hit = result["hits"][0];

        // Since names, HUGO symbols, and such shouldn"t include spaces.
        const ensureValidString = (someString: string): string => {
          return someString.indexOf(" ") >= 0 ? someString.substring(0, someString.indexOf(" ")) : someString;
        };

        // Gene construction.
        console.log("Constructing from reference " + reference.toString())
        const newVariant: Variant = Variant.fromReference(reference);

        newVariant.description = this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.Description, false)[0];
        newVariant.score = hit._score;
        newVariant.somatic = this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.Somatic, false)[0].toLowerCase().indexOf("somatic") >= 0;
        newVariant.chromosome = this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.ChromosomePos, false)[0]; // Can be "X" or "Y"
        newVariant.start = Number(this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.StartPos, false)[0]);
        newVariant.end = Number(this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.EndPos, false)[0]);

        newVariant.drugs = [];
        for (const drugName of this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.Drug, true)) {
          newVariant.drugs.push(new DrugReference(drugName));
        }

        newVariant.types = this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.VariantTypes, true);
        newVariant.diseases = this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.Disease, true);

        newVariant.classifications = [];
        const addClassification = (classification: Classification) => {
          for (const existentC of newVariant.classifications) {
            if (existentC.name === classification.name) {
              existentC.sources.push(classification.sources[0]);
              return;
            }
          }
          newVariant.classifications.push(classification);
        };
        for (const classification of this.jsonNavigator.mergePathsData(hit, MY_VARIANT_LOCATIONS.ClinicalSignificance, true)) {
          addClassification(new Classification(classification.clinical_significance, "ClinVar RCV Accession " + classification.accession));
        }

        return newVariant;
      });
  }
}
