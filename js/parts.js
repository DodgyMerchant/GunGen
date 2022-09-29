import { MyArray } from "./helpers.js";
import * as system from "./system.js";

const ATTACH_LEVEL = 1;

/**
 * @typedef {Object} RoundConfig
 * @property {system.CALIBER} caliber caliber
 * @property {system.ROUNDSTATES} state state
 */
/**
 * a round to shoot
 */
export class Round {
	/**
	 * caliber
	 * @type {system.CALIBER}
	 */
	caliber;

	/**
	 * @type {system.ROUNDSTATES}
	 */
	state;

	/**
	 * make a round
	 * @param {system.CALIBER | RoundConfig} caliber can be config bject
	 * @param {system.ROUNDSTATES | undefined} state
	 */
	constructor(caliber, state = system.ROUNDSTATES.Ready) {
		if (caliber instanceof system.CALIBER) {
			this.caliber = caliber;
			this.state = state;
		} else {
			this.caliber = caliber.caliber;
			this.state = caliber.state;
		}
	}
}

/**
 * a slot to connect one part to another
 */
class partSlot {
	/**
	 * type of attachment needed to connect
	 * @type {system.SLOTTYPE}
	 */
	attachType;

	/**
	 * the connected part
	 * @type {gunPart}
	 */
	child;

	constructor(attachType, child) {
		this.attachType = attachType;

		if (child) {
			this.attach(child);
		}
	}

	/**
	 * detach connected child
	 */
	detach() {
		this.child = undefined;
	}

	/**
	 * set child variable to gunpart
	 * @param {gunPart} part
	 */
	attach(part) {
		if (child) {
			this.child = part;
			return true;
		}
		return false;
	}
}

class partRail extends partSlot {
	/**
	 * the connected gunparts
	 * @type {gunPart[]}
	 */
	childList;

	/**
	 * detach the part from the list
	 * @param {gunPart} part part to detach
	 */
	detach(part) {
		MyArray.remove(this.childList, part);
	}

	/**
	 * attach the part to the list
	 * @param {gunPart} part part to detach
	 */
	attach(attach) {
		//TODO attach part to rail
	}
}

/**
 * abstract base gun part of a gun
 */
class gunPart {
	/**
	 * parent this gun part is attached to
	 * @type {gunPart}
	 */
	parent;

	/**
	 * name of the gun model
	 * @type {string}
	 */
	model;

	/**
	 * compatable attachment types
	 * @type {system.SLOTTYPE[]}
	 */
	attachType;

	/**
	 * the parts that make up the gun
	 * @type {partSlot[]}
	 */
	partSlotlist;

	/**
	 * abstract base gun part of a gun
	 * @param {gunPart} parent parent this gun part is attached to
	 * @param {string} model name of the gun model
	 * @param {partSlot[]} partSlotlist the parts that make up the gun
	 */
	constructor(parent, model, attachType, partSlotlist) {
		this.parent = parent;
		this.model = model;
		this.attachType = attachType;
		this.partSlotlist = partSlotlist;
	}

	/**
	 * displays/return the name of the gunpart
	 * @returns {string} name of gunpart
	 */
	getDisplayName() {
		return this.model;
	}

	/**
	 * to string
	 * @returns {string}
	 */
	toString() {
		return `parent: ${this.parent}\nmodel: ${this.model}`;
	}
}

/**
 * named gunparts
 */
class gunPartNamed extends gunPart {
	/**
	 * given custom name of the gun, display priority
	 * @type {string}
	 */
	givenName;

	/**
	 * if the part is renamable
	 * @type {boolean}
	 */
	renamable;

	/**
	 * make a namable part
	 * @param {string} givenName given custom name of the gun, display priority
	 * @param {boolean} renamable
	 */
	constructor(parent, model, givenName, renamable = false, partSlotlist) {
		super(parent, model, partSlotlist);

		this.givenName = givenName;
		this.renamable = renamable;
	}

	/**
	 * returns if part is named
	 * @returns {boolean}
	 */
	nameStatus() {
		if (!this.givenName) return false;
		return true;
	}

	getDisplayName() {
		return this.nameStatus() ? this.givenName : this.model;
	}

	toString() {
		super.toString() + `\ngivenName: ${this.givenName}`;
	}
}
/**
 * part that is grabbable by the mouse in some way.
 */
class gunPartGrab extends gunPart {
	/**
	 * in any shape of form at some time grabable
	 * @type {boolean}
	 */
	grabSetup;
	/**
	 * can be crabbed right now
	 * @type {boolean}
	 */
	grabEnabled = false;
	/**
	 * is grabbed right now
	 * @type {boolean}
	 */
	grabActive = false;

