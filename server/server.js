var express = require("express"); // Express web server framework
var cors = require("cors");
var cookieParser = require("cookie-parser");
var path = require("path");
const config = require("config");

//Create and setup the basics of our server
var app = express();
app
  .use(cookieParser())
  .use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  })
  .use(cors());

//Environment check
if (!process.env.NODE_ENV)
  throw new Error("Must specify environment by setting the NODE_ENV environment variable before running this server");

//Client Configuration Checks and Output
if (!config.has("clientAddress"))
  throw new Error("Client Address must be set either through config file or with env variable CLIENTADDRESS");
if (!config.has("clientPort"))
  throw new Error("Client Port should be set either through configuration file or with env variable CLIENTPORT");
console.log(`Configured Client Info- Address: ${config.get("clientAddress")}, Port: ${config.get("clientPort")}`);

//Server Configuration Checks and Output
if (!config.has("serverAddress"))
  throw new Error("Server Address should be set either through configuration file or with environment variable SERVERADDRESS");
if (!config.has("serverPort"))
  throw new Error("Server Port should be set either through configuration file or with the environment variable PORT");
console.log(`Configured Server Info- Address: ${config.get("serverAddress")}, Port: ${config.get("serverPort")}`);

//Registers our api routes
require("./startup/routes")(app);

//If the environment is production... we should host the static web app in the build dir
if (process.env.NODE_ENV == "production") {
  console.log("Production Environment Detected: Hosting Static Web App");
  app.use(express.static(__dirname + "/public"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });
} else console.log("Non-Production Environment Detected: NOT Hosting Static Web App");

const server = app.listen(config.get("serverPort"));
module.exports = server;
