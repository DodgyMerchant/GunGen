import { MyArray, MyMath } from "./helpers.js";
import * as system from "./system.js";

const ATTACH_LEVEL = 1;

/**
 * @typedef {object} RoundConfig config object for a Round Object
 * @property {system.CALIBER | string} caliber caliber of the round
 * @property {system.ROUNDSTATES | string} [state] state the round is in
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
			if (!caliber.state) this.state = system.ROUNDSTATES.Ready;
			else {
				this.state = caliber.state;
			}
		}
	}
}
/**
 * a ammo container
 */
export class AmmoContainer {
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
	 * array of contents bullets
	 * @type {Round[]}
	 */
	contents = [];

	/**
	 *
	 * @param {system.CALIBER} caliber ammo caliber
	 * @param {number} capacity ammo capacity
	 * @param {Round[] | undefined | RoundConfig} contents ammo contents
	 */
	constructor(caliber, capacity, contents) {
		this.caliber = caliber;
		this.capacity = capacity;

		if (contents && typeof contents === "object") {
			if (Array.isArray(contents)) {
				this.contents = contents;
			} else {
				for (let index = 0; index < capacity; index++) {
					this.contents.push(new Round(contents));
				}
			}
		} else this.contents = [];
	}

	toString() {
		return `${this.caliber}\n ${this.contents.length}\n/${this.capacity}\n`;
	}

	/**
	 * check if you can load ammo in
	 * @param {system.CALIBER} cal
	 */
	loadCheck(cal) {
		return system.gunFactory.loadCheck(this, cal);
	}

	/**
	 *
	 * @param {Round | Round[] | AmmoContainer} round
	 * @returns {number} number of how many rounds contents, -1 == all given in list
	 */
	loadAmmo(round) {
		return system.gunFactory.loadAmmo(this, round);
	}
}

//#region slot

/**
 * @typedef {object} SlotConfig config object for a slot object
 * @prop {system.SLOTTYPE | string} attachType type of attachment needed to connect
 * @prop {object} cildConf child config object
 */
/**
 * a slot to connect one part to another
 */
export class partSlot {
	/**
	 * parent object this object os attached to
	 * @type {gunPart}
	 */
	parent;

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

	// is = system.gunFactory.is;

	/**
	 * a attachment slot on another part.
	 * Can replace 2nd parameter for a config obj
	 * @param {gunPart} parent parent object this object os attached to
	 * @param {system.SLOTTYPE | SlotConfig} attachType type of attatchment type
	 * @param {gunPart | undefined} child the child to attach, undefined if no child
	 */
	constructor(parent, attachType, child = undefined) {
		this.parent = parent;

		if (!attachType instanceof system.SLOTTYPE) {
		} else {
			this.attachType = attachType;

			if (child) {
				this.attach(child);
			}
		}
	}

	/**
	 * detach connected child
	 * @return {boolean}
	 */
	detach() {
		this.child.triggerParentDettach(this.parent);
		this.parent.triggerChildDettach(this.child);
		this.child = undefined;

		return true;
	}

	/**
	 * set child variable to gunpart
	 * @param {gunPart} part
	 */
	attach(part) {
		if (!this.child) {
			this.child = part;
			this.child.triggerParentAttach(this.parent);
			this.parent.triggerChildAttach(this.child);
			return true;
		}
		return false;
	}

	toString(simple = true) {
		let str = this.child ? `\n${this.child}` : "\nempty slot";

		if (simple) {
			return `${str}`;
		} else return `\nattachType: ${this.attachType}\n-- part > ${str}`;
	}
}

export class partRail extends partSlot {
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
//#endregion slot
//#region parts

/**
 * @typedef {object} PartProp properties for the gunPart objects config Object
 * @property {string} model name of the gun model
 * @property {string | system.SLOTTYPE} attachType compatable attachment types
 * @property {PartDef[]} partSlotlist the parts that make up the gun
 */
/**
 * abstract base gun part of a gun
 */
export class gunPart {
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
	 * @param {PartProp} conf config objects
	 */
	constructor(parent, conf) {
		this.parent = parent;
		this.model = conf.model;
		this.attachType = conf.attachType;
		this.partSlotlist = conf.partSlotlist;
	}

	/**
	 * displays/return the name of the gunpart
	 * @returns {string} name of gunpart
	 */
	getDisplayName() {
		return this.model;
	}

