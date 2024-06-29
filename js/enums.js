import { Enum } from "./helpers.js";

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
  static PistolSlide = new SLOTTYPE("stPistolSlide", "pistol slide");
  static PistolBolt = new SLOTTYPE("stPistolBolt", "pistol bolt");
  static PistolGrip = new SLOTTYPE("stPistolGrip", "pistol grip");
  static PistolMag = new SLOTTYPE("stPistolMagazine", "pistol magazine");
  static PistolSlideStop = new SLOTTYPE("stPistolMagazine", "pistol magazine");
  static PistolSelector = new SLOTTYPE("stPistolFireSelector", "pistol fire selector");
  static PistolHammer = new SLOTTYPE("stPistolHammer", "pistol hammer");
  static PistolMagRelease = new SLOTTYPE("stPistolMagazineRelease", "pistol magazine release");
  static PistolTacModule = new SLOTTYPE("stPistolTacticalModule", "pistol tactical module");

  static TacRail = new SLOTTYPE("stTacticalRailMount", "tactical rail mount");

  static ChargingHandleBack = new SLOTTYPE("stChargingHandleBack", "charging handle back");
  static ChargingHandleSide = new SLOTTYPE("stChargingHandleSide", "charging handle side");
  static Barrel = new SLOTTYPE("stBarrel", "barrel");
  /**
   * barrel muzzle threads for attaching supressors, shrouds, flashhiders and compensators.
   */
  static MuzzleThreads = new SLOTTYPE("stBarrelMuzzleThreads", "barrel muzzle threads");
  static Extractor = new SLOTTYPE("stExtractor", "extractor");

  //extenders
  /**
   * micro mount for pistol sights
   */
  static Micro = new SLOTTYPE("stPistolMicroMount", "pistol micro mount");
  /**
   * picatinny rail
   */
  static Picatinny = new SLOTTYPE("stPicatinnyRail", "picatinny rail");
  /**
   * russian dovetail mount
   */
  static Dovetail = new SLOTTYPE("stDovetailMount", "dovetail mount");

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
