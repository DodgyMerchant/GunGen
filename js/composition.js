import MyHTML from "../myJS/MyHTML.js";
import { CALIBER, SLOTTYPE } from "./enums.js";
import InteractionSystem from "./InteractionSystem.js";
import { Round, gunPart, partSlot } from "./parts.js";

const GrabTargetClass = "GunGen-grabTarget";
const GrabSourceClass = "GunGen-grabSource";
const AttachableClass = "GunGen-attachable";

/**
 * @typedef {object} CompDisplayableConf display config objj
 * @property {string} imgSrc
 */
/**
 * @typedef { {
 * htmlDisplayElement: HTMLImageElement;
 * imgLoadPromise: Promise<void>;
 * src: string;
 * }} CompDisplayable
 */
/**
 * making the part displayable.
 * @param {gunPart} base target obj
 * @param {CompDisplayableConf} conf config objects
 * @returns {CompDisplayable} component for something containing bullets.
 */
export const Comp_Displayable = (base, conf) => {
  // create html
  let img = document.createElement("img");
  img.classList.add("GunGen-sprite");
  base.htmlElement.appendChild(img);

  // img.src = conf.imgSrc;

  let obj = {
    /**
     *
     */
    htmlDisplayElement: img,

    /**
     * Promise that is fulfilled of the image is loaded.
     * @type {Promise<void>}
     */
    imgLoadPromise: undefined,

    get src() {
      return this.htmlDisplayElement.src;
    },
    set src(str) {
      if (this.htmlDisplayElement.src != str) {
        this.htmlDisplayElement.src = str;
        this._resetPromise();
      }
    },

    _resetPromise() {
      this.imgLoadPromise = MyHTML.createPromiseFromDomEvent(
        this.htmlDisplayElement,
        "load"
      ).then(() => {
        console.log("img load!");
        let img = this.htmlDisplayElement;
        img.style.width = img.naturalWidth * base.game.Scale + "px";
        img.style.height = img.naturalHeight * base.game.Scale + "px";
      });
    },
  };

  obj.src = conf.imgSrc;

  return obj;
};

/**
 * @typedef {object} CompBulContConf the CompBulletContainer objects config object
 * @property {string | CALIBER} caliber caliber enum name
 * @property {number} capacity ammo capacity
 * @property {Round[] | RoundConfig[] | RoundConfig | undefined} contents array of contents bullets
 */
/**
 * @typedef { {
 * caliber: CALIBER;
 * capacity: number;
 * contents: Round[];
 * LoadCheckCap(): boolean;
 * LoadCheckCal(cal: CALIBER): boolean;
 * LoadCheck(cal: CALIBER): boolean;
 * LoadAmmo(round: Round | Round[] | gunPart): number;
 * Extract(): Round | undefined;
 * }} CompBulletContainer
 */
/**
 * make a mag
 * @param {gunPart} base target obj
 * @param {CompBulContConf} conf config objects
 * @returns {CompBulletContainer} component for something containing bullets.
 */
export const Comp_BulletContainer = (base, conf) => {
  let obj = {
    /**
     * caliber
     * @type {CALIBER}
     */
    caliber: conf.caliber,
    /**
     * ammo capacity
     * @type {number}
     */
    capacity: conf.capacity,
    /**
     * array of contents bullets
     * @type {Round[]}
     */
    contents: [],

    /**
     * check if capacity full.
     */
    LoadCheckCap() {
      return this.contents.length < this.capacity;
    },

    /**
     * check caliber compatability.
     * @param {CALIBER} cal
     */
    LoadCheckCal(cal) {
      return cal == this.caliber;
    },

    /**
     * check if you can load ammo in
     * @param {CALIBER} cal
     */
    LoadCheck(cal) {
      // console.log("check: ", this.caliber, cal, cal == this.caliber);
      return this.LoadCheckCap() && this.LoadCheckCal(cal);
    },

    /**
     * load in ammo
     * @param {Round | Round[] | gunPart} round
     * @returns {number} number of how many rounds contents, -1 == all given in list
     */
    LoadAmmo(round) {
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
            // return this.LoadAmmo(round.contents);
          }
      }
      return 0;
    },

    /**
     * extract one bullet
     */
    Extract() {
      return this.contents.pop();
    },
  };

  let cont = conf.contents;
  if (cont)
    //check type of arguemnt
    switch (GunFactory.is(cont)) {
      case "object":
        //one config obj
        for (let index = 0; index < conf.capacity; index++) {
          obj.contents.push(new Round(cont));
        }
        break;
      case "array":
        //list of bullet objects
        if (cont[0] instanceof Round) obj.contents = cont;
        // list filled with configs
        else
          for (let i = 0; i < cont.length; i++) {
            obj.contents.push(new Round(cont[i]));
          }
        break;
      default:
        // obj.contents = [];
        break;
    }

  return obj;
};

