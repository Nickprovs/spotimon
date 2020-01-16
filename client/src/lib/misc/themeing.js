const darkModeKey = "darkModeOn";

export default class Theming {
  getSavedDarkModeOnStatus() {
    let darkModeOn = localStorage.getItem(darkModeKey);
    if (darkModeOn === null) {
      console.log("No theme data in browser local storage");
      return false;
    } else {
      darkModeOn = JSON.parse(darkModeOn);
    }

    return darkModeOn;
  }

  saveDarkModeOnStatus(darkModeOn) {
    localStorage.setItem(darkModeKey, darkModeOn);
  }
}
