import MyEnum from "../myJS/MyEnum.js";
import * as Parts from "./parts.js";
import * as Components from "./composition.js";

/**
 * makes guns and manages them
 */
export class GunFactory {
  //#region make

  /**
   * @typedef {Parts.gunPart &
   * Components.CompAttachHost} FrameGeneral base gun frame
   */
  /**
   * Base gun frame, no grip
   * @param {Parts.PartConf} partConf
   * @param {Components.CompAttHostConf} attHostConf
   * @returns {FrameGeneral}
   */
  static Make_FrameGeneral(partConf, attHostConf) {
    let obj = new Parts.gunPart(partConf);
    return Object.assign(obj, Components.Comp_AttachHost(obj, attHostConf));
  }

  /**
   * @typedef {FrameGeneral &
   * Components.CompGrabConf} FramePistol base pistol frame
   */
  /**
   * Base pistol frame, with grip!
   * @param {Parts.PartConf} partConf
   * @param {Components.CompAttHostConf} attHostConf
   * @param {Components.CompGrabConf} grabConf
   * @returns {FramePistol}
   */
  static Make_FramePistol(partConf, attHostConf, grabConf) {
    let obj = GunFactory.Make_FrameGeneral(partConf, attHostConf);
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
    return Object.assign(obj, Components.Comp_BulletContainer(obj, containConf), Components.Comp_Attachable(obj, attachConf));
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
    return Object.assign(obj, Components.Comp_Attachable(obj, attachConf), Components.Comp_BulletHolder(obj, bHoldConf));
  }

  //#endregion make
  //#region config objs

  /**
   * validate an enum variable in a config object
   */
  static ValEnum(obj, str) {
    if (obj[str]) if (typeof obj[str] === "string") obj[str] = MyEnum.find(conf.caliber);
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
