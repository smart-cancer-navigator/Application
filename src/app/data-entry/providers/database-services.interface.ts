/**
 * The gene database is a base class which represents a database such as CIViC, MyCancerGenome, CADD,
 * etc., while providing a universal format for the database GET methods to follow.  This functionality
 * ensures that a developer can, in the future, write a single class and reference it in the manager to
 * add the full functionality of another database.
 */
import { Observable } from 'rxjs/Observable';
import { Variant } from '../../global/genomic-data';

/**
 * Very simple and straightforward requirements, the database receives the search term and then just hands back the
 * results.
 */
export interface IDatabase {
  search: (searchTerm: string) => Observable<Variant[]>;
}
