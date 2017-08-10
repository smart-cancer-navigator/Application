/**
 * A part of the result visualization component, which displays the drugs that will be effective against genes
 * or variants.
 */

import { Component, Input } from "@angular/core";
import { Variant } from "../../global/genomic-data";

@Component({
  selector: "drugs-info",
  template: `
  `,
  styles: [`
  `]
})
export class DrugsComponent {
  @Input() forVariant: Variant;

}
