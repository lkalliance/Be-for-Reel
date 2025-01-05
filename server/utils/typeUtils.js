module.exports = {
  cleanUsername: function (userName) {
    // converts a username to something displayable:
    // condense duplicated spaces,
    // remove all special characters but single quotes
    const cleanedName = userName
      .trim()
      .replace(/^[^a-zA-Z]+/, "")
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

  condenseGenres: function (genreLists, userGenre) {
    // finds genres common to all provided movies
    const genres = genreLists.reduce((prev, curr) =>
      prev.filter((genre) => curr.includes(genre))
    );
    // adds the user's chosen genre if not already there
    if (genres.indexOf(userGenre) === -1) genres.push(userGenre.toLowerCase());
    return genres;
  },

  createGenreList: function (genreList) {
    // creates a master list of all genres
    const genres = ["all"];
    // iterate over all genres
    for (let i = 0; i < genreList.length; i++) {
      genres.push(genreList[i].title);
    }
    return genres;
  },

  createDates: function () {
    // creates current, expiration, edit and deactivate deadlines

    const expDays = 30; // days until expiration
    const editMin = 0; // minutes until editing locked
    const deacDays = 2; // days until deactivation locked

    const today = new Date();
    const exp = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + expDays,
      0,
      0,
      0
    );
    const edit = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      today.getHours(),
      today.getMinutes() + editMin,
      0
    );
    const deac = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + deacDays,
      0,
      0,
      0
    );
    return { today, exp, edit, deac };
  },

  setStatuses: function (polls) {
    // turns deadline dates into booleans

    // console.log(polls);

    const editLimit = 0;
    const today = new Date();
    const newPolls = polls.map((poll) => {
      const voteTotal =
        typeof poll._doc.votes === "number"
          ? poll._doc.votes
          : poll._doc.votes.length;
      return {
        ...poll._doc,
        expired: poll._doc.expires_on < today,
        editable: voteTotal < editLimit,
        deactivatable:
          !poll._doc.deactivated && poll.deactivate_deadline > today,
      };
    });

    return newPolls;
  },
};