	//#region trigger
	/**
	 * triggered on:
	 * a parent is now attached to THIS obj
	 * THIS is a child
	 * @param {gunPart} parent
	 */
	triggerParentAttach(parent) {}
	/**
	 * triggered on:
	 * a parent was detached from THIS obj
	 * THIS was a child
	 * @param {gunPart} parent
	 */
	triggerParentDettach(parent) {}

	/**
	 * triggered on:
	 * a child is now attached to THIS obj
	 * THIS is a parent
	 * @param {gunPart} child
	 */
	triggerChildAttach(child) {}
	/**
	 * triggered on:
	 * a child was detached from THIS obj
	 * THIS was a parent
	 * @param {gunPart} parent
	 */
	triggerChildDettach(child) {}

	//#endregion trigger

	toJson() {
		//TODO
		let obj = {};
	}

	/**
	 * to string
	 * @argument {boolean} simple simplified display
	 * @returns {string}
	 */
	toString(simple = true) {
		return `model: ${this.model}\nparent: ${this.parent}\nattachType: ${this.attachType}\npartSlotlist [ ${this.partSlotlist}]`;
	}
}

/**
 * @typedef {object} NamedProp properties for the gunPartNamed objects config Object
 * @property {string} givenName given custom name of the gun, display priority
 * @property {boolean} renamable if the part is renamable
 */
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
	constructor(
		parent,
		model,
		givenName,
		renamable = false,
		attachType,
		partSlotlist
	) {
		super(parent, model, attachType, partSlotlist);

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
		return super.toString(simple) + `\ngivenName: ${this.givenName}`;
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
	/**
	 *
	 * @param {string} model model name
	 */
	constructor(model, givenName, renamable, attachType, partSlotlist) {
		super(undefined, model, givenName, renamable, attachType, partSlotlist);
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

/**
 * @typedef {object} MagProp properties for the gunPart_Magazine objects config Object
 * @property {string | system.CALIBER} caliber caliber enum name
 * @property {number} capacity ammo capacity
 * @property {Round[] | RoundConfig[] | RoundConfig | undefined} contents array of contents bullets
 *
 * @typedef {MagProp & PartProp} MagConf the gunPart_Magazine objects config object
 */
/**
 * a magazine for a gun
 */
export class gunPart_Magazine extends gunPart {
	/**
	 * caliber
	 * @type {system.CALIBER}
	 */
	caliber;
	/**
	 * ammo capacity
	 * @type {number}
	 */
	capacity;
	/**
	 * array of contents bullets
	 * @type {Round[]}
	 */
	contents = [];

	/**
	 * make a mag
	 * @param {gunPart} parent parent this gun part is attached to
	 * @param {MagConf} conf config objects
	 */
	constructor(parent, conf) {
		super(parent, conf);
		this.caliber = conf.caliber;
		this.capacity = conf.capacity;

		let cont = conf.contents;
		if (cont)
			//check type of arguemnt
			switch (system.gunFactory.is(cont)) {
				case "object":
					//one config obj
					for (let index = 0; index < conf.capacity; index++) {
						this.contents.push(new Round(cont));
					}
					break;
				case "array":
					//list of bullet objects
					if (cont[0] instanceof Round) this.contents = cont;
					// list filled with configs
					else
						for (let i = 0; i < cont.length; i++) {
							this.contents.push(new Round(cont[i]));
						}
					break;
				default:
					// this.contents = [];
					break;
			}
	}

	/**
	 *
	 * @param {Round | Round[] | AmmoContainer | gunPart} round
	 * @returns {number} number of how many rounds contents, -1 == all given in list
	 */
	load(round) {
		return system.gunFactory.loadAmmo(this, round);
	}

	/**
	 *
	 * @returns {Round}
	 */
	extract() {
		return this.contents.pop;
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

export class gunPart_Extractor extends gunPart {
	/**
	 * @param {gunPart_Top} parent
	 */
	constructor(parent, model, attachType, partSlotlist) {
		super(parent, model, attachType, partSlotlist);
	}
	/**
	 * caliber of the barrel
	 * @type {system.CALIBER}
	 */
	caliber;

	/**
	 * source of ammunition
	 * @type {gunPart_Magazine}
	 */
	source;

	/**
	 * @type {Round}
	 */
	heldRound;

	extract() {
		if (!this.source || this.heldRound != undefined) return;

		if (this.calCheck(this.source.caliber))
			this.heldRound = this.source.extract();
	}

	/**
	 *
	 * @returns eject held round
	 */
	eject() {
		if (!this.heldRound) return null;
		let round = this.heldRound;
		this.heldRound = undefined;
		return round;
	}

	/**
	 *
	 * @param {CALIBER} cal
	 * @returns {boolean}
	 */
	calCheck(cal) {
		return this.caliber == cal;
	}
}

//#region top

/**
 * @typedef {object} TopProp properties for the gunPart_Top objects config Object.
 * @property {boolean} blowback if the bolt/slide will be pushed back to chamber another round. only if auto loading.
 * @property {boolean} springLoaded if the bolt will push forward when in a backwar position.
 * @property {number | 0 | 1} [position] position of the top. 0 being fully pulled back. 1 being fully pushed forward.
 * @property {number} feedPosition procentual value of the feed position of the extractor
 */
/**
 * parent for slide and bolt
 */
class gunPart_Top extends gunPart {
	/**
	 * if the bolt/slide will be pushed back to chamber another round.
	 * only if auto loading.
	 * @type {boolean}
	 */
	blowback;

	/**
	 * if the bolt will push forward when in a backwar position.
	 * @type {boolean}
	 */
	springLoaded;

	/**
	 * position of the top.
	 * 0 being fully pulled back.
	 * 1 being fully pushed forward.
	 * @type {number | 0 | 1}
	 */
	position = 1;

	/**
	 * procentual value of the feed position of the extractor
	 * @type {number}
	 */
	feedPosition = 0.2;

	/**
	 * @param {gunPart} parent parent this gun part is attached to
	 * @param {TopProp} conf config objects
	 */
	constructor(parent, conf) {
		super(parent, conf);

		this.blowback = conf.blowback;
		this.springLoaded = conf.springLoaded;
		this.position = conf.position;
		this.feedPosition = conf.feedPosition;
	}

	setPosition(value) {
		let oldPos = this.position;
		this.position = MyMath.clamp(value, 0, 1);

		if (oldPos < this.feedPosition || this.position >= this.feedPosition) {
			console.log("EXTRACT ROUND");
		} else if (
			oldPos > this.feedPosition ||
			this.position <= this.feedPosition
		) {
			console.log("EJECT ROUND");
		}
	}
}
/**
 * @typedef {object} BoltProp properties for the gunPart_Bolt objects config Object.
 * @property {boolean} openBolt open or clodesed bolt
 */
/**
 * reciprocating bolt
 */
export class gunPart_Bolt extends gunPart_Top {
	/**
	 * open or clodesed bolt
	 * @type {boolean}
	 */
	openBolt;

	/**
	 * pistol bolt
	 * @param {gunPart} parent parent this gun part is attached to
	 * @param {BoltProp} conf config objects
	 */
	constructor(parent, conf) {
		super(blowback, springLoaded);

		this.openBolt = conf.openBolt;
	}
}
/**
 * @typedef {object} SlideProp properties for the gunPart_Slide objects config Object.
 *
 */
/**
 * top slide of gun
 */
export class gunPart_Slide extends gunPart_Top {
	/**
	 * pistol bolt
	 * @param {gunPart} parent parent this gun part is attached to
	 * @param {SlideProp} conf config objects
	 */
	constructor(parent, conf) {
		super(parent, conf);
	}
}
/**
 * @typedef {object} ChargeHandleProp properties for the gunPart_ChargingHandle objects config Object.
 * @property {boolean} reciprocating if the charging handle will move with the bolt.
 * @property {boolean} folding small if not held.
 */
/**
 * charging handle to pull
 */
export class gunPart_ChargingHandle extends gunPart_Top {
	/**
	 * if the charging handle will move with the bolt.
	 * @type {boolean}
	 */
	reciprocating;

	/**
	 * small if not held.
	 * @type {boolean}
	 */
	folding;

	/**
	 * pistol bolt
	 * @param {gunPart} parent parent this gun part is attached to
	 * @param {ChargeHandleProp} conf config objects
	 */
	constructor(parent, conf) {
		super(parent, conf);

		this.folding = conf.folding;
		this.reciprocating = conf.reciprocating;
	}
}

//#endregion top

//#endregion parts