	/**
	 *
	 * @param {boolean} grabSetup in any shape of form at some time grabable
	 */
	constructor(parent, model, attachType, partSlotlist, grabSetup) {
		super(parent, model, attachType, partSlotlist);

		this.grabSetup = grabSetup;

		if (this.grabSetup) {
			this.grabEnabled = true;
		}
	}
}

export class Gun extends gunPartNamed {
	constructor(model, givenName, renamable, partSlotlist) {
		super(undefined, model, givenName, renamable, partSlotlist);
	}
}

/**
 * barrel of a gun
 */
export class gunPart_Barrel extends gunPart {
	/**
	 * caliber of the barrel
	 * @type {system.CALIBER}
	 */
	caliber;

	/**
	 * length of the barrel
	 * @type {number}
	 */
	length;

	constructor(parent, model, partSlotlist, caliber, length) {
		super(parent, model, partSlotlist);
		this.caliber = caliber;
		this.length = length;
	}
}

export class gunPart_Magazine extends gunPartGrab {
	/**
	 * caliber of the barrel
	 * @type {system.CALIBER}
	 */
	caliber;
	/**
	 * ammo capacity
	 * @type {number}
	 */
	capacity;
	/**
	 * array of loaded bullets
	 * @type {Round[]}
	 */
	array;

	/**
	 *
	 * @param {system.CALIBER} caliber ammo capacity
	 * @param {number} capacity ammo capacity
	 * @param {Round[] | undefined | RoundConfig} array ammo loaded
	 */
	constructor(
		parent,
		model,
		attachType,
		partSlotlist,
		grabSetup,
		caliber,
		capacity,
		array
	) {
		super(parent, model, attachType, partSlotlist, grabSetup);
		this.caliber = caliber;
		this.capacity = capacity;

		if (array && typeof array === "object") {
			if (Array.isArray(array)) {
				this.array = array;
			} else {
				for (let index = 0; index < capacity; index++) {
					new Round(array);
				}
			}
		} else this.array = [];
	}

	/**
	 * check if you can load ammo in
	 * @param {system.CALIBER} cal
	 */
	loadCheck(cal) {
		return !(
			this.array.length >= this.capacity ||
			(cal && cal != this.caliber)
		);
	}

	/**
	 *
	 * @param {Round | Round[]} round
	 * @returns {number} number of how many rounds loaded, -1 == all given in list
	 */
	load(round) {
		//TODO caliber dont work
		if (!this.loadCheck()) return 0;
		//check if too many bullets
		if (Array.isArray(round)) {
			if (this.array.length + round.length > this.capacity) {
				let index;
				for (index = 0; this.array.length < this.capacity; index++) {
					this.array.push(round[index]);
				}
				return index;
			} else {
				this.array.push(...round);
				return -1;
			}
		} else {
			this.array.push(round);
			return 1;
		}
	}
}
export class gunPart_Fireselector extends gunPart {
	lockTrigger;

	/**
	 * if the safe position locks the bolt/slide
	 */
	lockBolt;

	/**
	 * release hammer
	 */
	releaseHammer;

	/**
	 * if releasing the trigger cancels the number of shots not fired in the burst
	 */
	burstCancel;

	/**
	 * @type {system.FIREMODE[]}
	 */
	selectorList;
}

class gunPart_Extractor extends gunPart {
	constructor(parent, model, attachType, partSlotlist) {
		super(parent, model, attachType, partSlotlist);
	}

	/**
	 * caliber of the barrel
	 * @type {system.CALIBER}
	 */
	caliber;
}

/**
 * parent for slide and bolt
 */
class gunPart_Top extends gunPart {
	/**
	 * if the bolt/slide will be pushed back to chamber another round.
	 * only if auto loading.
	 */
	blowback;

	/**
	 * if the bolt will push forward when in a backwar position.
	 * always true if blowback.
	 */
	springLoaded;

	/**
	 *
	 * @param {number} RPM
	 * @param {boolean} blowback
	 * @param {boolean} springLoaded
	 */
	constructor(blowback, springLoaded) {
		this.blowback = blowback;
		this.springLoaded = springLoaded;
	}
}
export class gunPart_Bolt extends gunPart_Top {
	/**
	 * open or clodesed bolt
	 */
	open;

	/**
	 * pistol bolt
	 * @param {boolean} open open or clodesed bolt
	 */
	constructor(blowback, springLoaded, open) {
		super(blowback, springLoaded);
		this.open = open;
	}
}
export class gunPart_Slide extends gunPart_Top {
	constructor(blowback, springLoaded) {
		super(blowback, springLoaded);
	}
}
export class gunPart_ChargingHandle extends gunPart_Top {
	/**
	 * if the charging handle will move with the bolt.
	 */
	reciprocating;

	folding;
}
