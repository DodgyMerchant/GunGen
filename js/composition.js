import MyHTML from "../myJS/MyHTML.js";
import { CALIBER, SLOTTYPE } from "./enums.js";
import InteractionSystem from "./InteractionSystem.js";
import { Round, GunPart, PartSlot } from "./parts.js";

const GrabTargetClass = "GunGen-grabTarget";
const GrabSourceClass = "GunGen-grabSource";
const AttachableClass = "GunGen-attachable";

/**
 * @typedef {object} BoxDimensions
 * @prop {number} x top left x coordinate
 * @prop {number} y top left y coordinate
 * @prop {number} w width
 * @prop {number} h height
 */
/**
 * @typedef {object} RBoxDimensions
 * @prop {number} cx center x coordinate
 * @prop {number} cy center y coordinate
 * @prop {number} w width
 * @prop {number} h height
 * @prop {number} [rot] rotation in degree around the center of the box.
 */

/**
 * @typedef {object} CompDisplayableConf display config objj
 * @prop {string} imgSrc
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
 * @param {GunPart} base target obj
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
 * @prop {string | CALIBER} caliber caliber enum name
 * @prop {number} capacity ammo capacity
 * @prop {Round[] | RoundConfig[] | RoundConfig | undefined} contents array of contents bullets
 */
/**
 * bullet container.
 * @typedef { {
 * caliber: CALIBER;
 * capacity: number;
 * contents: Round[];
 * LoadCheckCap(): boolean;
 * LoadCheckCal(cal: CALIBER): boolean;
 * LoadCheck(cal: CALIBER): boolean;
 * LoadAmmo(round: Round | Round[] | GunPart): number;
 * Extract(): Round | undefined;
 * }} CompBulletContainer
 */
/**
 * make a mag
 * @param {GunPart} base target obj
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
     * @param {Round | Round[] | GunPart} round
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
 * @prop {CALIBER} caliber caliber of the barrel
 * @prop {PartSlot | CompBulletContainer} source source of ammunition. If mag is detachable supply the attach slot.
 * @prop {Round} [heldRound] held round
 */
/**
 * @typedef { {
 *  caliber: CALIBER;
 *  source: PartSlot | CompBulletContainer;
 *  heldRound: Round | undefined;
 *  Feed(): Round | undefined;
 *  Eject(): Round | undefined;
 * }} CompBulletHolder
 */
/**
 * Holds a bullet
 * @param {GunPart} base
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
     * @type {PartSlot | CompBulletContainer}
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
      if (this.source instanceof PartSlot) ammoSource = this.source.child;
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
 * @prop {(RBoxDimensions | BoxDimensions)[]} [handleDimensions] grabbable area dimenesions. leave empty for entire part.
 * @prop {HTMLElement} [restrictions] restrict movement to element dimensions.
 */
/**
 * @typedef {{
 * htmlGrabElement: HTMLElement[];
 * grabHosted: boolean;
 * grabCheck(): boolean;
 * setGrabDimenBox(element: HTMLDivElement, dimensions: BoxDimensions): void;
 * setGrabDimenRot(element: HTMLDivElement, dimensions: RBoxDimensions): void;
 * }} CompGrabbable
 */
/**
 * part that is grabbable by the mouse in some way.
 * a grabbable point that wont deatatch the part from the gun
 *
 * @param {GunPart} base
 * @param {CompGrabConf} conf
 * @param {boolean} makeInteractable
 * @returns {CompGrabbable}
 */
