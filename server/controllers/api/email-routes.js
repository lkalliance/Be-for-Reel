const router = require("express").Router();
const fetch = require("axios");

router.post("/validate-send", async (req, res) => {
  console.log("Sending a validation email", req.body.email);
  res.status(200).json({ message: "Success!" });
});

router.get("/validate-code", async (req, res) => {
  console.log(`validating token ${req.query.token}`);
  res.status(200).json({ message: `received token ${req.query.token}` });
});

module.exports = router;