/**
 * @typedef {object} CompBulletHoldConf grabbable config obj.
 * @property {CALIBER} caliber caliber of the barrel
 * @property {partSlot | CompBulletContainer} source source of ammunition. If mag is detachable supply the attach slot.
 * @property {Round} [heldRound] held round
 */
/**
 * @typedef { {
 *  caliber: CALIBER;
 *  source: partSlot | CompBulletContainer;
 *  heldRound: Round | undefined;
 *  Feed(): Round | undefined;
 *  Eject(): Round | undefined;
 * }} CompBulletHolder
 */
/**
 * Holds a bullet
 * @param {gunPart} base
 * @param {CompBulletHoldConf} conf
 * @returns {CompBulletHolder}
 */
export const Comp_BulletHolder = (base, conf) => {
  let obj = {
    /**
     * caliber of the barrel
     * @type {CALIBER}
     */
    caliber: conf.caliber,

    /**
     * source of ammunition.
     * If mag is detachable supply the attach slot.
     * @type {partSlot | CompBulletContainer}
     */
    source: conf.source,

    /**
     * held round
     * @type {Round | undefined}
     */
    heldRound: conf.heldRound,

    /**
     * @returns {Round | undefined} return held round.
     */
    Feed() {
      /**
       * @type {CompBulletContainer}
       */
      let ammoSource;
      if (this.source instanceof partSlot) ammoSource = this.source.child;
      else ammoSource = this.source;

      if (this.heldRound != undefined || !ammoSource) return;

      if (ammoSource.caliber == this.caliber) {
        this.heldRound = ammoSource.Extract();
      }
      return this.heldRound;
    },

    /**
     *
     * @returns {Round | undefined} returns ejected round
     */
    Eject() {
      if (!this.heldRound) return undefined;
      let round = this.heldRound;
      this.heldRound = undefined;
      return round;
    },
  };

  return obj;
};

/**
 * @typedef {object} CompGrabConf grabbable config obj.
 * @property {{x:number, y:number, w:number, h:number}} [handleDimensions] grabbable area dimenesions. leave empty for entire part.
 * @property {gunPart} [grabTarget] target of movement. leave undefind to make this components gunpart grabbale.
 * @property {HTMLElement} [restrictions] restrict movement to element dimensions.
 * @property {boolean} [grabHosted] grabbable if connected to a host. default true
 */
/**
 * @typedef {{
 * htmlGrabElement: HTMLElement;
 * grabHosted: boolean;
 * grabCheck(): boolean;
 *}} CompGrabbable
 */
/**
 * part that is grabbable by the mouse in some way.
 * a grabbable point that wont deatatch the part from the gun
 *
 * @param {gunPart} base
 * @param {CompGrabConf} conf
 * @returns {CompGrabbable}
 */
