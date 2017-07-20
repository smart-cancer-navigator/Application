/**
 * The gene database manager is a service which uses the gene-database subservice to obtain genes and
 * variants from a variety of other databases.  It is employed to ensure that this application remains
 * as modular as possible, rather than leveraging a single class to do all the heavy lifting (which
 * would make quick additions and removals far more difficult).
 */

import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Gene }           from './gene';

@Injectable()
export class GeneSearchService {

  constructor(private http: Http) {}

  search(term: string): Observable<Gene[]> {
    return this.http
      .get(`api/heroes/?name=${term}`)
      .map(response => response.json().data as Gene[]);
  }
}
