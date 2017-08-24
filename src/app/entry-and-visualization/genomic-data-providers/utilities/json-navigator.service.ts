/**
 * TODO: This class should eventually take over for the myvariant.info querier's JSON searching, since that service should be
 * leverageable by all services which require it.
 */
import { Injectable } from "@angular/core";

@Injectable()
export class JSONNavigatorService {
  /**
   * Navigates through a simple path "item.test.name", NOT "item.test[].name"
   * @param from  the JSON to search through.
   * @param {string} path  the path of the item in question.
   * @returns {any}  the sub JSON at that path.
   */
  navigateToPath(from: any, path: string): any {
    let current = from;
    for (const key of path.split(".")) {
      if (current instanceof Array) {
        return null;
      }
      if (!current.hasOwnProperty(key)) {
        return null;
      }
      current = current[key];
    }
    return current;
  }

  /**
   * Takes a path which may contain bracket notation and recursively parses it to a string or a string array (depending
   * on the data available at that path).
   * @param from
   * @param {string} path
   * @returns {string | string[]}
   */
  getPathData(from: any, path: string): any | any[] {
    // Figure out whether the user added any [] in.
    if (path.indexOf("[") >= 0 && path.indexOf("]") >= 0) {
      // Figure out the array stuff.
      const prePath = path.substring(0, path.indexOf("["));
      // Navigate to prePath.
      const current = this.navigateToPath(from, prePath);

      if (!(current instanceof Array)) {
        return null;
      }

      // Post path.
      let index = Number(path[path.indexOf("[") + 1]);
      if (isNaN(index)) {
        index = -1;
      }
      const postPath = path.substring(path.indexOf("]") + 2);

      // User wrote civic.evidence_items[] not [0]
      if (index === -1) { // Will return array
        let compilation: string[] = [];
        for (const subJSON of current) {
          // Recursive call (in case more [] are included)
          const subJSONValue = this.navigateToPath(subJSON, postPath);
          if (subJSONValue === null) {
            return null;
          }

          if (subJSONValue instanceof Array) {
            for (const subJSONArrayValue of subJSONValue) {
              compilation.push(subJSONArrayValue);
            }
          } else {
            compilation.push(subJSONValue);
          }
        }
        compilation = compilation.filter(function (filterItem) {
          return filterItem !== null && filterItem !== "";
        });
        return compilation;
      } else {
        return this.getPathData(current[index], postPath);
      }
    } else {
      return this.navigateToPath(from, path);
    }
  }

  /**
   * Calls getPathData on a bunch of paths and merges the resulting data.
   */
  mergePathsData(from: any, paths: string[], searchAll: boolean): any[] {
    let compilation: string[] = [];
    for (const potentialHeader of paths) {
      const potentialValue = this.getPathData(from, potentialHeader);
      if (potentialValue !== null) {
        if (potentialValue instanceof Array) {
          for (const subValue of potentialValue) {
            compilation.push(subValue);
          }
        } else {
          compilation.push(potentialValue);
        }
        if (!searchAll) {
          break;
        }
      }
    }

    // Don"t search for duplicates if there"s only one value!
    if (searchAll) {
      // Remove duplicates from array (thanks StackOverflow!)
      compilation = compilation.reduce(function(p, c, i, a){
        if (p.indexOf(c) === -1) {
          p.push(c);
        } else {
          p.push("");
        }
        return p;
      }, []);
      // Remove all empty strings from array.
      compilation = compilation.filter(function (filterItem) {
        return filterItem !== "";
      });
    }

    if (compilation.length === 0 && !searchAll) {
      compilation.push(""); // Empty string so that errors aren"t thrown.
    }

    return compilation;
  }
}
