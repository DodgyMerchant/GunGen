import { Enum } from "./helpers.js";
import * as Parts from "./parts.js";
import * as Components from "./composition.js";

/**
 * makes guns and manages them
 */
export class GunFactory {
  //#region make

  /**
   * @typedef {Parts.gunPart &
   * Components.Comp_AttachHost} FrameGeneral base gun frame
   */
  /**
   * Base gun frame, no grip
   * @param {Parts.PartConf} partConf
   * @param {Components.CompAttHostConf} attHostConf
   * @returns {FrameGeneral}
   */
  static Make_FrameGeneral(partConf, attHostConf) {
    return {
      ...new Parts.gunPart(partConf),
      ...new Components.Comp_AttachHost(attHostConf),
    };
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
    let frame = GunFactory.Make_FrameGeneral(partConf, attHostConf);
    return {
      ...frame,
      ...new Components.Comp_Grabbable(grabConf),
    };
  }

  /**
   * @typedef {Parts.gunPart &
   * Components.Comp_BulletContainer &
   * Components.Comp_Attachable} Magazine Magazine for a gun
   */
  /**
   * magazine, bullet container
   * @param {Parts.PartConf} partConf
   * @param {Components.CompBulContConf} containConf
   */
  static Make_Magazine(partConf, containConf, attachConf) {
    let obj = {
      ...new Components.Comp_BulletContainer(containConf),
      ...new Parts.gunPart(partConf),
      ...new Components.Comp_Attachable(attachConf),
    };

    Object.bind;
    Object.defineProperties;

    return obj;
  }

  /**
   * @typedef {Parts.gunPart & Components.Comp_Attachable &
   * Components.Comp_BulletHolder} Extractor base pistol frame
   */
  /**
   * Extractor that grabs bullets!
   * @param {Parts.PartConf} partConf
   * @param {Components.CompAttachableConf} attachConf
   * @param {Components.CompBulletHoldConf} bHoldConf
   * @returns {Extractor}
   */
  static Make_Extractor(partConf, attachConf, bHoldConf) {
    return {
      ...new Parts.gunPart(partConf),
      ...new Components.Comp_Attachable(attachConf),
      ...new Components.Comp_BulletHolder(bHoldConf),
    };
  }

  //#endregion make
  //#region config objs

  /**
   * validate an enum variable in a config object
   */
  static ValEnum(obj, str) {
    if (obj[str]) if (typeof obj[str] === "string") obj[str] = Enum.find(conf.caliber);
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
