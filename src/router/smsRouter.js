const express = require("express");
const router = express.Router({});

router.post("/incoming", (req, res) => {
  res.status(200).send("Hello World");
});


router.post("/outgoing", (req, res) => {
  res.status(200).send("Hello World");
});

module.exports = router;