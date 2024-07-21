import MyEnum from "../myJS/MyEnum.js";
import * as Parts from "./parts.js";
import * as Components from "./composition.js";
import MyDraggable from "../myJS/MyDraggable.js";
import MyHTML from "../myJS/MyHTML.js";
import MyTemplate from "../myJS/MyTemplate.js";
import MyMath from "../myJS/MyMath.js";

/**
 * @typedef {object} GameSpaceConfig gameconfig object
 * @property {number} Scale multiplier
 * @property {number} Width width of the game in pixels
 * @property {number} Height height of the game in pixels
 */
/**
 * @typedef {object} GameUIConfig gameconfig object
 */
/**
 * @typedef {object} GameConfig gameconfig object
 * @property {number} FPS
 * @property {HTMLElement} GameWindow
 * @property {GameSpaceConfig} GameSpace
 * @property {GameUIConfig} GameUI
 */
/**
 * manages the game generally.
 * Includes: HTMLelements,
 */
export class Game {
  /**
   * @type {HTMLDivElement}
   */
  GameWindow;
  /**
   * @type {HTMLDivElement}
   */
  GameSpace;
  /**
   * @type {HTMLDivElement}
   */
  GameUI;

  /**
   * number identifying the interval that acts as the main loop-
   * @type {number | undefined}
   */
  InterMainLoop;

  /**
   * @type {number}
   */
  FPS;

  /**
   * game scale
   */
  get Scale() {
    return MyHTML.getPropertyFlt(document.body, "--scale");
  }
  /**
   * game scale
   */
  set Scale(value) {
    document.body.style.setProperty("--scale", value + "");
  }

  /**
   *
   * @param {GameConfig} conf
   */
  constructor(conf) {
    this.GameWindow = conf.GameWindow;
    this.GameWindow.id = "GameWindow";
    this.FPS = conf.FPS;
    //setup

    //GameSpace
    this.GameSpace = document.createElement("div");
    this.GameSpace.id = "GameSpace";
    this.GameWindow.appendChild(this.GameSpace);

    //GameUI
    this.GameUI = document.createElement("div");
    this.GameUI.id = "GameUI";
    this.GameWindow.appendChild(this.GameUI);

    var GameObj = this;

    // meta setup
    window.onload = function () {
      GameObj.InterMainLoop = setInterval(GameObj.MainLoop, GameObj.FPS);
    };

    this.GameWindow.addEventListener("mousedown", (event) =>
      event.preventDefault()
    );
    this.GameWindow.addEventListener("contextmenu", (event) =>
      event.preventDefault()
    );
  }

  /**
   * the main game loop.
   */
  MainLoop() {
    let TestObjs = this.GameSpace.children;

    let DraggedObj = GrabSystem.GetDraggedObjs();
    let spd = 1;

    let GameRect = this.GameSpace.getBoundingClientRect();
    let target = {
      x: GameRect.width / 2,
      y: GameRect.height / 2,
    };

    let rect, newPoint;
    /**
     * @type {HTMLElement}
     */
    let element;
    for (let i = 0; i < TestObjs.length; i++) {
      element = TestObjs[i];

      if (DraggedObj.indexOf(element) != -1) continue;

      rect = {
        // offsetLeft & offsetTop is an int leads to movement problems.
        x: MyHTML.getPropertyFlt(element, "left"),
        y: MyHTML.getPropertyFlt(element, "top"),
      };

      if (!(rect.x == target.x && rect.y == target.y)) {
        let ang = MyMath.pointAngle(rect.x, rect.y, target.x, target.y);
        newPoint = MyMath.findNewPoint(rect.x, rect.y, ang, spd);

        GrabSystem.MoveElTo(
          element,
          MyMath.ovsh(rect.x, newPoint.x, target.x),
          MyMath.ovsh(rect.y, newPoint.y, target.y),
          GameRect
        );
      }
    }
  }

  /**
   * Kills the game loop
   */
  Kill() {
    clearInterval(this.InterMainLoop);
  }

  //#region Gameobj

  /**
   * general game object add
   * @param {object} obj
   */
  _addGameObj(obj) {}

  /**
   * adds gunpart to gamespace
   * @param {Parts.gunPart} gunPart
   */
  addGunPart(gunPart) {
    //general
    this._addGameObj(gunPart);

    //js

    //html

    this.GameSpace.appendChild(gunPart.htmlElement);
  }

  /**
   * detaches game obj and adds it to gamespace.
   * @param {Parts.gunPart & Components.CompAttachable} target
   */
  detatch(target) {
    if (target.Detach()) {
      this.GameSpace.appendChild(target.htmlElement);
    }
  }

