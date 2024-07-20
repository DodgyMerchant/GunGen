//check for Template support
const supportsTemplate = new Boolean(
  document.createElement("Template").content
);
//continue or exit
if (supportsTemplate) {
  console.log("Your browser supports Template!");
} else {
  console.error("Your browser does NOT support Template!!!");
}

/**
 * HTML template element handling class.
 * Has only static functions.
 * @version 1.1.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyTemplate {
  /**
   *  only creates element from template
   * @param {HTMLTemplateElement} template
   * @returns appended child of template
   */
  static create(template) {
    if (!supportsTemplate) return;

    return document.importNode(template.content, true);
  }

  /**
   * clers of all child elements
   * @param {HTMLElement} parEl
   */
  static clearAll(parEl) {
    let _child = parEl.firstElementChild;
    while (_child) {
      parEl.removeChild(_child);
      _child = parEl.firstElementChild;
    }
  }

  /**
   * adds all children of DocumentFragment to a target.
   * @param {DocumentFragment} parent
   * @param {HTMLElement} target
   */
  static addChildren(parent, target) {
    let list = [];
    do {
      list.push(target.appendChild(parent.firstElementChild));
    } while (parent.childElementCount > 0);
    return list;
  }

  /**
   * adds everything within given template to target.
   * @param {HTMLTemplateElement} template
   * @param {HTMLElement} target
   * @returns {Element[]}
   */
  static addTemplate(template, target) {
    let temp = this.create(template);
    return this.addChildren(temp, target);
  }

  /**
   * returns if the browser supports template.
   * @returns {Boolean}
   */
  static supports() {
    return supportsTemplate;
  }
}
