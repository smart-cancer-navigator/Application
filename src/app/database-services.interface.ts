/**
 * The gene database is a base class which represents a database such as CIViC, MyCancerGenome, CADD,
 * etc., while providing a universal format for the database GET methods to follow.  This functionality
 * ensures that a developer can, in the future, write a single class and reference it in the manager to
 * add the full functionality of another database.
 */
import { Observable } from 'rxjs/Observable';
import {Gene, Variant, VariantType} from './genomic-data';

export interface GeneDataProvider {
  provideGenes: (searchTerm: string) => Observable <Gene[]>;
}

export interface VariantDataProvider {
  provideVariants: (searchTerm: string, additionalContext: Gene) => Observable <Variant[]>;
}

export interface VariantTypeDataProvider {
  provideVariantTypes: (searchTerm: string, additionalContext: Variant) => Observable<VariantType[]>;
}
