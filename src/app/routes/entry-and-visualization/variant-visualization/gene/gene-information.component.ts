/**
 * Visualizing the data for the gene: a tab on the result visualization.
 */

import { Component, Input } from "@angular/core";
import { Gene } from "../../genomic-data";

@Component({
  selector: "gene-information",
  templateUrl: 'gene-information.component.html'
})
export class GeneInformationComponent {
  @Input() gene: Gene;
}
