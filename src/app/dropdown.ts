/**
 * This class is used to represent the properties which compose a given dropdown, without any
 * sort of HTML.  The properties within this class are used for the construction of filterable
 * dropdowns.
 */

export class Dropdown {
  purpose: string;
  selected: string;
  options: string[];
}
