/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require("express"); // Express web server framework
var cors = require("cors");
var cookieParser = require("cookie-parser");
var path = require("path");

var app = express();

app
  .use(cookieParser())
  .use(express.static(__dirname + "/public"))
  .use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  })
  .use(cors());

//Registers our api routes
require("./startup/routes")(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

if (!process.env.PORT) throw new error("Port Env Variable Not Set. Port should be 80.");

const server = app.listen(process.env.PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App listening at http://${host}:${port}`);
});

module.exports = server;
