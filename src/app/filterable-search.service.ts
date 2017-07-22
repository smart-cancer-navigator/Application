/**
 * This abstract class simply ensures that all search services for the filterable search components
 * implement the key search() method of type Observable or [], since those are the two applicable
 * options for a search return.
 */

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {FilterableSearchOption} from './filterable-search-option';

// Extension classes must be Injectable.
@Injectable()
export abstract class FilterableSearchService {
  // Must either return an async Observable (i.e. GET requests must be sent), or simply an array of applicable options.
  abstract search(term: string): Observable <FilterableSearchOption[]>;
}
