// Node.js common core global modules
const fs = require("fs");
const path = require("path");
const crc32 = require("crc/crc32");
const { format } = require("date-fns");
const myEmitter = require("./logEvents.js");
const myArgs = process.argv.slice(2);

function tokenList() {
  if (DEBUG) console.log("token.tokenCount()");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    console.log("** User List **");
    tokens.forEach((obj) => {
      console.log(" * " + obj.username + ": " + obj.token);
    });
  });
}

function countTokens() {
  if (DEBUG) console.log("token.countTokens()");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    console.log("Total tokens:", tokens.length);
  });
}

// Search user by username email or phone number
function searchUser(query) {
  fs.readFile(
    path.join(__dirname, "json/tokens.json"),
    "utf-8",
    (error, data) => {
      if (error) throw error;
      let tokens = JSON.parse(data);
      let lowercasedQuery = query.toLowerCase();
      let results = tokens.filter(
        (obj) =>
          obj.username.toLowerCase().includes(lowercasedQuery) ||
          obj.email.toLowerCase().includes(lowercasedQuery) ||
          obj.phone.toLowerCase().includes(lowercasedQuery)
      );
      if (results.length > 0) {
        console.log("Search Results:");
        results.forEach((obj) => {
          console.log(` * ${obj.username}: ${obj.token}`);
        });
      } else {
        console.log("No matching user records found.");
      }
    }
  );
}

// Function to update user record with email and/or phone number
function updateUser(username, email, phone) {
  // Read the tokens from the JSON file

  fs.readFile(
    path.join(__dirname, "json/tokens.json"),
    "utf-8",
    (error, data) => {
      if (error) throw error;

      // Parse the JSON data
      let tokens = JSON.parse(data);

      // Find the user record by username
      let user = tokens.find(
        (token) => token.username.toLowerCase() === username.toLowerCase()
      );

      // If user exists, update email and/or phone number
      if (user) {
        if (email) user.email = email;
        if (phone) user.phone = phone;

        // Write the updated tokens back to the JSON file
        fs.writeFile(
          path.join(__dirname, "json/tokens.json"),
          JSON.stringify(tokens, null, 2),
          (err) => {
            if (err) throw err;
            console.log("User record updated successfully.");
          }
        );
      } else {
        console.log("User not found.");
      }
    }
  );
}

function newToken(username) {
  if (DEBUG) console.log("token.newToken()");
  let newToken = JSON.parse(`{
      "created": "1969-01-31 12:30:00",
      "username": "username",
      "email": "user@example.com",
      "phone": "5556597890",
      "token": "token",
      "expires": "1969-02-03 12:30:00",
      "confirmed": "tbd"
  }`);

  let now = new Date();
  let expires = addDays(now, 3);

  newToken.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
  newToken.username = username;
  newToken.token = crc32(username).toString(16);
  newToken.expires = `${format(expires, "yyyy-MM-dd HH:mm:ss")}`;

  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    tokens.push(newToken);
    userTokens = JSON.stringify(tokens);

    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) console.log(err);
      else {
        console.log(`New token ${newToken.token} was created for ${username}.`);
      }
    });
  });
  return newToken.token;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function tokenApp() {
  if (DEBUG) console.log("tokenApp()");

  switch (myArgs[1]) {
    case "--count":
      if (DEBUG) console.log("--count");
      countTokens();
      myEmitter.emit(
        "event",
        "token.count accessed         ",
        "INFO",
        "displaying the total number of tokens"
      );
      break;
    case "--update":
      if (myArgs.length < 5) {
        console.log(
          "Invalid syntax. Use: node myapp token --update [username] [email] [phone]"
        );
      } else {
        updateUser(myArgs[2], myArgs[3], myArgs[4]);
        myEmitter.emit(
          "event",
          "token.update accessed         ",
          "INFO",
          "updating user record with email and/or phone number"
        );
      }
      break;
    case "--search":
      if (myArgs.length < 3) {
        console.log("Invalid syntax. Usage: node myapp token --search [query]");
      } else {
        searchUser(myArgs[2]);
        myEmitter.emit(
          "event",
          "token.search accessed         ",
          "INFO",
          "searching for user by username, email, or phone number"
        );
      }
      break;
    case "--list":
      if (DEBUG) console.log("--list");
      tokenList();
      myEmitter.emit(
        "event",
        "token.list accessed             ",
        "INFO",
        "displaying the list of tokens"
      );
      break;
    case "--new":
      if (myArgs.length < 3) {
        console.log("invalid syntax. node myapp token --new [username]");
      } else {
        if (DEBUG) console.log("--new");
        newToken(myArgs[2]);
        myEmitter.emit(
          "event",
          "token.new accessed         ",
          "INFO",
          "generating a new token for a user"
        );
      }
      break;
    case "--help":
    case "--h":
      fs.readFile(__dirname + "/usage.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
      myEmitter.emit(
        "event",
        "token.help accessed         ",
        "INFO",
        "displaying the help file for token options"
      );
      break;
    default:
  }
}

module.exports = {
  tokenApp,
};
