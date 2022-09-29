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
	 * simple name
	 * @type {string}
	 */
	name;

	/**
	 * make an enum
	 * @param {string} name simple name
	 */
	constructor(name) {
		this.name = name;
	}
	toString() {
		return this.name;
	}
}