export const Comp_Grabbable = (base, conf, makeInteractable = true) => {
  let obj = {
    /**
     * @type {HTMLElement[]}
     */
    htmlGrabElement: [],

    /**
     * grabbable if connected to a host.
     */
    grabHosted: conf.grabHosted ?? false,

    /**
     * is grabbed right now
     * @this {GunPart & CompGrabbable}
     */
    grabCheck() {
      return InteractionSystem.GetDraggedObjs().indexOf(this.htmlElement) != -1;
    },

    /**
     * gives the given grab element the given dimensions.
     * @this {GunPart & CompGrabbable}
     * @param {HTMLDivElement} element
     * @param {BoxDimensions} dimensions
     */
    setGrabDimenBox(element, dimensions) {
      element.style.left = dimensions.x * base.game.Scale + "px";
      element.style.top = dimensions.y * base.game.Scale + "px";
      element.style.width = dimensions.w * base.game.Scale + "px";
      element.style.height = dimensions.h * base.game.Scale + "px";
    },

    /**
     * gives the given grab element the given dimensions.
     * @this {GunPart & CompGrabbable}
     * @param {HTMLDivElement} element
     * @param {RBoxDimensions} dimensions
     */
    setGrabDimenRot(element, dimensions) {
      element.style.left =
        (dimensions.cx - dimensions.w * 0.5) * base.game.Scale + "px";
      element.style.top =
        (dimensions.cy - dimensions.h * 0.5) * base.game.Scale + "px";
      element.style.width = dimensions.w * base.game.Scale + "px";
      element.style.height = dimensions.h * base.game.Scale + "px";
      if (dimensions.rot) element.style.rotate = dimensions.rot + "deg";
    },
  };

  // make target grabbable
  // let moveTarget = conf.grabTarget?.htmlElement ?? base.htmlElement;

  // make target grabbable
  base.htmlElement.classList.add(GrabTargetClass);

  // set grabHost
  if (typeof conf.grabHost !== "undefined") obj.grabHost = conf.grabHost;

  // ----- create handle -----

  //create handle if handle dimensions are specified. If not the base elelemnt will be the handle.
  if (conf.handleDimensions !== undefined) {
    // create handle

    let el;
    conf.handleDimensions.forEach((dimensions) => {
      el = document.createElement("div");
      base.htmlElement.appendChild(el);
      if (dimensions.cx) obj.setGrabDimenRot(el, dimensions);
      else obj.setGrabDimenBox(el, dimensions);
      el.classList.add(GrabSourceClass);

      obj.htmlGrabElement.push(el);
    });
  } else {
    obj.htmlGrabElement.push(base.htmlElement);
    base.htmlElement.classList.add(GrabSourceClass);
  }

  if (makeInteractable) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    var button;

    var restTarget = conf.restrictions ?? base.game.GameSpace.HtmlElement;

    InteractionSystem.MakeElementInteractable(
      dragMouseDown,
      base.htmlElement,
      obj.htmlGrabElement
    );

    /**
     *
     * @param {MouseEvent} ev
     */
    function dragMouseDown(ev) {
      ev = ev || window.event;

      switch (ev.button) {
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

      pos1 = ev.pageX - pos3;
      pos2 = ev.pageY - pos4;
      pos3 = ev.pageX;
      pos4 = ev.pageY;

      switch (ev.button) {
        case 0:
          InteractionSystem.MoveElBy(
            base.htmlElement,
            pos1,
            pos2,
            restTarget.getBoundingClientRect()
          );
        default:
          break;
      }

      // set the element's new position:
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

      switch (button) {
        case 0: // left mb
          // if can be connected
          if (base.connectRec) {
            base.Attach(base.game.checkOpen(base));
          }
          break;
        default:
          break;
      }

      button = undefined;
    }
  }

  return obj;
};

/**
 * @typedef {object} _CATTC internal
 * @prop {PartSlot} [parent] parent this gun part is attached to
 * @prop {SLOTTYPE} attachType compatable attachment types
 * @prop {number} attachX attach point x axis position in unscaled pixels relativ to gun part base. Scale referst to the game scale.
 * @prop {number} attachY attach point y axis position in unscaled pixels relativ to gun part base. Scale referst to the game scale.
 * @prop {BoxDimensions} connectDimensions Dimensions for the connection hit box.
 * @prop {boolean} [grabHosted] grabbable if connected to a host. default true
 */
/**
 * @typedef {CompGrabConf & _CATTC} CompAttachableConf config obj for attachable parts. extends Component grabbable config.
 */
/**
 * @typedef { CompGrabbable & {
 * parent: PartSlot;
 * attachType: SLOTTYPE;
 * attachX: number;
 * attachY: number;
 * connectRec: BoxDimensions;
 * dragFunc: (ev: MouseEvent) => void;
 * disconnectFunc: (ev: MouseEvent) => void;
 * CheckAttached(): boolean;
 * Attach(target: PartSlot | undefined): boolean;
 * Detach(): boolean;
 * }} CompAttachable extends Component grabbable.
 */
/**
 * extends Component grabbable.
 * @param {GunPart} base target obj
 * @param {CompAttachableConf} conf
 * @returns {CompAttachable} component for making a part attachable to another.
 */