  //#endregion
  //#region z index

  /**
   * cleans up the z indexes.
   */
  zindexClean() {}

  //#endregion

  // ----------- maybe remove -----------------
  /**
   * expensive
   */
  GetTransform(element) {
    let str = MyHTML.getPropertyStr(element, "transform");
    if (str == "none") return [];

    let arr = [];
    let num;
    for (let i = str.indexOf("(") + 1; i < str.length; i += 3) {
      let num = parseFloat(str.charAt(i));
      num = str.charAt(i);
      arr.push(num);
    }

    return arr;
  }
}

/**
 * makes guns and manages them.
 * handles js and HTML of the gun.
 */
export class GunFactory {
  //#region make

  /**
   * @typedef {Parts.gunPart &
   * Components.CompDisplayable} GunBase base gun frame
   */
  /**
   *
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @returns {GunBase}
   */
  static Make_Base(partConf, dispConf) {
    let base = document.createElement("div");
    base.classList.add("GunGen-gunPart");

    let obj = new Parts.gunPart(partConf, base);
    return Object.assign(obj, Components.Comp_Displayable(obj, dispConf));
  }

  /**
   * @typedef {Parts.gunPart &
   * Components.CompDisplayable &
   * Components.CompAttachHost} FrameGeneral base gun frame
   */
  /**
   * Base gun frame, no grip
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @param {Components.CompAttHostConf} attHostConf
   * @returns {FrameGeneral}
   */
  static Make_FrameGeneral(partConf, dispConf, attHostConf) {
    let obj = GunFactory.Make_Base(partConf, dispConf);
    return Object.assign(obj, Components.Comp_AttachHost(obj, attHostConf));
  }

  /**
   * @typedef {FrameGeneral &
   * Components.CompGrabbable} FramePistol base pistol frame
   */
  /**
   * Base pistol frame, with grip!
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @param {Components.CompAttHostConf} attHostConf
   * @param {Components.CompGrabConf} grabConf
   * @returns {FramePistol}
   */
  static Make_FramePistol(partConf, dispConf, attHostConf, grabConf) {
    let obj = GunFactory.Make_FrameGeneral(partConf, dispConf, attHostConf);
    return Object.assign(obj, Components.Comp_Grabbable(obj, grabConf));
  }

  /**
   * @typedef {GunBase &
   * Components.CompGrabbable &
   * Components.CompBulletContainer &
   * Components.CompAttachable} Magazine Magazine for a gun
   */
  /**
   * magazine, bullet container
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @param {Components.CompGrabConf} grabConf
   * @param {Components.CompBulContConf} containConf
   * @param {Components.CompAttachableConf} attachConf
   * @returns {Magazine}
   */
  static Make_Magazine(partConf, dispConf, grabConf, containConf, attachConf) {
    let obj = GunFactory.Make_Base(partConf, dispConf);
    return Object.assign(
      obj,
      Components.Comp_Grabbable(obj, grabConf),
      Components.Comp_BulletContainer(obj, containConf),
      Components.Comp_Attachable(obj, attachConf)
    );
  }

  /**
   * @typedef {Parts.gunPart & Components.CompAttachable &
   * Components.CompBulletHolder} Extractor base pistol frame
   */
  /**
   * Extractor that grabs bullets!
   * @param {Parts.PartConf} partConf
   * @param {Components.CompAttachableConf} attachConf
   * @param {Components.CompBulletHoldConf} bHoldConf
   * @returns {Extractor}
   */
  static Make_Extractor(partConf, attachConf, bHoldConf) {
    let obj = new Parts.gunPart(partConf);
    return Object.assign(
      obj,
      Components.Comp_Attachable(obj, attachConf),
      Components.Comp_BulletHolder(obj, bHoldConf)
    );
  }

  //#endregion make
  //#region config objs

  /**
   * validate an enum variable in a config object
   */
  static ValEnum(obj, str) {
    if (obj[str])
      if (typeof obj[str] === "string") obj[str] = MyEnum.find(conf.caliber);
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
   * returns type of argument given as a string
   * @param {any} check
   * @return {"null"|"array"|"object"}
   */
  static is(val) {
    if (typeof val === "object") if (val == null) return "null";
    if (Array.isArray(val)) return "array";
    return "object";
  }

  /**
   * Check for component.
   *
   * @param {object} target
   * @param {object} component
   */
  static CheckComp(target, component) {
    let targProp = Object.keys(target);
    Object.keys(component).every((propStr) => {
      return targProp.indexOf(propStr);
    });
  }

  //#endregion
}

export class GrabSystem extends MyDraggable {}
