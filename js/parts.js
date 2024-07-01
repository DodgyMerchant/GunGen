import { Comp_AttachHost } from "./composition.js";
import { CALIBER, FIREMODE, ROUNDSTATES, SLOTTYPE } from "./enums.js";
import { MyArray, MyMath } from "./helpers.js";
import { GunFactory } from "./system.js";

const ATTACH_LEVEL = 1;

/**
 * @typedef {object} RoundConfig config object for a Round Object
 * @property {CALIBER} caliber caliber of the round
 * @property {ROUNDSTATES} [state] state the round is in
 */
/**
 * a round to shoot
 */
export class Round {
  /**
   * caliber
   * @type {CALIBER}
   */
  caliber;

  /**
   * @type {ROUNDSTATES}
   */
  state;

  /**
   * make a round
   * @param {RoundConfig} config config object
   */
  constructor(config) {
    this.caliber = config.caliber;
    if (!config.state) this.state = ROUNDSTATES.Ready;
    else {
      this.state = config.state;
    }
  }
}

/**
 * @typedef {object} SlotConfig config object for a slot object
 * @prop {Comp_AttachHost | undefined} parent parent object this object os attached to
 * @prop {import("./composition.js").CompAttachable | undefined} child the child to attach, undefined if no child
 * @prop {SLOTTYPE | undefined} attachType type of attachment needed to connect
 */
/**
 * a slot to connect one part to another.
 * in the whole attaching/detatching process it takes a passive role.
 */
export class partSlot {
  /**
   * parent object this object os attached to
   * @type {Comp_AttachHost | undefined}
   */
  parent;

  /**
   * type of attachment needed to connect
   * @type {SLOTTYPE}
   */
  attachType;

  /**
   * the connected part
   * @type {import("./composition.js").CompAttachable | undefined }
   */
  child;

  /**
   * a attachment slot on another part.
   * @param {SlotConfig} config
   */
  constructor(config) {
    this.parent = config.parent;

    if (config.child && !config.attachType) {
      //auto get attach type by child

      this.attachType = config.child.attachType;
    } else {
      this.attachType = config.attachType;
    }

    if (config.child) {
      config.child.Attach(this);
    }
  }

  /**
   * detach connected child.
   * perform this action from child.
   * @param {import("./composition.js").CompAttachable} part
   * @returns {boolean} is successful
   */
  detach(part) {
    this.child = undefined;
    return true;
  }

  /**
   * set child variable to gunpart
   * perform this action from child.
   * @param {}part
   * @returns {boolean} is successful
   */
  attach(part) {
    if (!this.child) {
      this.child = part;
      return true;
    }
    return false;
  }

  toString() {
    return `slot: ${attachType}`;
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
    let a = { i: 0 };
    a;
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
 * @typedef {object} PartConf properties for the gunPart objects config Object
 * @property {string} model name of the gun model
 */
/**
 * base gun part of a gun
 */
export class gunPart {
  /**
   * name of the gun model
   * @type {string}
   */
  model;

  /**
   * base gun part of a gun
   *
   *
   *
   * @param {PartConf} conf config objects
   */
  constructor(conf) {
    this.model = conf.model;
  }

  /**
   * displays/return the name of the gunpart
   * @returns {string} name of gunpart
   */
  GetDisplayName() {
    return this.model;
  }

  toString() {
    return `GunPart: ${this.model}`;
  }

  toJson() {
    //TODO make to jason
    let obj = {};
  }
}

/**
 * barrel of a gun
 */
export class gunPart_Barrel extends gunPart {
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
   * @type {FIREMODE[]}
   */
  selectorList;
}

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
   * if the bolt will push forward when in a backward position.
   * @type {boolean}
   */
  springLoaded;

  /**
   * position of the top.
   * 0 being fully pulled back.
   * 1 being fully pushed forward.
   * @type {number}
   */
  position = 1;

  /**
   * procentual value of the feed position of the extractor
   * @type {number}
   */
  feedPosition = 0.2;

  /**
   * procentual value for the position extractor to eject the used shell casing.
   */
  ejectPosition = 0.3;

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
    } else if (oldPos > this.feedPosition || this.position <= this.feedPosition) {
      console.log("EJECT ROUND");
    }
  }
}
/**
 * @typedef {object} BoltProp properties for the gunPart_Bolt objects config Object.
 * @property {boolean} openBolt open or closed bolt
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
