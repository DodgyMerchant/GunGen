/**
 * math handling class.
 * Has only static functions.
 * @version 1.1.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyMath {
  /**
   * Returns a number whose value is limited to the given range.
   *
   * @param {Number} value value to clamp
   * @param {Number} min The lower boundary of the output range
   * @param {Number} max The upper boundary of the output range
   * @returns {number} A number in the range [min, max]
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * rotates a point around a central point by the given angle.
   * return object with new x,y, attributes
   * @param {Number} cx center of rotation x position
   * @param {Number} cy center of rotation y position
   * @param {Number} x position to rotate around center x
   * @param {Number} y position to rotate around center y
   * @param {Number} angle angle of rotation
   * @returns {Point}
   */
  static rotate(cx, cy, x, y, angle) {
    let radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = cos * (x - cx) + sin * (y - cy) + cx,
      ny = cos * (y - cy) - sin * (x - cx) + cy;
    return { x: nx, y: ny };
  }

  /**
   * start xand y move by angle and distance
   * @param {Number} x start x position
   * @param {Number} y start y position
   * @param {Number} angle angle to move by
   * @param {Number} distance distance to move by
   * @returns {{x: number, y: number}}
   */
  static findNewPoint(x, y, angle, distance) {
    let result = {
      x: Math.cos(angle) * distance + x,
      y: Math.sin(angle) * distance + y,
    };
    return result;
  }

  /**
   * angle between two points
   * @param {number} cx
   * @param {number} cy
   * @param {number} ex
   * @param {number} ey
   * @returns {number}
   */
  static pointAngle(cx, cy, ex, ey) {
    // let theta = Math.atan2(ey - cy, ex - cx); // range (-PI, PI]
    // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    // return theta;
    return Math.atan2(ey - cy, ex - cx);
  }

  static degToRad(deg) {
    return (deg * Math.PI) / 180;
  }
  static radToDeg(rad) {
    return rad * (180 / Math.PI);
  }

  /**
   * returns the distance between two points
   * @param {number} cx point 1 x
   * @param {number} cy point 1 y
   * @param {number} ex point 2 x
   * @param {number} ey point 2 y
   * @returns {number}
   */
  static pointDistance(cx, cy, ex, ey) {
    return Math.hypot(cx - ex, cy - ey);
  }

  /**
   * check if point is within a circle
   * @param {number} px point x position
   * @param {number} py point y position
   * @param {number} cx circle x position
   * @param {number} cy circle y position
   * @param {number} cr circle radius
   * @returns {boolean} if point lies in circle
   */
  static pointInCircle(px, py, cx, cy, cr) {
    let dist_points = (px - cx) * (px - cx) + (py - cy) * (py - cy);
    cr *= cr;
    if (dist_points < cr) {
      return true;
    }
    return false;
  }

  /**
   * checks of point is in polygon
   * @param {number} x
   * @param {number} y
   * @param {{x: number, y: number}[]} pointList list of point objects
   * @returns
   */
  static pointInPoly(x, y, pointList) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    let xi, yi, xj, yj, intersect;

    let inside = false;
    for (let i = 0, j = pointList.length - 1; i < pointList.length; j = i++) {
      xi = pointList[i].x;
      yi = pointList[i].y;
      xj = pointList[j].x;
      yj = pointList[j].y;

      intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  /**
   * prevents the value from overshooting the target.
   */
  static ovsh(oldVal, newVal, target) {
    return (
      Math.max((newVal - target) * Math.sign(oldVal - target), 0) *
        Math.sign(oldVal - target) +
      target
    );
  }

  /**
   *
   * @param {{top: number, bottom: number, left: number, right: number}} rec1
   * @param {{top: number, bottom: number, left: number, right: number}} rec2
   * @returns
   */
  static recCollide(rec1, rec2) {
    return !(
      rec1.top > rec2.bottom ||
      rec1.right < rec2.left ||
      rec1.bottom < rec2.top ||
      rec1.left > rec2.right
    );
  }

  /**
   *
   * @param {{top: number, bottom: number, left: number, right: number}} rec1
   * @param {{top: number, bottom: number, left: number, right: number}} rec2
   * @returns
   */
  static recInside(rec1, rec2) {
    return (
      rec2.top <= rec1.top &&
      rec1.top <= rec2.bottom &&
      rec2.top <= rec1.bottom &&
      rec1.bottom <= rec2.bottom &&
      rec2.left <= rec1.left &&
      rec1.left <= rec2.right &&
      rec2.left <= rec1.right &&
      rec1.right <= rec2.right
    );

    return (
      rec1.top <= rec2.bottom &&
      rec1.bottom >= rec2.top &&
      rec1.left <= rec2.right &&
      rec1.right >= rec2.left
    );
  }
}
