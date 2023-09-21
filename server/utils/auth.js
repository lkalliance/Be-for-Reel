const jwt = require("jsonwebtoken");

const secret = "youkilledtheinvisibleswordsman";
const expiration = "30d";

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    return req;
  },
  signToken: function ({ email, userName, _id, voted }) {
    const payload = { email, userName, _id, voted };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
