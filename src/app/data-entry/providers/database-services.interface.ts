/**
 * The gene database is a base class which represents a database such as CIViC, MyCancerGenome, CADD,
 * etc., while providing a universal format for the database GET methods to follow.  This functionality
 * ensures that a developer can, in the future, write a single class and reference it in the manager to
 * add the full functionality of another database.
 */
import { Observable } from 'rxjs/Observable';
import { Gene, Variant } from '../../global/genomic-data';

/**
 * Used for mygene.info, where you can query the string prefixes and obtain lists of genes in response.
 */
export interface SearchableGeneDatabase {
  searchGenes: (searchTerm: string) => Observable <Gene[]>;
}

/**
 * Used for myvariant.info, where you can query the string prefixes and obtain lists of variants in response.
 */
export interface SearchableVariantDatabase {
  searchVariants: (searchTerm: string, additionalContext: Gene) => Observable <Variant[]>;
}

/**
 * Used for databases like CIViC, where you just query all the genes and then return the database.  Extends
 * the SearchableVariantDatabase since it should be able to search through its own variants easily.
 */
export interface SingleMapDatabase extends SearchableVariantDatabase {
  mapDatabase: () => Observable <Variant[]>;
}

/**
 * Used when the user inputs an HGVS ID instead of robust or intelligent search.
 */
export interface HGVSIdentifier {
  validateHGVS: (hgvsID: string) => Observable <Variant>;
}
