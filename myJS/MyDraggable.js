import MyArr from "./MyArr.js";
import MyMath from "./MyMath.js";

/**
 * HTMLleemnt mouse draggable handling class.
 * Has only static functions.
 * @version 1.0.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyDraggable {
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
   * @param {HTMLElement} moveTarget the element that will be dragged.
   * @param {HTMLElement} [interactionTarget] the elent clicked on to enter dragging state.
   * @param {HTMLElement} [restTarget] parent element that restricts the area.
   */
  static MakeElementDraggable(moveTarget, interactionTarget, restTarget) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    moveTarget;

    if (!interactionTarget) {
      // if present, the header is where you move the DIV from:
      interactionTarget = moveTarget;
    }

    interactionTarget.addEventListener("mousedown", dragMouseDown);

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
      ev.preventDefault();

      pos3 = ev.pageX;
      pos4 = ev.pageY;

      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);

      // document.onmouseup = closeDragElement.bind(document, [this]);
      // document.onmousemove = elementDrag.bind(document, [this]);

      MyDraggable._addDraggable(moveTarget);
    }

    /**
     *
     * @param {MouseEvent} ev
     */
    function elementDrag(ev) {
      ev = ev || window.event;
      ev.preventDefault();
      // calculate the new cursor position:
      // pos1 = ev.clientX - pos3;
      // pos2 = ev.clientY - pos4;
      // pos3 = ev.clientX;
      // pos4 = ev.clientY;

      // set the element's new position:
      // MyDraggable.MoveElBy(
      //   moveTarget,
      //   pos1,
      //   pos2,
      // );

      pos1 = ev.pageX - pos3;
      pos2 = ev.pageY - pos4;
      pos3 = ev.pageX;
      pos4 = ev.pageY;

      // set the element's new position:
      MyDraggable.MoveElBy(
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

      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);

      MyDraggable._removeDraggable(moveTarget);
    }
  }

  /**
   * makes all element of a class draggable.
   * @param {string} moveClass class name of the element that will be dragged.
   * @param {string} interClass class name of the elent clicked on to enter dragging state.
   * @param {HTMLElement} [restTarget] parent element that restricts the area.
   */
  static MakeClassDraggable(moveClass, interClass, restTarget) {
    let objs = document.getElementsByClassName(moveClass),
      obj;

    for (let i = 0; i < objs.length; i++) {
      obj = objs[i];
      this.MakeElementDraggable(
        obj,
        obj.getElementsByClassName(interClass)[0],
        restTarget
      );
      console.log("Made Draggable: ", obj);
    }
  }

  /**
   *
   * @param {any} any
   */
  static _addDraggable(any) {
    MyDraggable._dragArr.push(any);
  }
  /**
   *
   * @param {any} any
   */
  static _removeDraggable(any) {
    MyArr.removeEntry(MyDraggable._dragArr, any);
  }

  /**
   * retruns managed list of dragged HTMLElements.
   * @returns {HTMLElement[]}
   */
  static GetDraggedObjs() {
    return MyDraggable._dragArr;
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
