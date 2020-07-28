<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Nickprovs/spotimon">
    <img src="_meta/logo.png" alt="Logo" width="256" height="256">
  </a>

  <h3 align="center">spotimon</h3>

  <p align="center">
    spotimon is a way to visualize your spotify universe. It uses physics and spotify analytics to create something truly unique to you. Check it out live <a href="https://spotimon.com/" rel="noopener noreferrer" target="_blank">here</a>. 
    <br />
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [License](#license)

<!-- ABOUT THE PROJECT -->

## About The Project

spotimon uses analytics available to premium members to build a universe based on many of the genres a user listens to.
It then generates a planetary system where genres are represented as celestial bodies.
An n-body simulation is used to put the universe in motion.

Time and the masses of the system can be altered. This site also has a light and a dark theme.

[![Product Name Screen Shot][product-screenshot]](/_meta/sample.jpg)

### Built With

- react.js
- [react-spotify-web-playback](https://github.com/gilbarbara/react-spotify-web-playback)
- [spotify web-api](https://github.com/spotify/web-api)

<!-- GETTING STARTED -->

### Installation

1. Clone or Fork the project

```sh
git clone https://github.com/Nickprovs/spotimon.git
```

2. Open both the client and server folders in a new terminal.

3. Install Dependencies.

```sh
npm update
```

3. Start the client and server

```sh
npm start
```

<!-- LICENSE -->

## License

Distributed under the MIT License. See [License](LICENSE.md) for more information.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[license-shield]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://github.com/nickprovs/ballpit/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/nickprovs
[product-screenshot]: _meta/sample.jpg
