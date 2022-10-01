import { Enum, MyArray } from "./helpers.js";
import {
	AmmoContainer,
	Gun,
	gunPart,
	gunPart_Magazine,
	partSlot,
	Round,
} from "./parts.js";

/**
 * gun calibers
 */
export class CALIBER extends Enum {
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
export class SLOTTYPE extends Enum {
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
	static Barrel = new SLOTTYPE("barrel");
	/**
	 * barrel muzzle threads for attaching supressors, shrouds, flashhiders and compensators.
	 */
	static MuzzleThreads = new SLOTTYPE("barrel muzzle threads");
	static Extractor = new SLOTTYPE("extractor");

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
export class FIREMODE extends Enum {
	static safe = new FIREMODE("safe", 0);
	static auto = new FIREMODE("auto", -1);
	static single = new FIREMODE("single", 1);
	static burst_double = new FIREMODE("burst double", 2);
	static burst_tripple = new FIREMODE("burst tripple", 3);
	static burst_five = new FIREMODE("burst five", 5);

	/**
	 * number of times fired
	 * @type {number}
	 */
	count;
	/**
	 *
	 * @param {number} count number of times fired
	 */
	constructor(name, count) {
		super(name);
		this.count = count;
	}
}
export class ROUNDSTATES extends Enum {
	static Ready = new ROUNDSTATES("ready");
	static Spent = new ROUNDSTATES("spent");

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
	 * @param {boolean} renamable if the part is renamable
	 * @param {gunPart[]} partsList list of gun parts that the system will try to connect
	 * @returns {Gun}
	 */
	static newGun(
		model,
		givenName = undefined,
		renamable,
		attachType,
		partsList
	) {
		let slotList = [];

		/**
		 * @type {gunPart}
		 */
		let part;
		for (let index = 0; index < partsList.length; index++) {
			part = partsList[index];
			slotList.push(new partSlot(part.attachType, part));
		}

		return gunFactory.assembleGun(
			model,
			givenName,
			renamable,
			attachType,
			slotList
		);
	}

	/**
	 * assembles gun parts together
	 * @param {string} model name of the gun model
	 * @param {string} givenName given custom name of the gun, display priority
	 * @param {boolean} renamable if the part is renamable
	 * @param {partSlot[]} slotList list of slots
	 * @returns {Gun}
	 */
	static assembleGun(model, givenName, renamable, attachType, slotList) {
		return new Gun(model, givenName, renamable, attachType, slotList);
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
	 * @param {gunPart} part
	 * @return {boolean}
	 */
	static attach(slot, part) {
		if (this.attachCheck(slot, part)) return slot.attach(part);
	}

	/**
	 *
	 * @param {partSlot} slot
	 * @param {gunPart} part
	 * @returns {boolean}
	 */
	static attachCheck(slot, part) {
		return slot.attachType == part.attachType;
	}

	/**
	 * returns type of argument given as a string
	 * @param {any} check
	 * @return {"null"|"array"|"object"}
	 */
	static is(val) {
		if (typeof val === "object") if (val == null) return "null";
		if (Array.isArray(val)) return "array";
		return "object";
	}

	//#region ammo

	/**
	 * check if you can load ammo in
	 * @param {object} target
	 * @param {CALIBER} cal
	 */
	static loadCheck(target, cal) {
		// console.log("check: ", target.caliber, cal, cal == target.caliber);
		return target.contents.length < target.capacity && cal == target.caliber;
	}

	/**
	 * @param {object} target
	 * @param {Round | Round[] | AmmoContainer | gunPart} round
	 * @returns {number} number of how many rounds contents, -1 == all given in list
	 */
	static loadAmmo(target, round) {
		switch (this.is(round)) {
			case "array":
				if (!this.loadCheck(target, round[0].caliber)) break;
				if (target.contents.length + round.length > target.capacity) {
					//check can load
					//check if too many bullets

					let index;
					for (index = 0; target.contents.length < target.capacity; index++) {
						target.contents.push(round[index]);
					}
					return index;
				} else {
					target.contents.push(...round);
					return -1;
				}
			case "object":
				if (round instanceof Round) {
					if (this.loadCheck(target, round.caliber)) break;
					target.contents.push(round);
					return 1;
				} else {
					return this.loadAmmo(target, round.contents);
				}
		}
		return 0;
	}

	//#endregion
}
