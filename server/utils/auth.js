const jwt = require("jsonwebtoken");

const secret = "youkilledtheinvisibleswordsman";
const expiration = "30d";
const utils = require("./typeUtils");

const creationLimit = (type) => {
  return 2;
};

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
  signToken: function ({
    email,
    userName,
    lookupName,
    _id,
    votes,
    polls,
    confirmed,
  }) {
    const today = new Date();
    const activePolls = polls
      .map((poll) => {
        return { poll_id: poll._id, expires: poll.expires_on };
      })
      .filter((thisPoll) => {
        return new Date(thisPoll.expires) > today && !thisPoll.deactivated;
      });
    const voteGuide = utils.createVoteGuide(votes);
    const payload = {
      email,
      userName,
      lookupName,
      confirmed,
      _id,
      votes: voteGuide,
      activePolls,
    };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
