import * as Components from "./composition.js";
import { CALIBER, FIREMODE, ROUNDSTATES, SLOTTYPE } from "./enums.js";
import MyMath from "../myJS/MyMath.js";
import { Game } from "./system.js";
import MyHTML from "../myJS/MyHTML.js";

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
 * @prop {Components.CompAttachHost} [parent] parent object this object os attached to
 * @prop {Components.CompAttachable} [child] the child to attach, undefined if no child
 * @prop {SLOTTYPE} [attachType] type of attachment needed to connect
 * @prop {number} [zIndex] z index of the connected child.
 * @prop {boolean} [detachable] if child is detachable by direct action (f.e. player richt mouse click).
 * @prop {number} attachX attach point x axis position in unscaled pixels relativ to gun part base. Scale referst to the game scale.
 * @prop {number} attachY attach point y axis position in unscaled pixels relativ to gun part base. Scale referst to the game scale.
 */
/**
 * a slot to connect one part to another.
 * in the whole attaching/detatching process it takes a passive role.
 */
export class partSlot {
  /**
   * parent object this object os attached to
   * @type {gunPart & Components.CompAttachHost | undefined}
   */
  parent;

  /**
   * type of attachment needed to connect
   * @type {SLOTTYPE}
   */
  attachType;

  /**
   * the connected part
   * @type {gunPart & Components.CompAttachable | undefined }
   */
  child;

  /**
   * attach point x axis position in unscaled pixels relativ to gun part base.
   * Scale referst to the game scale.
   * @type {number}
   */
  attachX;

  /**
   * attach point y axis position in unscaled pixels relativ to gun part base.
   * Scale referst to the game scale.
   * @type {number}
   */
  attachY;

  /**
   * dictates of connected childs z index will be over or under the parent. Should not be zero.
   * @type {number}
   */
  zIndex = 0;

  /**
   * if child is detachable by direct action (f.e. player richt mouse click).
   */
  detachable = true;

  /**
   * a attachment slot on another part.
   * @param {SlotConfig} config
   */
  constructor(config) {
    this.parent = config.parent;
    this.attachX = config.attachX;
    this.attachY = config.attachY;

    if (config.child && !config.attachType) {
      //auto get attach type by child
      this.attachType = config.child.attachType;
    } else {
      this.attachType = config.attachType;
    }

    if (config.detachable !== undefined) this.detachable = config.detachable;

    // adding children needed to be delayed until the base obj is ready. so it can add the html element.
    if (config.child) {
      if (this.parent) config.child.Attach(this);
      else this.child = config.child;
    }

    if (config.zIndex) this.zIndex = config.zIndex;
  }

  /**
   * set child variable to gunpart.
   * perform this action from child.
   * @param {gunPart & Components.CompAttachable} part
   * @returns {boolean} is successful
   */
  _attach(part) {
    if (!this.child || this.child == part) {
      this.child = part;
      return true;
    }
    return false;
  }

  /**
   * detach connected child.
   * perform this action from child.
   * @param {gunPart & Components.CompAttachable} part
   * @returns {boolean} is successful
   */
  _detach(part) {
    this.child = undefined;
    return true;
  }

  /**
   * perform attach on child and itself.
   * @param {gunPart & Components.CompAttachable} part part to detach
   * @returns {boolean} is successful
   */
  Attach(part) {
    if (!this.child) return false;
    return this.child.Attach(part);
  }

  /**
   * perform detatch on child and itself.
   * @param {gunPart & Components.CompAttachable} part part to detach
   * @returns {boolean} is successful
   */
  Detach(part) {
    if (!this.child) return false;
    return this.child.Detach();
  }

  toString() {
    return `slot: ${attachType}`;
  }
}

export class htmlObj {
  /**
   * @type {HTMLElement}
   */
  htmlElement;
  /**
   * width
   */
  get Width() {
    return this.htmlElement.getBoundingClientRect().width;
    // return parseFloat(MyHTML.getPropertyFlt(this.htmlElement, "width"));
    // return parseFloat(this.htmlElement.style.width);
  }
  /**
   * width
   */
  set Width(value) {
    this.htmlElement.style.width = value + "px";
  }
  /**
   * Height
   */
  get Height() {
    return this.htmlElement.getBoundingClientRect().height;
    // return parseFloat(MyHTML.getPropertyFlt(this.htmlElement, "height"));
    // return parseFloat(this.htmlElement.style.height);
  }
  /**
   * Height
   */
  set Height(value) {
    this.htmlElement.style.height = value + "px";
  }

  _zIndex;
  /**
   * read only. tracks the z index.
   * @type {number}
   */
  get zIndex() {
    return this._zIndex;
  }
  set zIndex(value) {
    this._zIndex = value;
    // set style
    // if (value == 0) this.htmlElement.style.zIndex = "auto";
    // else
    this.htmlElement.style.zIndex = value + "";
  }

  /**
   * base obj
   * @param {HTMLElement} htmlElement
   */
  constructor(htmlElement, zIndex) {
    this.htmlElement = htmlElement;
    this.zIndex = zIndex;
  }
}

/**
 * @typedef {object} PartConf properties for the gunPart objects config Object
 * @property {Game} game name of the gun model
 * @property {string} modelName name of the gun model
 */
/**
 * base gun part of a gun.
 */
export class gunPart extends htmlObj {
  /**
   * refrence for game instance.
   */
  game;
  /**
   * name of the gun model
   * @type {string}
   */
  modelName;

  /**
   * base gun part of a gun
   * @param {PartConf} conf config objects
   * @param {HTMLElement} htmlElement config objects
   * @param {number} [zIndex] z index of the object
   */
  constructor(conf, htmlElement, zIndex) {
    super(
      htmlElement,
      zIndex !== undefined ? zIndex : conf.game.GameSpace.ZIndDef
    );
    this.game = conf.game;
    this.modelName = conf.modelName;
  }

  /**
   * displays/return the name of the gunpart
   * @returns {string} name of gunpart
   */
  GetDisplayName() {
    return this.modelName;
  }

  toString() {
    return `${this.modelName}`;
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

  constructor(parent, modelName, partSlotlist, caliber, length) {
    super(parent, modelName, partSlotlist);
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
    } else if (
      oldPos > this.feedPosition ||
      this.position <= this.feedPosition
    ) {
      console.log("EJECT ROUND");
    }
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
