module.exports = {
  cleanUsername: function (userName) {
    const cleanedName = userName
      .replace(/\s+/g, " ")
      .replace(/[^A-Za-z0-9\s\'\‘]/g, "");
    return cleanedName;
  },
  createLookupName: function (userName) {
    const lookupName = userName
      .replace(/\s+/g, " ")
      .replace(/[^A-Za-z0-9\s\'\‘]/g, "")
      .replace(/[\'\‘']/g, "")
      .replaceAll(" ", "-")
      .toLowerCase();
    return lookupName;
  },
  createUrlTitle: function (title) {
    const pollUrlTitle = title
      .toLowerCase()
      .replace(/[^a-zA-Z\d\s\-]/g, "")
      .replace(/[\s]+/g, "-");
    return pollUrlTitle;
  },
};
