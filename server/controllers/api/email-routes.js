const router = require("express").Router();
require("dotenv").config();
const nodemailer = require("nodemailer");
const { User, Confirmation } = require("../../models");

router.post("/validate-send", async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    user: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "login",
      user: process.env.MAIL_USERNAME,
      pass: process.env.APP_PASSWORD,
    },
  });
  const conf = await Confirmation.findOne({ email: req.body.email });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: req.body.email,
    subject: "Be for Reel: confirm your email account",
    text: `You successfully registered an account on Be for Reel. To confirm your email address and activate your account, copy and paste this address into your web browser: https://www.be-for-reel.com/#/email/${conf.confirmation_token}`,
    html: `<p>You successfully registered an account on Be for Reel. Click <a href="https://www.be-for-reel.com/#/email/${conf.confirmation_token}">this link</a> to confirm your email address and activate your account.`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("transporter sendMail error");
      console.log(err);
    } else console.log(`email sent to ${req.body.email}`);
  });

  res.status(200).json({
    message: `Success.`,
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
