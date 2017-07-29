/**
 * The FilterableSearchService for the intelligent search of data entry.
 */

import { FilterableSearchService } from './filterable-search/filterable-search.component';
import { Observable } from 'rxjs/Observable';
import { Gene, Variant } from '../global/genomic-data';

export const VARIANT_MAPPINGS: string[] = [
  'BRCA1 C61G 672 chr17:g.41258504A>C',
  'BRCA1 M1I 672 chr3:g.37035039A>T',
  'BRCA2 M1R 675 chr13:g.32890599T>G',
  'BRCA2 V159M 675 chr13:g.32900287G>A',
  'BRCA2 R2336P 675 chr13:g.32921033G>C',
  'ABCB1 S893T 5243 chr7:g.87160618A>T',
  'TP53 R273L 7157 chr17:g.7577121G>A',
  'TP53 R249 7157 chr17:g.7577535C>G',
  'BRAF V600E 673 chr7:g.140453136A>T',
  'PIK3CA E542K 5290 chr3:g.178936082G>A',
  'PIK3CA E545K 5290 chr3:g.178936091G>A',
  'PIK3CA H1047R 5290 chr3:g.178952085A>G',
  'KRAS G12D 3845 chr12:g.25398284C>T',
  'KRAS G13D 3845 chr12:g.25398281C>T',
  'EGFR L858R 1956 chr7:g.55259515T>G',
  'EGFR T790M 1956 chr7:g.55249071C>T',
  'NRAS Q61K 4893 chr1:g.115256530G>T',
  'ALK F1174L 238 chr2:g.29443695G>T',
  'ATM N2875H 472 chr11:g.108218044A>C',
  'ABL1 M351T 25 chr9:g.133748391T>C'
];

export class VariantWithCertaintyFactor {
  certaintyFactor: number;
  variant: Variant;

  constructor (_certaintyFactor: number, _variant: Variant) {
    this.certaintyFactor = _certaintyFactor;
    this.variant = _variant;
  }
}

export class IntelligentGenomicsSearchService implements FilterableSearchService {

  constructor() {
    this.initialize();
  }

  variantData: Variant[] = [];

  public initialize = () => {
    for (const variantMap of VARIANT_MAPPINGS) {
      const currentDataset: string[] = variantMap.split(' ');
      const newVariant: Variant = new Variant(new Gene(currentDataset[0], -1, parseInt(currentDataset[2])), currentDataset[1], currentDataset[3], -1);
      this.variantData.push(newVariant);
    }
  }

  public search = (term: string): Observable<Variant[]> => {
    const maxSuggestions: number = 10;

    const keyTerms: string[] = term.split(' ');
    const variantSuggestions: VariantWithCertaintyFactor[] = [];

    // Used to calculate the probability that this option is one that the user would like to see suggested.
    const calculateCertaintyFactor = (itemProperties: string[], typedTerms: string[]): number => {
      let totalCF = 0;

      // Figure out the greatest certainty factor for every typed term.
      for (const typedTerm of typedTerms) {
        let greatestCF: number = -10000;
        if (typedTerm.length <= 2) {
          continue;
        }

        for (let itemPropertyIndex = 0; itemPropertyIndex < itemProperties.length; itemPropertyIndex++) {
          const itemProperty: string = itemProperties[itemPropertyIndex];

          if (!itemProperty || itemProperty === '') {
            continue;
          }

          let currentCF: number = 0;

          if (itemProperty.toLowerCase().indexOf(typedTerm.toLowerCase()) >= 0) {
            currentCF += 1 * typedTerm.length;
          } else {
            currentCF -= 5 * typedTerm.length;
          }

          if (currentCF > greatestCF) {
            greatestCF = currentCF;
          }
        }

        // Add the greatest certainty factor to the total.
        totalCF += greatestCF;
      }

      return totalCF;
    }

    const placeVariant = (variantWithCF: VariantWithCertaintyFactor) => {
      for (let i = 0; i < variantSuggestions.length; i++) { // Ensures that result is 10 long.
        if (variantSuggestions[i].certaintyFactor <= variantWithCF.certaintyFactor) {
          variantSuggestions.splice(i, 0, variantWithCF);
          return;
        }
      }

      // Was not pushed if we reach here.
      variantSuggestions.push(variantWithCF);
    }

    // Calculate certainty factors and place in order in array.
    for (const variant of this.variantData) {
      const calculatedCF = calculateCertaintyFactor([variant.hgvs_id, variant.variant_name, variant.origin.hugo_symbol, variant.origin.entrez_id.toString()], keyTerms);

      if (calculatedCF >= 0) {
        const variantWithCF: VariantWithCertaintyFactor = new VariantWithCertaintyFactor(calculatedCF, variant);
        placeVariant(variantWithCF);
      }

      // Ensure that size remains clipped.
      if (variantSuggestions.length > maxSuggestions) {
        variantSuggestions.splice(maxSuggestions, 1);
      }
    }

    console.log(variantSuggestions);

    // Get rid of certainty factors.
    const toReturn: Variant[] = [];
    for (const suggestion of variantSuggestions) {
      toReturn.push(suggestion.variant);
    }

    return Observable.of(toReturn);
  }
}
