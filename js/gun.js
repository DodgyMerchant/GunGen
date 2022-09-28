/**
 * my array stuff
 */
class MyArray {
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

class Enum {
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

/**
 * gun calibers
 */
class CALIBER extends Enum {
	static CAL9 = new CALIBER("9mm", "9×19mm Parabellum", 1);
	static CAL45 = new CALIBER(".45", ".45 Auto", 0.8);
	static CAL50 = new CALIBER(".50 AE", ".50 Action Express", 0.7);

	/**
	 * full descriptive name
	 * @type {string}
	 */
	fullname;
	/**
	 * ammo multiplier for ammocapacity
	 * @type {number}
	 */
	ammoMult;

	constructor(name, fullname, ammoMult) {
		super(name);
		this.fullname = fullname;
		this.ammoMult = ammoMult;
	}
	toString() {
		return this.fullname;
	}
}
class SLOTTYPE extends Enum {
	static PistolSlide = new SLOTTYPE("pistol slide");
	static PistolBolt = new SLOTTYPE("pistol bolt");
	static PistolGrip = new SLOTTYPE("pistol grip");
	static PistolMag = new SLOTTYPE("pistol magazine");
	static PistolSlideStop = new SLOTTYPE("pistol magazine");
	static PistolSelector = new SLOTTYPE("pistol fire selector");
	static PistolHammer = new SLOTTYPE("pistol hammer");
	static PistolMagRelease = new SLOTTYPE("pistol magazine release");
	static PistolTacModule = new SLOTTYPE("pistol tactical module");

	static TacRail = new SLOTTYPE("tactical rail mount");

	static ChargingHandleBack = new SLOTTYPE("charging handle back");
	static ChargingHandleSide = new SLOTTYPE("charging handle side");
	/**
	 * barrel muzzle threads for attaching supressors, shrouds, flashhiders and compensators.
	 */
	static MuzzleThreads = new SLOTTYPE("barrel muzzle threads");

	//extenders
	/**
	 * micro mount for pistol sights
	 */
	static Micro = new SLOTTYPE("pistol micro mount");
	/**
	 * picatinny rail
	 */
	static Picatinny = new SLOTTYPE("picatinny rail");
	/**
	 * russian dovetail mount
	 */
	static Dovetail = new SLOTTYPE("dovetail mount");

	constructor(name) {
		super(name);
	}
}
class FIREMODE extends Enum {
	static safe = new FIREMODE("safe");
	static auto = new FIREMODE("auto");
	static single = new FIREMODE("single");
	static burst_double = new FIREMODE("burst double");
	static burst_tripple = new FIREMODE("burst tripple");
	static burst_five = new FIREMODE("burst five");

	constructor(name) {
		super(name);
	}
}

/**
 * makes guns and manages them
 */
export class gunFactory {
	/**
	 * create a new gun from
	 * @param {string} model name of the gun model
	 * @param {string | undefined} givenName given custom name of the gun, display priority
	 * @param {boolean | undefined} renamable if the part is renamable
	 * @param {gunPart[] | undefined} partsList list of gun parts that the system will try to connect
	 * @returns {Gun}
	 */
	static newGun(
		model,
		givenName = undefined,
		renamable = true,
		partsList = []
	) {
		let slotList = [];
		return gunFactory.assembleGun(model, givenName, renamable, slotList);
	}

	/**
	 * assembles gun parts together
	 * @param {string} model name of the gun model
	 * @param {string} givenName given custom name of the gun, display priority
	 * @param {boolean} renamable if the part is renamable
	 * @param {partSlot[]} slotList list of slots
	 * @returns {Gun}
	 */
	static assembleGun(model, givenName, renamable, slotList) {
		return new Gun(model, givenName, renamable, slotList);
	}

	/**
	 * reamnes a gun if possible and returns if it was successful
	 * @param {Gun} gun gun Object
	 * @param {string} newName new name for the gun
	 * @returns {boolean} if success
	 */
	static nameGun(gun, newName) {
		if (gun.renamable) {
			gun.givenName = newName;
			return true;
		}
		return false;
	}

	/**
	 * attach a part to a slot
	 * @param {partSlot} slot
	 * @param {gunPart} child
	 * @return {boolean}
	 */
	static attach(slot, child) {
		if (slot.attachType) slot.attach(child);
	}

	/**
	 *
	 * @param {partSlot} slot
	 * @param {gunPart} part
	 * @returns {boolean}
	 */
	static attachCheck(slot, part) {
		return;
	}
}
/**
 * a slot to connect one part to another
 */
class partSlot {
	/**
	 * type of attachment needed to connect
	 * @type {SLOTTYPE}
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
	 * compatable attachment type
	 * @type {SLOTTYPE}
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

class Gun extends gunPartNamed {
	constructor(model, givenName, renamable, partSlotlist) {
		super(undefined, model, givenName, renamable, partSlotlist);
	}
}

/**
 * barrel of a gun
 */
class gunPart_Barrel extends gunPart {
	/**
	 * caliber of the barrel
	 * @type {CALIBER}
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

class gunPart_Magazine extends gunPart {
	/**
	 * caliber of the barrel
	 * @type {CALIBER}
	 */
	caliber;
	/**
	 * ammo capacity
	 * @type {number}
	 */
	capacity;
	/**
	 * ammo capacity
	 * @type {number}
	 */
	loaded;

	/**
	 *
	 * @param {number} capacity ammo capacity
	 * @param {number | loaded} loaded ammo loaded
	 */
	constructor(
		parent,
		model,
		attachType,
		partSlotlist,
		capacity,
		loaded = capacity
	) {
		super(parent, model, attachType, partSlotlist);
		this.capacity = capacity;
		this.loaded = loaded;
	}
}

class gunPart_Fireselector extends gunPart {
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
	 * @type {FIREMODE[]}
	 */
	selectorList;
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
class gunPart_Bolt extends gunPart_Top {
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
class gunPart_Slide extends gunPart_Top {
	constructor(blowback, springLoaded) {
		super(blowback, springLoaded);
	}
}

class gunPart_ChargingHandle extends gunPart_Top {
	/**
	 * if the charging handle will move with the bolt.
	 */
	reciprocating;

	folding;
}

class GunCorpP100 extends Gun {
	constructor(givenName) {
		super("GunCorp P100", givenName, true, [new partSlot(SLOTTYPE.Pistol)]);
	}
}
