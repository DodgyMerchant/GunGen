import MyEnum from "../myJS/MyEnum.js";
import * as Parts from "./parts.js";
import * as Components from "./composition.js";
import MyDraggable from "../myJS/MyDraggable.js";
import MyHTML from "../myJS/MyHTML.js";
import MyTemplate from "../myJS/MyTemplate.js";

/**
 * @typedef {object} GameSpaceConfig gameconfig object
 * @property {number} Scale multiplier
 * @property {number} Width
 * @property {number} Height
 */
/**
 * @typedef {object} GameUIConfig gameconfig object
 * @property {number} FPS
 * @property {HTMLElement} GameWindow
 * @property {number} Scale
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
   * game scale
   */
  static get Scale() {
    return MyHTML.getPropertyFlt(document.body, "--scale");
  }
  /**
   * game scale
   */
  static set Scale(value) {
    document.body.style.setProperty("--scale", value + "");
  }

  /**
   *
   * @param {GameConfig} conf
   */
  constructor(conf) {
    this.GameWindow = conf.GameWindow;

    //setup

    this.GameSpace = document.createElement("div");
    this.GameWindow.appendChild(this.GameSpace);
    this.GameUI = document.createElement("div");
    this.GameWindow.appendChild(this.GameUI);
  }

  /**
   * expensive
   */
  static GetTransform(element) {
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

  //#region Gameobj

  _addGameObj() {}

  /**
   * adds gunpart to gamespace
   * @param {Parts.gunPart} gunPart
   */
  addGunPart(gunPart) {
    //general
    this._addGameObj();

    //js

    //html

    this.GameSpace.appendChild(gunPart.htmlElement);
  }

  //#endregion
}

/**
 * makes guns and manages them.
 * handles js and HTML of the gun.
 */
export class GunFactory {
  //#region make

  //TODO: add displayable class def
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
    //GameSpace
    let base = MyTemplate.create(
      document.getElementById("temp_PartBase")
    ).firstElementChild;

    let obj = new Parts.gunPart(partConf, base);
    return Object.assign(
      obj,
      Components.Comp_Displayable(obj, dispConf),
      Components.Comp_AttachHost(obj, attHostConf)
    );
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
   * @typedef {Parts.gunPart &
   * Components.CompBulletContainer &
   * Components.CompAttachable} Magazine Magazine for a gun
   */
  /**
   * magazine, bullet container
   * @param {Parts.PartConf} partConf
   * @param {Components.CompBulContConf} containConf
   */
  static Make_Magazine(partConf, containConf, attachConf) {
    let obj = new Parts.gunPart(partConf);
    return Object.assign(
      obj,
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
