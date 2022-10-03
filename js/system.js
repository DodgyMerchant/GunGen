import { Enum, MyArray } from "./helpers.js";
import * as Parts from "./parts.js";

/**
 * gun calibers
 */
export class CALIBER extends Enum {
	static CAL9 = new CALIBER("cal9", "9×19mm Parabellum", "9mm", 1);
	static CAL45 = new CALIBER("cal45", ".45 Auto", ".45", 0.8);
	static CAL50 = new CALIBER("cal50", ".50 Action Express", ".50 AE", 0.7);

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

	constructor(name, fullname, shortname, ammoMult) {
		super(name);
		this.fullname = fullname;
		this.ammoMult = ammoMult;
	}
	toString() {
		return this.fullname;
	}
}
export class SLOTTYPE extends Enum {
	static PistolSlide = new SLOTTYPE("stPistolSlide","pistol slide"); // prettier-ignore
	static PistolBolt = new SLOTTYPE("stPistolBolt","pistol bolt"); // prettier-ignore
	static PistolGrip = new SLOTTYPE("stPistolGrip","pistol grip"); // prettier-ignore
	static PistolMag = new SLOTTYPE("stPistolMagazine","pistol magazine"); // prettier-ignore
	static PistolSlideStop = new SLOTTYPE("stPistolMagazine","pistol magazine"); // prettier-ignore
	static PistolSelector = new SLOTTYPE("stPistolFireSelector","pistol fire selector"); // prettier-ignore
	static PistolHammer = new SLOTTYPE("stPistolHammer","pistol hammer"); // prettier-ignore
	static PistolMagRelease = new SLOTTYPE("stPistolMagazineRelease","pistol magazine release"); // prettier-ignore
	static PistolTacModule = new SLOTTYPE("stPistolTacticalModule","pistol tactical module"); // prettier-ignore

	static TacRail = new SLOTTYPE("stTacticalRailMount","tactical rail mount"); // prettier-ignore

	static ChargingHandleBack = new SLOTTYPE("stChargingHandleBack","charging handle back"); // prettier-ignore
	static ChargingHandleSide = new SLOTTYPE("stChargingHandleSide","charging handle side"); // prettier-ignore
	static Barrel = new SLOTTYPE("stBarrel","barrel"); // prettier-ignore
	/**
	 * barrel muzzle threads for attaching supressors, shrouds, flashhiders and compensators.
	 */
	static MuzzleThreads = new SLOTTYPE("stBarrelMuzzleThreads","barrel muzzle threads"); // prettier-ignore
	static Extractor = new SLOTTYPE("stExtractor", "extractor"); // prettier-ignore

	//extenders
	/**
	 * micro mount for pistol sights
	 */
	static Micro = new SLOTTYPE("stPistolMicroMount","pistol micro mount"); // prettier-ignore
	/**
	 * picatinny rail
	 */
	static Picatinny = new SLOTTYPE("stPicatinnyRail","picatinny rail"); // prettier-ignore
	/**
	 * russian dovetail mount
	 */
	static Dovetail = new SLOTTYPE("stDovetailMount","dovetail mount"); // prettier-ignore

	/**
	 * name of the slot types
	 */
	fullname;

	constructor(name, fullname) {
		super(name);
		this.fullname = fullname;
	}
}
export class FIREMODE extends Enum {
	static safe = new FIREMODE("fmSafe", "safe", 0);
	static auto = new FIREMODE("fmAuto", "auto", -1);
	static single = new FIREMODE("fmSingle", "single", 1);
	static burst_double = new FIREMODE("fmBurstDouble", "burst double", 2);
	static burst_tripple = new FIREMODE("fmBurstTripple", "burst tripple", 3);
	static burst_five = new FIREMODE("fmBurstFive", "burst five", 5);

	/**
	 * number of times fired
	 * @type {number}
	 */
	count;
	/**
	 * name of the slot types
	 */
	fullname;
	/**
	 *
	 * @param {number} count number of times fired
	 */
	constructor(name, fullname, count) {
		super(name);
		this.count = count;
		this.fullname = fullname;
	}
}
export class ROUNDSTATES extends Enum {
	static Ready = new ROUNDSTATES("rsReady", "normal round");
	static Spent = new ROUNDSTATES("rsSpent", "a spent cartridge");

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
	 * @param {string | object} model name of the gun model. config object
	 * @param {string | undefined} givenName given custom name of the gun, display priority
	 * @param {boolean} renamable if the part is renamable
	 * @param {Parts.gunPart[]} partsList list of gun parts that the system will try to connect
	 * @returns {Parts.Gun}
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
		 * @type {Parts.gunPart}
		 */
		let part;
		for (let index = 0; index < partsList.length; index++) {
			part = partsList[index];
			slotList.push(new Parts.partSlot(part.attachType, part));
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
	 * @param {Parts.partSlot[]} slotList list of slots
	 * @returns {Parts.Gun}
	 */
	static assembleGun(model, givenName, renamable, attachType, slotList) {
		return new Parts.Gun(model, givenName, renamable, attachType, slotList);
	}

	/**
	 * reamnes a gun if possible and returns if it was successful
	 * @param {Parts.Gun} gun gun Object
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

	//#region config objs

	/** validate an enum variable in a config object */
	static ValEnum(obj, str) {
		if (obj[str])
			if (typeof obj[str] === "string") obj[str] = Enum.find(conf.caliber);
	}

	static ConfValidate(conf) {
		//caliber

		this.ValEnum(conf, "attachType");
		this.ValEnum(conf, "caliber");
	}

	/**
	 *
	 * @param {object} target
	 * @param {object} conf
	 */
	static ConfApply(target, conf) {
		let arr = Object.keys(conf);
		let str;
		for (let i = 0; i < arr.length; i++) {
			str = arr[i];
			target[str] = conf[str];
		}
	}
	//#endregion
	//#region supplied functions

	/**
	 * attach a part to a slot
	 * @param {Parts.partSlot} slot
	 * @param {Parts.gunPart} part
	 * @return {boolean}
	 */
	static attach(slot, part) {
		if (this.attachCheck(slot, part)) return slot.attach(part);
	}

	/**
	 *
	 * @param {Parts.partSlot} slot
	 * @param {Parts.gunPart} part
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

	//#endregion
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
	 * @param {Parts.Round | Parts.Round[] | Parts.AmmoContainer | Parts.gunPart} round
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
				if (round instanceof Parts.Round) {
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
