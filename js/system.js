import MyEnum from "../myJS/MyEnum.js";
import * as Parts from "./parts.js";
import * as Components from "./composition.js";
import MyHTML from "../myJS/MyHTML.js";
import MyArr from "../myJS/MyArr.js";
import InteractionSystem from "./InteractionSystem.js";
import MyMath from "../myJS/MyMath.js";

/**
 * @typedef {object} GameSpaceConfig gameconfig object
 * @property {number} Scale multiplier
 * @property {number} Width width of the game in pixels
 * @property {number} Height height of the game in pixels
 */

export class GameSpace {
  /**
   *
   * @param {GameSpaceConfig} conf
   */
  constructor(game, targetHTML, conf) {
    this.Game = game;

    this.HtmlElement = document.createElement("div");
    this.HtmlElement.id = "GameSpace";
    targetHTML.appendChild(this.HtmlElement);
    this.Width = conf.Width;
    this.Height = conf.Height;
    this.Scale = conf.Scale;

    Game;
  }

  /**
   * refrence for game instance.
   * @type {Game}
   */
  Game;
  /**
   * @type {HTMLDivElement}
   */
  HtmlElement;

  /**
   * Z index Default
   */
  ZIndDef = 0;

  /**
   * Is the current highest used z index + 1.
   * So a safe to use z index.
   */
  ZIndFloor = this.ZIndDef;

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
   * width
   */
  get Width() {
    return parseFloat(this.HtmlElement.style.width);
  }
  /**
   * width
   */
  set Width(value) {
    this.HtmlElement.style.width = value + "px";
    this.Game.Width = value;
  }
  /**
   * Height
   */
  get Height() {
    return parseFloat(this.HtmlElement.style.height);
  }
  /**
   * Height
   */
  set Height(value) {
    this.HtmlElement.style.height = value + "px";
    this.Game.Height = value;
  }

  /**
   * general game object HTML add
   * @param {HTMLElement} element
   * @param {number} x x coordinate in gamespace.
   * @param {number} y y coordinate in gamespace.
   */
  AddElement(element, x, y) {
    this.HtmlElement.appendChild(element);
    element.style.left = x + "px";
    element.style.top = y + "px";
  }

  /**
   * general game object HTML remove
   * @param {HTMLElement} element
   */
  RemoveElement(element) {
    this.HtmlElement.removeChild(element);
  }

  //#region z index

  /**
   * cleans up the z indexes.
   */
  zindexClean() {
    /*
    copy gun list
    sort by index increasing

    */
  }

