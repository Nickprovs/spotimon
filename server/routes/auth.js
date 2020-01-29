const express = require("express");
const router = express.Router();
const config = require("config");
const request = require("request"); // "Request" library
const querystring = require("querystring");

const client_id = "d89d162f2d3946269dcec2aa2d53be20"; // Your client id
const client_secret = "d7b88624e20b4772b645816c94697306"; // Your secret

const stateKey = "spotify_auth_state";

console.log("server port", config.get("serverPort"));
console.log("is server port equal to string 80: ", config.get("serverPort") === "80");

const serverUriWithPort = `${config.get("serverAddress")}:${config.get("serverPort")}/api/auth/serverCallback`;
const serverUriWithoutPort = `${config.get("serverAddress")}/api/auth/serverCallback`;
const serverOnPort80 = config.get("serverPort") === "80" || config.get("serverPort") === 80;
let serverRedirectUri = "";
if (serverOnPort80) serverRedirectUri = serverUriWithoutPort;
else serverRedirectUri = serverUriWithPort;

//serverOnPort80 ? serverUriWithoutPort : serverUriWithPort;

//`${config.get("serverAddress")}/api/auth/serverCallback`;
//"https://spotimon.com/api/auth/serverCallback";

const clientUri =
  config.get("clientPort") === "80" ? config.get("clientAddress") : `${config.get("clientAddress")}:${config.get("clientPort")}`;
const clientRedirectUri = `${clientUri}/callback/#`;
const clientIssueUri = `${clientUri}/issue/#`;

//URI Checks: Server and Client
console.log(`Server Redirect Uri: ${serverRedirectUri}`);
console.log(`Client Redirect Uri: ${clientRedirectUri}`);

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.get("/test", function(req, res) {
  res.send("Server redirect uri: ", serverRedirectUri);
});

router.get("/login", function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  console.log("logging in witht his redir ", serverRedirectUri);
  // your application requests authorization
  var scope =
    "streaming user-read-private user-read-email user-read-playback-state user-top-read user-library-read user-modify-playback-state user-library-modify";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: serverRedirectUri,
        state: state
      })
  );
});

router.get("/serverCallback", function(req, res) {
  console.log("callback in witht his redir ", serverRedirectUri);

  console.log("HEY");
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  console.log("cookie from callback", req.headers.cookies);

  if (state === null || state !== storedState) {
    console.log("redirecting to " + clientUri);
    res.redirect(
      `${clientUri}` +
        querystring.stringify({
          error: "state_mismatch"
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: serverRedirectUri,
        grant_type: "authorization_code"
      },
      headers: {
        Authorization: "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64")
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          clientRedirectUri +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            })
        );
      } else {
        res.redirect(
          `${clientIssueUri}` +
            querystring.stringify({
              error: "invalid_token"
            })
        );
      }
    });
  }
});

router.get("/refresh_token", function(req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: { Authorization: "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64") },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token
      });
    }
  });
});

module.exports = router;
