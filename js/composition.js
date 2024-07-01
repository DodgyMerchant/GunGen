import { CALIBER, SLOTTYPE } from "./enums.js";
import { Round, gunPart, partSlot } from "./parts.js";
import { GunFactory } from "./system.js";

/**
 * @typedef {object} CompNamedConf properties for the gunPartNamed objects config Object
 * @property {string} givenName given custom name of the gun, display priority
 * @property {boolean} renamable if the part is renamable
 */
/**
 * component named gunparts
 */
export class Comp_Named {
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
   * @param {CompNamedConf} conf
   */
  constructor(conf) {
    this.givenName = conf.givenName;
    this.renamable = conf.renamable;
  }

  /**
   * returns if part is named
   * @returns {boolean}
   */
  NameStatus = () => {
    if (!this.givenName) return false;
    return true;
  };

  GetDisplayName = () => {
    return this.NameStatus() ? this.givenName : this.model;
  };
}

/**
 * @typedef {object} CompBulContConf the CompBulletContainer objects config object
 * @property {string | CALIBER} caliber caliber enum name
 * @property {number} capacity ammo capacity
 * @property {Round[] | RoundConfig[] | RoundConfig | undefined} contents array of contents bullets
 */
/**
 * component for something containing bullets.
 */
export class Comp_BulletContainer {
  /**
   * caliber
   * @type {CALIBER}
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
   * @param {CompBulContConf} conf config objects
   */
  constructor(conf) {
    this.caliber = conf.caliber;
    this.capacity = conf.capacity;

    let cont = conf.contents;
    if (cont)
      //check type of arguemnt
      switch (GunFactory.is(cont)) {
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
   * check if capacity full.
   */
  LoadCheckCap = () => {
    return this.contents.length < this.capacity;
  };

  /**
   * check caliber compatability.
   * @param {CALIBER} cal
   */
  LoadCheckCal = (cal) => {
    return cal == this.caliber;
  };

  /**
   * check if you can load ammo in
   * @param {CALIBER} cal
   */
  LoadCheck = (cal) => {
    // console.log("check: ", this.caliber, cal, cal == this.caliber);
    return this.LoadCheckCap() && this.LoadCheckCal(cal);
  };

  /**
   * load in ammo
   * @param {Round | Round[] | Parts.gunPart} round
   * @returns {number} number of how many rounds contents, -1 == all given in list
   */
  LoadAmmo = (round) => {
    switch (GunFactory.is(round)) {
      case "array":
        //check caliber
        if (!this.LoadCheck(round[0].caliber)) break;
        //check if too many bullets
        if (this.contents.length + round.length > this.capacity) {
          for (let index = 0; this.contents.length < this.capacity; index++) {
            this.contents.push(round[index]);
          }
          return index;
        } else {
          this.contents.push(...round);
          return -1;
        }
      case "object":
        if (round instanceof Round) {
          if (this.LoadCheck(this, round.caliber)) break;
          this.contents.push(round);
          return 1;
        } else {
          // return this.LoadAmmo(this, round.contents);
        }
    }
    return 0;
  };

  /**
   * extract one bullet
   */
  Extract = () => {
    return this.contents.pop();
  };
}

/**
 * @typedef {object} CompBulletHoldConf grabbable config obj.
 * @property {CALIBER} caliber caliber of the barrel
 * @property {partSlot | Comp_BulletContainer} source source of ammunition. If mag is detachable supply the attach slot.
 * @property {Round | undefined} heldRound held round
 */
/**
 * Holds a bullet
 */
export class Comp_BulletHolder {
  /**
   * caliber of the barrel
   * @type {CALIBER}
   */
  caliber;

  /**
   * source of ammunition.
   * If mag is detachable supply the attach slot.
   * @type {partSlot | Comp_BulletContainer}
   */
  source;

  /**
   * held round
   * @type {Round | undefined}
   */
  heldRound;

  /**
   * Holds a bullet
   * @param {CompBulletHoldConf} conf
   */
  constructor(conf) {
    this.caliber = conf.caliber;
    this.source = conf.source;
    this.heldRound = conf.heldRound;
  }

  /**
   *
   */
  Feed = () => {
    let ammoSource;
    if (this.source instanceof partSlot) ammoSource = this.source.child;
    else ammoSource = this.source;

    if (this.heldRound != undefined || !ammoSource) return;

    if (ammoSource.caliber == this.caliber) {
      this.heldRound = this.source.Extract();
    }
  };

  /**
   *
   * @returns {Round | undefined} eject held round
   */
  Eject = () => {
    if (!this.heldRound) return undefined;
    let round = this.heldRound;
    this.heldRound = undefined;
    return round;
  };
}

/**
 * @typedef {object} CompGrabConf grabbable config obj.
 * @property {boolean} grabEnabled gabbable right now.
 */
/**
 * part that is grabbable by the mouse in some way.
 * a grabbable point that wont deatatch the part from the gun
 */
export class Comp_Grabbable {
  /**
   * can be crabbed right now
   * @type {boolean}
   */
  grabEnabled = true;
  /**
   * is grabbed right now
   * @type {boolean}
   */
  grabActive = false;

  /**
   * part that is grabbable by the mouse in some way.
   * a grabbable point that wont deatatch the part from the gun
   *
   * @param {CompGrabConf} conf
   */
  constructor(conf) {
    this.grabEnabled = conf.grabEnabled;
  }
}

/**
 * @typedef {object} CompAttachableConf config obj for attachable parts
 * @property {partSlot} parent parent this gun part is attached to
 * @property {string | SLOTTYPE} attachType compatable attachment types
 */
/**
 * component for making a part attachable to another.
 */
export class Comp_Attachable {
  /**
   * parent this gun part is attached to
   * @type {partSlot}
   */
  parent;

  /**
   * compatable attachment types
   * @type {SLOTTYPE[]}
   */
  attachType;

  /**
   * grabbable
   * @param {CompAttachableConf} conf
   */
  constructor(conf) {
    this.attachType = conf.attachType;

    if (conf.parent) {
      this.Attach(conf.parent);
    }
  }

  /**
   * attach to a part slot.
   * checks attach type.
   * @param {partSlot} target to attach to
   * @return {boolean} if attached successfully
   */
  Attach = (target) => {
    if (!this.parent && target.attachType == this.attachType && target.attach(this)) {
      this.parent = target;
      target.attach(this);
      return true;
    }

    return false;
  };

  Detach = () => {
    if (!this.parent) return;

    this.parent.detach(this);
    this.parent = undefined;
  };
}

/**
 * @typedef {object} CompAttHostConf properties for the component that can host attachments.
 * @property {partSlot[]} partSlotlist the Slots to connect parts to. Will set parent of child slots.
 */
/**
 * component for a part that can host attachments.
 */
export class Comp_AttachHost {
  /**
   * the parts that make up the gun
   * @type {partSlot[]}
   */
  partSlotlist;

  /**
   * hosts attach slots
   * @param {CompAttHostConf} conf config objects
   */
  constructor(conf) {
    this.partSlotlist = conf.partSlotlist;

    this.partSlotlist.forEach((slot) => {
      slot.parent = this;
    });
  }
}
