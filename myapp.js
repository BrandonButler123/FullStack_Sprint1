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
      if (myArgs[1] === "--help" || myArgs[1] === "--h") {
        // Display help information for init command
        console.log("Help for init command:");
        console.log("--all: Create folder structure, config, and help files");
        console.log("--mk: Create folder structure");
        console.log("--cat: Create config file with default settings and help files");
      } else {
        if (DEBUG) console.log(myArgs[0], " - initialize the app.");
        myEmitter.emit(
          "event",
          "init accessed                ",
          "INFO",
          "initializing the app"
        );
        initializeApp();
      }
      break;
    case "config":
    case "c":
      if (myArgs[1] === "--help" || myArgs[1] === "--h") {
        // Display help information for config command
        console.log("Help for config command:");
        console.log("--show: Display configuration file");
        console.log("--reset: Reset configuration to default");
        console.log("--set <option> <value>: Set configuration key to value");
        console.log("--view: views current config file");
      } else {
        if (DEBUG) console.log(myArgs[0], " - display the configuration file");
        myEmitter.emit(
        "event",
        "config accessed                ",
        "INFO",
        "configuring the app"
      );
      configApp();
    }
    break;
  case "token":
  case "t":
    if (myArgs[1] === "--help" || myArgs[1] === "--h") {
      // Display help information for token command
      console.log("Help for token command:");
      console.log("--list: Display list of tokens");
      console.log("--new [username]: Generate a new token for the specified username");
      console.log("--update [username] [email] [phone]: Update user record with new email and/or phone number");
      console.log("--search [username/email/phone]: Search for a user record by username, email, or phone number");
    } else {
      if (DEBUG) console.log(myArgs[0], " - generate a user token");
      myEmitter.emit(
        "event",
        "token accessed                ",
        "INFO",
        "accessing the token route"
      );
      tokenApp();
    }
    break;
  case "server":
  case "s":
    if (DEBUG) console.log(myArgs[0], " - start the server");
    myEmitter.emit(
      "event",
      "server accessed                ",
      "INFO",
      "starting the server"
    );
    startServer();
    break;
  case "help":
  case "h":
    myEmitter.emit(
      "event",
      "help accessed            ",
      "INFO",
      "accessing the help file"
    );
    break;
  default:
    fs.readFile(__dirname + "/usage.txt", (error, data) => {
      if (error) throw error;
      myEmitter.emit(
        "event",
        "default accessed            ",
        "INFO",
        "accessing the help file"
      );
      console.log(data.toString());
    });
}
