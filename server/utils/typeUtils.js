module.exports = {
  cleanUsername: function (userName) {
    // converts a username to something displayable:
    // condense duplicated spaces,
    // remove all special characters but single quotes
    const cleanedName = userName
      .replace(/\s+/g, " ")
      .replace(/[^A-Za-z0-9\s\'\‘\,]/g, "");
    return cleanedName;
  },
  createLookupName: function (userName) {
    // converts a username to a lookupname:
    // lowercase alphanumeric, with hyphens for spaces
    const lookupName = userName
      .replace(/\s+/g, " ")
      .replace(/[^A-Za-z0-9\s]/g, "")
      .replaceAll(" ", "-")
      .toLowerCase();
    return lookupName;
  },
  createUrlTitle: function (title) {
    // converts a poll title to URL-used form:
    // lowercase alphanumeric, with hyphens for spaces
    const pollUrlTitle = title
      .toLowerCase()
      .replace(/[^a-zA-Z\d\s\-]/g, "")
      .replace(/[\s]+/g, "-");
    return pollUrlTitle;
  },
  createVoteGuide: function (votes) {
    // creates a vote history object to store in token
    const voteObj = {};
    votes.map((vote) => {
      voteObj[vote.poll_id] = vote.movie;
    });
    return voteObj;
  },
};
