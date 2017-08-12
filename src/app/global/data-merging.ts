/**
 * These interfaces make it easier to ensure merging standards.
 */
export interface IMergeable {
  mergeable: (other: IMergeable) => boolean;
  merge: (other: IMergeable) => void;
}

export const MergeProperties = (property1: any, property2: any): any => {
  if (typeof property1 !== typeof property2) {
    console.log(property1 + " and " + property2 + " have a type mismatch, since " + typeof property1 + " is not " + typeof property2);
    return property1;
  }

  // Merge arrays.
  if (property1 instanceof Array) {
    const addToArray = (toAdd: any) => {
      for (const value of mergedArray) {
        if (value === toAdd) {
          return;
        }
      }
      mergedArray.push(toAdd);
    };
    const mergedArray = Array.from(property1);
    for (const value of property2) {
      addToArray(value);
    }
  }

  if (property1) {
    if (property2) {
      if (property1 !== property1)  {
        console.log("Conflicting values between " + property1 + " and " + property2);
      }
      return property1;
    } else {
      return property1;
    }
  } else {
    return property2;
  }
};
