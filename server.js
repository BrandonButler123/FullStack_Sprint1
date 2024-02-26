const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");

const { initializeApp } = require("./init.js");
const { configApp } = require("./config.js");
const { tokenApp, newToken } = require("./token.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Existing routes

app.get("/newToken", (req, res) => {
  res.render("newToken");
});

app.post("/generate-token", (req, res) => {
  const { username, email, phone } = req.body;

  // Generate token using the imported function
  const generatedToken = newToken(username);

  // Save newToken to tokens.json
  tokenApp(generatedToken);

  res.send(`Token generated for ${username}: ${generatedToken}`);
});

// Existing code for CLI

app.listen(3010, () => {
  console.log("Server is running on http://localhost:3010");
});
