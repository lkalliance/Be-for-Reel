const router = require("express").Router();
const { User, Confirmation } = require("../../models");

router.post("/validate-send", async (req, res) => {
  console.log("Sending a validation email", req.body.email);
  const conf = await Confirmation.findOne({ email: req.body.email });
  res.status(200).json({
    message: `Success. Confirmation code is ${conf.confirmation_token}`,
  });
});

router.get("/validate-code", async (req, res) => {
  try {
    // first look for this confirmation code
    const confirmation = await Confirmation.findOne({
      confirmation_token: req.query.eToken,
    });
    // if the conf code doesn't exist, say so and exit
    if (!confirmation.user_id) {
      res.status(400).json({ message: "Invalid confirmation token" });
      return;
    }
    // now update the user in the confirmation code record
    const user = await User.findOneAndUpdate(
      { _id: confirmation.user_id },
      { confirmed: true },
      { new: true, upset: false }
    );
    // if the user doesn't exist, say so and exit
    if (!user) {
      console.log("Nope!");
      res.status(400).json({ message: "Invalid user id" });
      return;
    }
    // delete the confirmation record and send back the 200
    await Confirmation.deleteOne({ confirmation_token: req.query.eToken });
    res.status(200).json({ message: "Email confirmed" });
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid confirmation token" });
    return;
  }
});

module.exports = router;
