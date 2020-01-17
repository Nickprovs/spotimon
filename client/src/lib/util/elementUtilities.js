export default class ElementUtilities {
  static getAbsoluteHeight(element) {
    var styles = window.getComputedStyle(element);
    var margin = parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);
    return Math.ceil(element.offsetHeight + margin);
  }

  static getAbsoluteWidth(element) {
    var styles = window.getComputedStyle(element);
    var margin = parseFloat(styles["marginLeft"]) + parseFloat(styles["marginRight"]);
    return Math.ceil(element.offsetWidth + margin);
  }
}