export const Comp_Grabbable = (base, conf) => {
  let obj = {
    /**
     * @type {HTMLElement}
     */
    htmlGrabElement: undefined,

    /**
     * grabbable if connected to a host.
     */
    grabHosted: conf.grabHosted ? conf.grabHosted : false,

    /**
     * is grabbed right now
     */
    grabCheck() {
      return InteractionSystem.GetDraggedObjs().indexOf(this.htmlElement) != -1;
    },
  };

  // make target grabbable
  let moveTarget = conf.grabTarget
    ? conf.grabTarget.htmlElement
    : base.htmlElement;

  // make target grabbable
  moveTarget.classList.add(GrabTargetClass);

  // set grabHost
  if (typeof conf.grabHost !== "undefined") obj.grabHost = conf.grabHost;

  // ----- create handle -----
  let grab;

  //create handle if handle dimensions are specified. If not the base elelemnt will be the handle.
  if (conf.handleDimensions) {
    // create handle
    grab = document.createElement("div");
    base.htmlElement.appendChild(grab);

    grab.style.left = conf.handleDimensions.x * base.game.Scale + "px";
    grab.style.top = conf.handleDimensions.y * base.game.Scale + "px";
    grab.style.width = conf.handleDimensions.w * base.game.Scale + "px";
    grab.style.height = conf.handleDimensions.h * base.game.Scale + "px";
  } else {
    grab = base.htmlElement;
  }

  grab.classList.add(GrabSourceClass);
  obj.htmlGrabElement = grab;

  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  var button = undefined;

  var restTarget =
    conf.restrictions !== undefined
      ? conf.restrictions
      : base.game.GameSpace.HtmlElement;

  /**
   *
   * @param {MouseEvent} ev
   */
  function dragMouseDown(ev) {
    ev = ev || window.event;
    // ev.preventDefault();

    switch (ev.button) {
      case 2: // right mb
        if (base.parent?.detachable !== true) {
          break;
        }
        base.Detach();
      case 0: // left mb
        pos3 = ev.pageX;
        pos4 = ev.pageY;

        document.addEventListener("mouseup", closeDragElement);
        document.addEventListener("mousemove", elementDrag);

        InteractionSystem._addDraggable(base);

        button = ev.button;
        break;

      default:
        break;
    }
  }

  /**
   *
   * @param {MouseEvent} ev
   */
  function elementDrag(ev) {
    ev = ev || window.event;
    // ev.preventDefault();

    //check for parent drag status
    // if (base.parent?.grabHosted !== true) {
    //   closeDragElement(ev);
    //   return;
    // }

    pos1 = ev.pageX - pos3;
    pos2 = ev.pageY - pos4;
    pos3 = ev.pageX;
    pos4 = ev.pageY;

    // set the element's new position:
    InteractionSystem.MoveElBy(
      moveTarget,
      pos1,
      pos2,
      restTarget.getBoundingClientRect()
    );
  }

  /**
   *
   * @param {MouseEvent} ev
   */
  function closeDragElement(ev) {
    // stop moving when mouse button is released:

    if (ev.button != button) return;

    document.removeEventListener("mouseup", closeDragElement);
    document.removeEventListener("mousemove", elementDrag);

    InteractionSystem._removeDraggable(base);
    button = undefined;
  }

  InteractionSystem.MakeElementInteractable(dragMouseDown, moveTarget, grab);

  return obj;
};

/**
 * @typedef {object} CompAttachableConf config obj for attachable parts
 * @prop {partSlot} [parent] parent this gun part is attached to
 * @prop {SLOTTYPE} attachType compatable attachment types
 * @prop {number} attachX attach point x axis position in unscaled pixels relativ to gun part base. Scale referst to the game scale.
 * @prop {number} attachY attach point y axis position in unscaled pixels relativ to gun part base. Scale referst to the game scale.
 *
 */
/**
 * @typedef {{
 * parent: partSlot;
 * attachType: SLOTTYPE;
 * attachX: number;
 * attachY: number;
 * CheckAttached(): boolean;
 * Attach(target: partSlot): boolean;
 * Detach(): boolean;
 * }} CompAttachable
 */
/**
 *
 * @param {gunPart} base target obj
 * @param {CompAttachableConf} conf
 * @returns {CompAttachable} component for making a part attachable to another.
 */
