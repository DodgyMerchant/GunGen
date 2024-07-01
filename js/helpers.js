/**
 * my array stuff
 */
export class MyArray {
  /**
   * removes the index from the list
   * @param {any[]} array array to change
   * @param {number} index index to remove
   */
  static removeIndex(array, index) {
    array.splice(index, 1);
  }

  /**
   * fidn the target and removes it from the list
   * @param {any[]} array array to change
   * @param {any} target target to search doe in the list and remove
   */
  static remove(array, target) {
    let index = array.indexOf(target);
    if (index > -1) {
      MyArray.removeIndex(array, index);
    }
  }
}

export class Enum {
  /**
   * must be a unique sting
   * @type {string}
   */
  name;

  /**
   * all enums created
   * @type {!Enum}
   */
  static enums = [];

  /**
   * make an enum
   * @param {string} name simple name
   */
  constructor(name) {
    this.name = name;
    this.constructor.enums.push(this);
  }

  /**
   * find an enum by its name
   * @param {string} nameFind name to search for
   * @returns
   */
  static find(nameFind) {
    /** @type {!Enum} */
    let entry;
    for (let i = 0; i < this.enums.length; i++) {
      entry = this.enums[i];
      if (entry.name == nameFind) return entry;
    }
    return null;
  }

  toString() {
    return `${this.name}`;
  }
}

export class MyMath {
  /**
   * restricts a number to a range defined by min and max
   * @param {number} number number to be restricted
   * @param {number} min minimum floor if the numbers range
   * @param {number} max maximum of the numbers range
   * @returns {number}
   */
  static clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  }
}

/*
function getAnyClass(obj) {
	if (typeof obj === "undefined") return "undefined";
	if (obj === null) return "null";
	return obj.constructor;
}



*/