export const Comp_Attachable = (base, conf) => {
  //check for parent drag status

  let obj = Object.assign(Comp_Grabbable(base, conf, false), {
    /**
     * parent this gun part is attached to
     * @type {PartSlot}
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
     * connection rectangle. If two compatible PartSlot and CompAttachables connectRec overlap they can be connected.
     * @type {BoxDimensions}
     */
    connectRec: {
      x: conf.connectDimensions.x * base.game.Scale,
      y: conf.connectDimensions.y * base.game.Scale,
      w: conf.connectDimensions.w * base.game.Scale,
      h: conf.connectDimensions.h * base.game.Scale,
    },

    /**
     *
     * @param {MouseEvent} ev
     */
    dragFunc: dragMouseDown,

    /**
     *
     * @param {MouseEvent} ev
     */
    disconnectFunc: disconnectFunc,

    /**
     * returns if attached.
     * @this {GunPart & CompAttachable}
     * @returns returns if attached bool.
     */
    CheckAttached() {
      return this.parent !== undefined;
    },

    /**
     * attach to a part slot.
     * checks attach type.
     * @this {GunPart & CompAttachable}
     * @param {PartSlot | undefined} target to attach to
     * @return {boolean} if attached successfully
     */
    Attach(target) {
      if (target === undefined) return;

      if (!this.CheckAttached() && target.attachType == this.attachType) {
        if (target._attach(this)) {
          this.parent = target;

          console.log(
            `connected: \"${this.toString()}\" with: \"${this.parent.parent.toString()}\"`
          );

          // ----- html ------
          this.parent.parent.htmlElement.appendChild(this.htmlElement);

          console.log("removeEventListener dragFunc");
          this.htmlElement.removeEventListener("mousedown", this.dragFunc);
          console.log("addEventListener disconnectFunc");
          this.htmlElement.addEventListener("mousedown", this.disconnectFunc);

          // move position to attach x/y
          this.htmlElement.style.top =
            (this.parent.attachY - this.attachY) * this.game.Scale + "px";
          this.htmlElement.style.left =
            (this.parent.attachX - this.attachX) * this.game.Scale + "px";

          this.zIndex = this.parent.zIndex;

          return true;
        }
      }

      return false;
    },

    /**
     * @this {GunPart & CompAttachable}
     */
    Detach() {
      if (this.CheckAttached() && this.parent._detach(this)) {
        console.log(
          `detached: \"${this.toString()}\" with: \"${this.parent.parent.toString()}\"`
        );

        console.log("removeEventListener disconnectFunc");
        this.htmlElement.removeEventListener("mousedown", this.disconnectFunc);
        console.log("addEventListener dragFunc");
        this.htmlElement.addEventListener("mousedown", this.dragFunc);

        this.game.detatch(this);
        this.parent = undefined;
        return true;
      }
      return false;
    },
  });

  base.htmlElement.classList.add(AttachableClass);

  //TODO: remove debug element.
  let debug = document.createElement("div");
  base.htmlElement.appendChild(debug);

  debug.style.backgroundColor = "rgba(0, 0, 255, 0.3)";
  debug.style.position = "absolute";
  debug.style.left = obj.connectRec.x + "px";
  debug.style.top = obj.connectRec.y + "px";
  debug.style.width = obj.connectRec.w + "px";
  debug.style.height = obj.connectRec.h + "px";
  //debug end

  InteractionSystem.MakeElementInteractable(
    obj.dragFunc,
    base.htmlElement,
    obj.htmlGrabElement
  );

  if (conf.parent) obj.Attach(conf.parent);

  //anonymous functions
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  var button;

  var restTarget = conf.restrictions ?? base.game.GameSpace.HtmlElement;

  /**
   *
   * @param {MouseEvent} ev
   */
  function disconnectFunc(ev) {
    ev = ev || window.event;

    console.log("Comp_Attachable disconnectFunc");

    switch (ev.button) {
      case 2: // right mb
        if (base.parent?.detachable !== true) {
          break;
        }
        base.Detach();
      default:
        break;
    }
  }

  /**
   *
   * @param {MouseEvent} ev
   */
  function dragMouseDown(ev) {
    ev = ev || window.event;

    console.log("Comp_Attachable dragMouseDown");

    switch (ev.button) {
      case 2: // right mb
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

    pos1 = ev.pageX - pos3;
    pos2 = ev.pageY - pos4;
    pos3 = ev.pageX;
    pos4 = ev.pageY;

    switch (ev.button) {
      case 0: // left mb
      case 2: // right mb
        InteractionSystem.MoveElBy(
          base.htmlElement,
          pos1,
          pos2,
          restTarget.getBoundingClientRect()
        );
      default:
        break;
    }

    // set the element's new position:
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

    switch (button) {
      case 0: // left mb
      case 2: // right mb
        // if can be connected
        if (base.connectRec) {
          base.Attach(base.game.checkOpen(base));
        }
        break;
      default:
        break;
    }

    button = undefined;
  }

  return obj;
};

/**
 * @typedef {object} CompAttHostConf properties for the component that can host attachments.
 * @prop {} partSlotlist the Slots to connect parts to. Will set parent of child slots.
 * @prop {PartSlot[]} partSlotlist the Slots to connect parts to. Will set parent of child slots.
 */
/**
 * @typedef {{
 * partSlotlist: PartSlot[];
 * }} CompAttachHost component for a part that can host attachments.
 */
/**
 * component for a part that can host attachments.
 * hosts attach slots
 * @param {GunPart} base
 * @param {CompAttHostConf} conf config objects
 * @returns {CompAttachHost}
 */
export const Comp_AttachHost = (base, conf) => {
  let obj = {
    /**
     * the parts that make up the gun
     * @type {PartSlot[]}
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
 * @param {GunPart} base target obj
 * @param {CompActionConf} conf
 * @returns component for making a part attachable to another.
 */
export const Comp_Action = (base, conf) => {
  let obj = {
    /**
     * parent this gun part is attached to
     * @type {PartSlot}
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
     * @param {PartSlot} target to attach to
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