export const Comp_Attachable = (base, conf) => {
  let obj = {
    /**
     * parent this gun part is attached to
     * @type {partSlot}
     */
    parent: undefined,

    /**
     * compatable attachment types
     * @type {SLOTTYPE}
     */
    attachType: conf.attachType,

    /**
     * attach point x axis position in unscaled pixels relativ to gun part base.
     * Scale referst to the game scale.
     * @type {number}
     */
    attachX: conf.attachX,

    /**
     * attach point y axis position in unscaled pixels relativ to gun part base.
     * Scale referst to the game scale.
     * @type {number}
     */
    attachY: conf.attachY,

    /**
     * returns if attached.
     * @returns returns if attached bool.
     */
    CheckAttached() {
      return this.parent !== undefined;
    },

    /**
     * attach to a part slot.
     * checks attach type.
     * @param {partSlot} target to attach to
     * @return {boolean} if attached successfully
     */
    Attach(target) {
      if (!this.CheckAttached() && target.attachType == this.attachType) {
        if (target._attach(this)) {
          this.parent = target;

          // ----- html ------
          this.parent.parent.htmlElement.appendChild(this.htmlElement);

          // move position to attach x/y
          this.htmlElement.style.top =
            (this.parent.attachY - this.attachY) * this.game.Scale + "px";
          this.htmlElement.style.left =
            (this.parent.attachX - this.attachX) * this.game.Scale + "px";

          this.zIndex = this.parent.zIndex;

          console.log(
            `connected: \"${this.toString()}\" with: \"${this.parent.parent.toString()}\"`
          );
          return true;
        }
      }

      return false;
    },

    /**
     *
     */
    Detach() {
      if (this.CheckAttached() && this.parent._detach(this)) {
        console.log(
          `detached: \"${this.toString()}\" with: \"${this.parent.parent.toString()}\"`
        );
        this.game.detatch(this);
        this.parent = undefined;
        return true;
      }
      return false;
    },
  };

  base.htmlElement.classList.add(AttachableClass);

  if (conf.parent) {
    obj.Attach(conf.parent);
  }

  return obj;
};

/**
 * @typedef {object} CompAttHostConf properties for the component that can host attachments.
 * @property {} partSlotlist the Slots to connect parts to. Will set parent of child slots.
 * @property {partSlot[]} partSlotlist the Slots to connect parts to. Will set parent of child slots.
 */
/**
 * @typedef {{
 * partSlotlist: partSlot[];
 * }} CompAttachHost component for a part that can host attachments.
 */
/**
 * component for a part that can host attachments.
 * hosts attach slots
 * @param {gunPart} base
 * @param {CompAttHostConf} conf config objects
 * @returns {CompAttachHost}
 */
export const Comp_AttachHost = (base, conf) => {
  let obj = {
    /**
     * the parts that make up the gun
     * @type {partSlot[]}
     */
    partSlotlist: conf.partSlotlist,

    /**
     * htmlelement holding hosted elements
     * @type {htmlElement}
     */
    // htmlHostElement: undefined,
  };

  obj.partSlotlist.forEach((slot) => {
    slot.parent = base;
    slot.child?.Attach(slot);
  });

  return obj;
};

/**
 * @typedef {object} CompActionConf config obj for attachable parts
 *
 */
/**
 * @typedef {} CompAction
 */
/**
 *
 * @param {gunPart} base target obj
 * @param {CompActionConf} conf
 * @returns component for making a part attachable to another.
 */
export const Comp_Action = (base, conf) => {
  let obj = {
    /**
     * parent this gun part is attached to
     * @type {partSlot}
     */
    parent: undefined,

    /**
     * compatable attachment types
     * @type {SLOTTYPE}
     */
    attachType: conf.attachType,

    /**
     * attach to a part slot.
     * checks attach type.
     * @param {partSlot} target to attach to
     * @return {boolean} if attached successfully
     */
    Attach(target) {
      if (!this.parent && target.attachType == this.attachType)
        if (target._attach(this)) {
          this.parent = target;
          target._attach(this);
          return true;
        }

      return false;
    },

    /**
     *
     */
    Detach() {
      if (this.parent?._detach(this)) {
        this.parent = undefined;
        return true;
      }
      return false;
    },
  };

  if (conf.parent) {
    obj.Attach(conf.parent);
  }

  return obj;
};
