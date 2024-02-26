const express = require("express");
const app = express();
const bodyParser = require("body-parser");

global.DEBUG = false;

const { tokenApp, newToken } = require("./token.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Existing routes

function startServer(port = 3010) {
  // Additional routes
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

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export the startServer function
module.exports = {
  startServer,
};
