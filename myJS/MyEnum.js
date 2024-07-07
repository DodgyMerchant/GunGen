export default class MyEnum {
  /**
   * must be a unique sting
   * @type {string}
   */
  name;

  /**
   * all enums created
   * @type {!MyEnum}
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
    /** @type {!MyEnum} */
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
