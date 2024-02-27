const fs = require("fs");
const myArgs = process.argv.slice(2);
const myEmitter = require("./logEvents.js");

const { configjson } = require("./templates");

function displayConfig() {
  if (DEBUG) console.log("config.displayConfig()");
  fs.readFile(__dirname + "/json/config.json", (error, data) => {
    if (error) throw error; // should write a log event for the error, github issue #7
    console.log(JSON.parse(data));
  });
}

function resetConfig() {
  if (DEBUG) console.log("config.resetConfig()");
  let configdata = JSON.stringify(configjson, null, 2);
  // if(DEBUG) console.log(__dirname + './json/config.json');
  // if(DEBUG) console.log(configdata);
  fs.writeFile(__dirname + "/json/config.json", configdata, (error) => {
    if (error) throw error;
    if (DEBUG) console.log("Config file reset to original state");
  });
}

function setConfig() {
  if (DEBUG) console.log("config.setConfig()");
  if (DEBUG) console.log(myArgs);

  let match = false;
  fs.readFile(__dirname + "/json/config.json", (error, data) => {
    if (error) throw error;
    if (DEBUG) console.log(JSON.parse(data));
    let cfg = JSON.parse(data);
    for (let key of Object.keys(cfg)) {
      if (DEBUG) console.log(`K E Y: ${key}`);
      if (key === myArgs[2]) {
        cfg[key] = myArgs[3];
        match = true;
      }
    }
    if (!match) {
      console.log(`invalid key: ${myArgs[2]}, try another.`);
    }
    if (DEBUG) console.log(cfg);
    data = JSON.stringify(cfg, null, 2);
    // looks like this code is writing the file again even if there is
    fs.writeFile(__dirname + "/json/config.json", data, (error) => {
      if (error) throw error;
      if (DEBUG) console.log("Config file successfully updated.");
    });
  });
}

function viewConfig() {
  fs.readFile("json/config.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading configuration file:", err);
      return;
    }
    try {
      const config = JSON.parse(data);
      console.log("Current Configuration:");
      console.log(config);
    } catch (error) {
      console.error("Error parsing configuration data:", error);
    }
  });
}

function configApp() {
  if (DEBUG) console.log("configApp()");

  switch (myArgs[1]) {
    case "--show":
      if (DEBUG) console.log("--show");
      displayConfig();
      myEmitter.emit(
        "event",
        "congig.show accessed",
        "INFO",
        "displaying the current configuration"
      );
      break;
    case "--reset":
      if (DEBUG) console.log("--reset");
      resetConfig();
      myEmitter.emit(
        "event",
        "congig.reset accessed",
        "INFO",
        "resetting the current configuration"
      );
      break;
    case "--set":
      if (DEBUG) console.log("--set");
      setConfig();
      myEmitter.emit(
        "event",
        "config.set accessed",
        "INFO",
        "setting the current configuration"
      );
      break;
    case "--view":
      if (DEBUG) console.log("--view");
      viewConfig();
      myEmitter.emit(
        "event",
        "congif.view accessed",
        "INFO",
        "displaying the current configuration"
      );
      break;
    case "--help":
    case "--h":
      myEmitter.emit(
        "event",
        "congif.help accessed",
        "INFO",
        "displaying the help file for configuration options"
      );
      break;
    default:
      fs.readFile(__dirname + "/usage.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
        myEmitter.emit(
          "event",
          "congif.default accessed     ",
          "INFO",
          "displaying the help file for configuration options"
        );
      });
  }
}

module.exports = {
  configApp,
};
