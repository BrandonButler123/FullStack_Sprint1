global.DEBUG = false;

const fs = require("fs");

const myEmitter = require("./logEvents.js");

const { initializeApp } = require("./init.js");
const { configApp } = require("./config.js");
const { tokenApp } = require("./token.js");
const { startServer } = require("./server.js");

const myArgs = process.argv.slice(2);

if (DEBUG) if (myArgs.length >= 1) console.log("the myapp.args: ", myArgs);

switch (myArgs[0]) {
  case "init":
  case "i":
    if (DEBUG) console.log(myArgs[0], " - initialize the app.");
    myEmitter.emit(
      "event",
      "init accessed    ",
      "INFO",
      "initializing the app"
    );
    initializeApp();
    break;
  case "config":
  case "c":
    if (DEBUG) console.log(myArgs[0], " - display the configuration file");
    myEmitter.emit(
      "event",
      "config accessed    ",
      "INFO",
      "configuring the app"
    );
    configApp();
    break;
  case "token":
  case "t":
    if (DEBUG) console.log(myArgs[0], " - generate a user token");
    myEmitter.emit(
      "event",
      "token accessed    ",
      "INFO",
      "accessing the token route"
    );
    tokenApp();
    break;
  case "server":
  case "s":
    if (DEBUG) console.log(myArgs[0], " - start the server");
    myEmitter.emit("event", "server accessed", "INFO", "starting the server");
    startServer();
    break;
  case "help":
  case "h":
    myEmitter.emit(
      "event",
      "help accessed    ",
      "INFO",
      "accessing the help file"
    );
    break;
  default:
    fs.readFile(__dirname + "/usage.txt", (error, data) => {
      if (error) throw error;
      myEmitter.emit(
        "event",
        "default accessed",
        "INFO",
        "accessing the help file"
      );
      console.log(data.toString());
    });
}
