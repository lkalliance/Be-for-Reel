const router = require("express").Router();
require("dotenv").config();
const nodemailer = require("nodemailer");
const { User, Confirmation } = require("../../models");

router.post("/validate-send", async (req, res) => {
  // This route sends a confirmation email to a newly-added user

  const transporter = nodemailer.createTransport({
    host: "mailout.easymail.ca",
    port: 465,
    secure: true,
    auth: {
      user: "support@be-for-reel.com",
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const conf = await Confirmation.findOne({ email: req.body.email });

  const mailOptions = {
    from: "support@be-for-reel.com",
    to: req.body.email,
    subject: "Be for Reel: confirm your email account",
    text: `You successfully registered an account on Be for Reel. To confirm your email address and activate your account, copy and paste this address into your web browser: ${process.env.SERVER_HOST}#/email/${conf.confirmation_token}`,
    html: `<html>
    <head>
      <style>
        html {height: 100%}
        body {color: #01141e; height: 100%}
        div {color: #01141e; padding: 18px; height: 100%;}
        img {width: 100px; display: block; margin: 12px auto;}
        p {text-align: center;}
        a {text-decoration: none; font-weight: bold; padding: 12px; margin: 20px auto; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div style="height:100%;text-align:center;">
        <img src="https://be-4-reel-9f2cbf237830.herokuapp.com/b4r-full.png" style="width:100px;display:block;margin:12px auto;" />
        <p style="color:#01141e;text-align:center;padding:18px;">
          You successfully registered an account on Be for Reel.<br/>Click the link below to confirm your email address and activate your account.
        </p>
        <a href="${process.env.SERVER_HOST}#/email/${conf.confirmation_token}" style="color:#01141e;padding:20px;margin:12px auto;">
          Confirm ${req.body.email}
        </a>
      </div>
    </body>
    </html>`,
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

router.post("/forgot-pwd", async (req, res) => {
  // This route sends an email to a user that has forgotten their password

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

  const conf = await Confirmation.findOne({
    email: req.body.forgotEmail,
    confirmation_type: "forgot",
  });

  if (!conf) {
    res.status(400).json({ message: "confirmation expired" });
  }

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: req.body.forgotEmail,
    subject: "Be for Reel: reset your password",
    text: `You requested a password reset for your Be for Reel account. To reset your password, copy and paste this address into your web browser: ${process.env.SERVER_HOST}#/pwd/${conf.confirmation_token}`,
    html: `<html>
    <head>
      <style>
        html {height: 100%}
        body {background-color: #01141e; color: white; height: 100%}
        div {background-color: #01141e; color: white; padding: 18px; height: 100%;}
        img {width: 100px; display: block; margin: 12px auto;}
        p {text-align: center;}
        a {text-decoration: none; background-color: #1ba098; font-weight: bold; padding: 12px; margin: 20px auto; border-radius: 8px; }
      </style>
    </head>
    <body style="background-color:#011413;" bgcolor="#011413">
      <div style="height:100%;background-color:#01141e;text-align:center;" bgcolor="#011413">
        <img src="https://be-4-reel-9f2cbf237830.herokuapp.com/b4r-full.png" style="width:100px;display:block;margin:12px auto;" />
        <p style="color:white;text-align:center;padding:18px;">
          You requested a password reset for your Be for Reel account.<br/>Click the link below to reset your password.
        </p>
        <a href="${process.env.SERVER_HOST}#/pwd/${conf.confirmation_token}" style="background-color:#1ba098;color:white;padding:20px;margin:12px auto;">
          Reset password
        </a>
      </div>
    </body>
    </html>`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("transporter sendMail error");
      console.log(err);
    } else console.log(`email sent to ${req.body.forgotEmail}`);
  });

  res.status(200).json({
    message: `Success.`,
  });
});

router.post("/contact-us", async (req, res) => {
  // This route sends a confirmation email to a newly-added user

  console.log(req.body);
  res.status(200);

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

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: "bbforreel@gmail.com",
    subject: "Message from Be for Reel user",
    text: `${req.body.username ? `User ${req.body.username}` : "A user"} from ${
      req.email
    } send the following message:
    
    ${req.body.message}`,
    html: `<html>
    <head />
    <body>
      <div style="height:100%;text-align:center;">
        <img src="https://be-4-reel-9f2cbf237830.herokuapp.com/b4r-full.png" style="width:100px;display:block;margin:12px auto;" />
        ${req.body.username ? `User ${req.body.username}` : "A user"} from ${
      req.body.email
    } send the following message:
    
    ${req.body.message}
      </div>
    </body>
    </html>`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("transporter sendMail error");
      console.log(err);
    } else console.log(`Contact us sent from ${req.body.email}`);
  });

  res.status(200).json({
    message: `Success.`,
  });
});

router.get("/validate-code", async (req, res) => {
  // This route accepts the validation code

  try {
    // first look for this confirmation code
    const confirmation = await Confirmation.findOne({
      confirmation_token: req.query.eToken,
    });
    // if the conf code doesn't exist, say so and exit
    if (!confirmation) {
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