  //#endregion
}

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
   * @type {GameSpace}
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
   * @type {Parts.GunPart[]}
   */
  GameObjList = [];

  /**
   * list of empty slots.
   * @type {Parts.PartSlot[]}
   */
  OpenSlots = [];

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
   * width
   */
  get Width() {
    return parseFloat(this.GameWindow.style.width);
  }
  /**
   * width
   */
  set Width(value) {
    this.GameWindow.style.width = value + "px";
  }
  /**
   * Height
   */
  get Height() {
    return parseFloat(this.GameWindow.style.height);
  }
  /**
   * Height
   */
  set Height(value) {
    this.GameWindow.style.height = value + "px";
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

    conf.GameSpace;

    //GameSpace
    conf.GameSpace.TargetHTML = this.GameWindow;
    this.GameSpace = new GameSpace(this, this.GameWindow, conf.GameSpace);

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

  //#region main loop

  /**
   * the main game loop.
   */
  MainLoop() {
    // let TestObjs = this.GameSpace.children;
    // let DraggedObj = InteractionSystem.GetDraggedObjs();
    // let spd = 1;
    // let GameRect = this.GameSpace.getBoundingClientRect();
    // let target = {
    //   x: GameRect.width / 2,
    //   y: GameRect.height / 2,
    // };
    // let rect, newPoint;
    // /**
    //  * @type {HTMLElement}
    //  */
    // let element;
    // for (let i = 0; i < TestObjs.length; i++) {
    //   element = TestObjs[i];
    //   if (DraggedObj.indexOf(element) != -1) continue;
    //   rect = {
    //     // offsetLeft & offsetTop is an int leads to movement problems.
    //     x: MyHTML.getPropertyFlt(element, "left"),
    //     y: MyHTML.getPropertyFlt(element, "top"),
    //   };
    //   if (!(rect.x == target.x && rect.y == target.y)) {
    //     let ang = MyMath.pointAngle(rect.x, rect.y, target.x, target.y);
    //     newPoint = MyMath.findNewPoint(rect.x, rect.y, ang, spd);
    //     InteractionSystem.MoveElTo(
    //       element,
    //       MyMath.ovsh(rect.x, newPoint.x, target.x),
    //       MyMath.ovsh(rect.y, newPoint.y, target.y),
    //       GameRect
    //     );
    //   }
    // }
  }

  /**
   * Kills the game loop
   */
  Kill() {
    clearInterval(this.InterMainLoop);
  }

  //#endregion
  //#region Gameobj

  //adding/removing game objs
  /**
   * general game object HTML add
   * @param {Parts.HtmlObj} obj
   * @param {number} x x coordinate in gamespace.
   * @param {number} y y coordinate in gamespace.
   */
  _addGameObjHTML(obj, x, y) {
    this.GameSpace.AddElement(obj.htmlElement, x, y);
  }

  /**
   * general game object HTML add
   * @param {Parts.HtmlObj} obj
   */
  _removeGameObjHTML(obj) {
    this.GameSpace.AddElement(obj.htmlElement, x, y);
  }

  /**
   * general game object JS add
   * @param {object} obj
   * @param {number} x x coordinate in gamespace.
   * @param {number} y y coordinate in gamespace.
   */
  _addGameObjJS(obj, x, y) {}

  /**
   *
   * @param {object} obj
   */
  _removeGameObjJS(obj) {}

  /**
   * adds gunpart to gamespace
   * @param {Parts.GunPart} GunPart
   * @param {number} x x coordinate in gamespace.
   * @param {number} y y coordinate in gamespace.
   */
  addGunPart(GunPart, x = 0, y = 0) {
    //general
    //js
    this._addGameObjJS(GunPart);
    //html
    this._addGameObjHTML(GunPart, x, y);

    //gun specific
    this.GameObjList.push(GunPart);
  }

  /**
   *
   * @param {Parts.GunPart} GunPart
   */
  removeGunPart(GunPart) {
    //general
    //js
    this._removeGameObjJS(GunPart);
    //html
    this._removeGameObjHTML(GunPart, x, y);

    //gun specific
    MyArr.removeEntry(this.GameObjList, GunPart);
  }

  //#endregion
  //#region attach detach

  /**
   * detaches game obj and adds it to gamespace.
   * @param {Parts.GunPart & Components.CompAttachable} target
   */
  detatch(target) {
    let parent = target.htmlElement.parentElement;
    this.GameSpace.HtmlElement.appendChild(target.htmlElement);
    InteractionSystem.MoveElTo(
      target.htmlElement,
      Number.parseFloat(parent.style.left) +
        Number.parseFloat(target.htmlElement.style.left),
      Number.parseFloat(parent.style.top) +
        Number.parseFloat(target.htmlElement.style.top)
    );
    target.zIndex = 0;
  }

  /**
   *
   * @param {Parts.PartSlot} slot
   */
  addOpen(slot) {
    this.OpenSlots.push(slot);
  }

  /**
   *
   * @param {Parts.PartSlot} slot
   */
  removeOpen(slot) {
    MyArr.removeEntry(this.OpenSlots, slot);
  }

  /**
   * check for possible connections
   * @param {Parts.GunPart & Components.CompAttachable} gunPart
   * @returns {Parts.PartSlot | undefined}
   */
  checkOpen(gunPart) {
    return this.OpenSlots.find((slot, index, obj) => {
      if (slot.attachType === gunPart.attachType) {
        let scale = gunPart.game.Scale;
        let slotBoundRec = slot.parent.htmlElement.getBoundingClientRect();
        let slotRec = {
          top: slotBoundRec.y + slot.connectRec.y,
          bottom: slotBoundRec.y + slot.connectRec.y + slot.connectRec.h,
          left: slotBoundRec.x + slot.connectRec.x,
          right: slotBoundRec.x + slot.connectRec.x + slot.connectRec.w,
        };
        let gunBoundRec = gunPart.htmlElement.getBoundingClientRect();
        let gunRec = {
          top: gunBoundRec.y + gunPart.connectRec.y,
          bottom: gunBoundRec.y + gunPart.connectRec.y + slot.connectRec.h,
          left: gunBoundRec.x + gunPart.connectRec.x,
          right: gunBoundRec.x + gunPart.connectRec.x + gunPart.connectRec.w,
        };
        if (MyMath.recCollide(slotRec, gunRec)) {
          return true;
        }
      }
      return false;
    });
  }

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
   * @typedef {Parts.GunPart &
   * Components.CompDisplayable} GunBase base gun frame
   */
  /**
   * base gun part with display.
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @returns {GunBase}
   */
  static Make_Base(partConf, dispConf) {
    let base = document.createElement("div");
    base.classList.add("GunGen-GunPart");

    let obj = new Parts.GunPart(partConf, base);
    return Object.assign(obj, Components.Comp_Displayable(obj, dispConf));
  }

  /**
   * @typedef {Parts.GunPart &
   * Components.CompDisplayable &
   * Components.CompAttachable} Attachable generic attachable
   */
  /**
   * Generic attachable
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @param {Components.CompAttachableConf} attachConf
   * @returns {Attachable}
   */
  static Make_Attachable(partConf, dispConf, attachConf) {
    let obj = GunFactory.Make_Base(partConf, dispConf);
    return Object.assign(obj, Components.Comp_Attachable(obj, attachConf));
  }

  /**
   * @typedef {Parts.GunPart &
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
   * Components.CompGrabbable} FrameGrip base gun frame with grip.
   */
  /**
   * Base gun frame, with grip!
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @param {Components.CompAttHostConf} attHostConf
   * @param {Components.CompGrabConf} grabConf
   * @returns {FrameGrip}
   */
  static Make_FrameGrip(partConf, dispConf, attHostConf, grabConf) {
    let obj = GunFactory.Make_FrameGeneral(partConf, dispConf, attHostConf);
    return Object.assign(obj, Components.Comp_Grabbable(obj, grabConf));
  }

  /**
   * @typedef {GunBase &
   * Components.CompAttachable &
   * Components.CompBulletContainer
   * } Magazine Magazine for a gun
   */
  /**
   * magazine, bullet container
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @param {Components.CompAttachableConf} attachConf
   * @param {Components.CompBulContConf} containConf
   * @returns {Magazine}
   */
  static Make_Magazine(partConf, dispConf, attachConf, containConf) {
    let obj = GunFactory.Make_Base(partConf, dispConf);
    return Object.assign(
      obj,
      Components.Comp_Attachable(obj, attachConf),
      Components.Comp_BulletContainer(obj, containConf)
    );
  }

  /**
   * @typedef {GunBase & Components.CompAttachable &
   * Components.CompBulletHolder} Extractor Extractor that grabs bullets!
   */
  /**
   * Extractor that grabs bullets!
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @param {Components.CompAttachableConf} attachConf
   * @param {Components.CompBulletHoldConf} bHoldConf
   * @returns {Extractor}
   */
  static Make_Extractor(partConf, dispConf, attachConf, bHoldConf) {
    let obj = this.Make_Base(partConf, dispConf);
    return Object.assign(
      obj,
      Components.Comp_Attachable(obj, attachConf),
      Components.Comp_BulletHolder(obj, bHoldConf)
    );
  }

  /**
   * @typedef {GunBase &
   * Components.CompAttachable &
   * Components.CompBulletHolder
   * } PistolSlideBasic Pistol slide
   */
  /**
   * Pistol slide
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @param {Components.CompAttachableConf} attachConf
   * @param {Components.CompBulletHoldConf} bHoldConf
   * @returns {PistolSlideBasic}
   */
  static Make_PistolSlideBasic(partConf, dispConf, attachConf, bHoldConf) {
    let obj = this.Make_Base(partConf, dispConf);
    return Object.assign(
      obj,
      Components.Comp_Attachable(obj, attachConf),
      Components.Comp_BulletHolder(obj, bHoldConf)
    );
  }

  /**
   * @typedef {PistolSlideBasic &
   * Components.CompAttachHost
   * } PistolSlide Pistol slide
   */
  /**
   * Pistol slide
   * @param {Parts.PartConf} partConf
   * @param {Components.CompDisplayableConf} dispConf
   * @param {Components.CompAttachableConf} attachConf
   * @param {Components.CompBulletHoldConf} bHoldConf
   * @param {Components.CompAttHostConf} attHostConf
   * @returns {PistolSlide}
   */
  static Make_PistolSlide(
    partConf,
    dispConf,
    attachConf,
    bHoldConf,
    attHostConf
  ) {
    let obj = this.Make_PistolSlideBasic(
      partConf,
      dispConf,
      attachConf,
      bHoldConf
    );
    return Object.assign(obj, Components.Comp_AttachHost(obj, attHostConf));
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
