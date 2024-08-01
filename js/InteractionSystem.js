import MyArr from "../myJS/MyArr.js";
import MyMath from "../myJS/MyMath.js";
import { GunPart } from "./parts.js";
import * as Composition from "./composition.js";

function Implication(A, B) {
  if (A) {
    return B;
  } else {
    /* if A is false, the implication is true */ return true;
  }
}

/**
 * custom Interaction System.
 */
export default class InteractionSystem {
  /**
   * Array of dragged items.
   * @type {GunPart & Composition.CompGrabbable[]}
   */
  static _dragArr = [];

  /**
   * move element to x,y position.
   * in pixels.
   * @param {HTMLElement} target
   * @param {number} toX number relativ to offsetParent
   * @param {number} toY number relativ to offsetParent
   * @param {{
   *  bottom : number,
   *  left : number,
   *  right : number,
   *  top : number
   *  }} [restriction] object with numbers that restrict the movable area. a DOMRect can be used.
   */
  static MoveElTo(target, toX, toY, restriction) {
    if (restriction) {
      let rect = target.getBoundingClientRect();
      let parRect = target.offsetParent.getBoundingClientRect();

      target.style.left =
        MyMath.clamp(
          toX,
          restriction.left - parRect.left,
          restriction.right - parRect.left - rect.width
        ) + "px";
      target.style.top =
        MyMath.clamp(
          toY,
          restriction.top - parRect.top,
          restriction.bottom - parRect.top - rect.height
        ) + "px";
    } else {
      target.style.left = toX + "px";
      target.style.top = toY + "px";
    }
    // console.log(toX, target.style.left);
  }

  /**
   * move element by the amount in pixels position.
   * @param {HTMLElement} target
   * @param {number} byX
   * @param {number} byY
   * @param {{
   *  bottom : number,
   *  left : number,
   *  right : number,
   *  top : number
   *  }} [restriction] object with numbers that restrict the movable area. a DOMRect can be used.
   */
  static MoveElBy(target, byX, byY, restriction) {
    this.MoveElTo(
      target,
      Number.parseFloat(target.style.left) + byX,
      Number.parseFloat(target.style.top) + byY,
      restriction
    );
  }

  /**
   * make one element Interactable.
   * @param {((this: GlobalEventHandlers, ev: MouseEvent) => any)} pressFunction
   * @param {HTMLElement} moveTarget the element that will be dragged.
   * @param {HTMLElement[]} interactionTargets the elent clicked on to enter dragging state.
   */
  static MakeElementInteractable(
    pressFunction,
    moveTarget,
    interactionTargets
  ) {
    interactionTargets.forEach((element) => {
      element.addEventListener("mousedown", pressFunction);
    });
    // document.onmouseup = closeDragElement.bind(document, [this]);
    // document.onmousemove = elementDrag.bind(document, [this]);

    // exposing position for faster later edits.
    let str = getComputedStyle(moveTarget).getPropertyValue("left");
    moveTarget.style.left = str == "" ? "0px" : str;
    str = getComputedStyle(moveTarget).getPropertyValue("top");
    moveTarget.style.top = str == "" ? "0px" : str;
  }

  /**
   * adds target as draged instance.
   * @param {GunPart & Composition.CompGrabbable} gunPart
   */
  static _addDraggable(gunPart) {
    this._dragArr.push(gunPart);
  }

  /**
   *
   * @param {GunPart & Composition.CompGrabbable} gunPart
   */
  static _removeDraggable(gunPart) {
    MyArr.removeEntry(this._dragArr, gunPart);
  }

  /**
   * retruns managed list of dragged HTMLElements.
   * @returns {GunPart & Composition.CompGrabbable[]}
   */
  static GetDraggedObjs() {
    return this._dragArr;
  }

  /**
   * get offset to page
   * @param {HTMLElement} el
   */
  static GetOffset(el) {
    var _x = 0;
    var _y = 0;
    // if you want to use this youll have to erase offsetLeft & offsetTop.
    // both are Int, no decimals.
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }
}
