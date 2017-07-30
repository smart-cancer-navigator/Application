/**
 * This service takes care of querying the information which will be displayed on the result visualization
 * component.
 */

import { ClinicalTrialsSearchService } from './clinical-trials.service';
import { Injectable } from '@angular/core';

@Injectable()
export class VisualizeResultsService {
  constructor (clinicalTrialsSearchService: ClinicalTrialsSearchService) {}
}
