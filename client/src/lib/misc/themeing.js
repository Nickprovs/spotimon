const darkModeKey = "darkModeOn";

export default class Theming {
  getSavedDarkModeOnStatus() {
    let darkModeOn = localStorage.getItem(darkModeKey);
    if (darkModeOn === null) {
      console.log("No theme data in browser local storage");
      //This app looks best with dark mode on.
      return true;
    } else {
      darkModeOn = JSON.parse(darkModeOn);
    }

    return darkModeOn;
  }

  saveDarkModeOnStatus(darkModeOn) {
    localStorage.setItem(darkModeKey, darkModeOn);
  }
}
