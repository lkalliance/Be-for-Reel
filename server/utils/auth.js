const jwt = require("jsonwebtoken");

const secret = "youkilledtheinvisibleswordsman";
const expiration = "30d";
const utils = require("./typeUtils");

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
  signToken: function ({ email, userName, lookupName, _id, votes }) {
    const voteGuide = utils.createVoteGuide(votes);
    const payload = { email, userName, lookupName, _id, votes: voteGuide };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
