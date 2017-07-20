/**
 * Gene variants vary in their pathogenicity (danger to their host), and are important to consider
 * alongside the genes which they vary from.
 */

import {Gene} from './gene';

export class Variant {
  gene: Gene;
  id: number;
  name: string;
}
