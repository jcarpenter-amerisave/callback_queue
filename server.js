// The server-side code (Node.js/Express)
// This code would be run on your web server.
// You would need to install Express and other dependencies with:
// npm install express body-parser jsonwebtoken
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 8888;
const smsRouter = require("./src/router/smsRouter");
const journeyBuilderRouter = require("./src/router/journeyBuilder");

// Middleware to parse the JWT from Journey Builder's POST request
app.use(bodyParser.raw({ type: "application/jwt" }));
app.use(express.static("public")); // Assuming static files (config.json, index.html) are in a 'public' directory

// Your secure API credentials - these should be environment variables in production
// These values are now used for the authentication payload you provided.

app.get("/health-status", (req, res) => {
  let obj = {
    data: { status: "ok", apiVersion: process.env.npm_package_version },
  };
  res.status(200).send(obj);
});

app.get("/", (req, res) => {
  const directoryPath = path.join(__dirname, 'public');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }
    res.send(files); // Sends an array of filenames
  });
});

// Routes
app.use("/sms-queue", smsRouter);
app.use("/journeybuilder", journeyBuilderRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
