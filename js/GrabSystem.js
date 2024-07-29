import MyArr from "../myJS/MyArr.js";
import MyMath from "../myJS/MyMath.js";
import { gunPart } from "./parts.js";
import * as Composition from "./composition.js";

function Implication(A, B) {
  if (A) {
    return B;
  } else {
    /* if A is false, the implication is true */ return true;
  }
}

/**
 * custom drag system.
 */
export default class GrabSystem {
  /**
   * Array of dragged items.
   * @type {HTMLElement[]}
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
   * make one element draggable.
   * @param {gunPart & Composition.CompGrabbable} gunObj
   * @param {HTMLElement} moveTarget the element that will be dragged.
   * @param {HTMLElement} [interactionTarget] the elent clicked on to enter dragging state.
   * @param {HTMLElement} [restTarget] parent element that restricts the area.
   */
  static MakeElementDraggable(
    gunObj,
    moveTarget,
    interactionTarget,
    restTarget
  ) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    var button = undefined;

    moveTarget;

    if (!interactionTarget) {
      // if present, the header is where you move the DIV from:
      interactionTarget = moveTarget;
    }

    interactionTarget.addEventListener("mousedown", dragMouseDown);

    // exposing position for faster later edits.
    let str = getComputedStyle(moveTarget).getPropertyValue("left");
    moveTarget.style.left = str == "" ? "0px" : str;
    str = getComputedStyle(moveTarget).getPropertyValue("top");
    moveTarget.style.top = str == "" ? "0px" : str;

    /**
     *
     * @param {MouseEvent} ev
     */
    function dragMouseDown(ev) {
      ev = ev || window.event;
      // ev.preventDefault();

      switch (ev.button) {
        case 2: // right mb
          if (gunObj.parent?.detachable !== true) {
            break;
          }
          gunObj.Detach();
        case 0: // left mb
          pos3 = ev.pageX;
          pos4 = ev.pageY;

          document.addEventListener("mouseup", closeDragElement);
          document.addEventListener("mousemove", elementDrag);

          GrabSystem._addDraggable(moveTarget);

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
      if (!Implication(gunObj.parent, gunObj.grabHosted)) {
        closeDragElement(ev);
        return;
      }

      // calculate the new cursor position:
      // pos1 = ev.clientX - pos3;
      // pos2 = ev.clientY - pos4;
      // pos3 = ev.clientX;
      // pos4 = ev.clientY;

      // set the element's new position:
      // GrabSystem.MoveElBy(
      //   moveTarget,
      //   pos1,
      //   pos2,
      // );

      pos1 = ev.pageX - pos3;
      pos2 = ev.pageY - pos4;
      pos3 = ev.pageX;
      pos4 = ev.pageY;

      // set the element's new position:
      GrabSystem.MoveElBy(
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

      GrabSystem._removeDraggable(moveTarget);
      button = undefined;
    }
  }

  /**
   * adds target as draged instance.
   * @param {any} any
   */
  static _addDraggable(any) {
    this._dragArr.push(any);
  }
  /**
   *
   * @param {any} any
   */
  static _removeDraggable(any) {
    MyArr.removeEntry(this._dragArr, any);
  }

  /**
   * retruns managed list of dragged HTMLElements.
   * @returns {HTMLElement[]}
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
