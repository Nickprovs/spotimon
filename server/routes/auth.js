const express = require("express");
const router = express.Router();
const config = require("config");
const request = require("request"); // "Request" library
const querystring = require("querystring");

const client_id = process.env.CLIENTID; // Your client id
const client_secret = process.env.CLIENTSECRET; // Your secret

const stateKey = "spotify_auth_state";

const serverRedirectUri =
  process.env.NODE_ENV === "production"
    ? `${config.get("serverAddress")}/api/auth/serverCallback`
    : `${config.get("serverAddress")}:${config.get("serverPort")}/api/auth/serverCallback`;

const clientUri =
  config.get("clientPort") === "80" ? config.get("clientAddress") : `${config.get("clientAddress")}:${config.get("clientPort")}`;
const clientRedirectUri = `${clientUri}/callback/#`;
const clientIssueUri = `${clientUri}/issue/#`;

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

router.get("/login", function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

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
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  console.log("cookie from callback", req.headers.cookies);

  if (state === null || state !== storedState) {
    console.log("redirecting to " + clientUri);
    res.redirect(
      `${clientIssueUri}` +
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
