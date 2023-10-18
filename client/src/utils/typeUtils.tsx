export const cleanUsername = (userName: string) => {
  // converts a username to something displayable:
  // condense duplicated spaces,
  // remove all special characters but single quotes
  const cleanedName = userName
    .replace(/\s+/g, " ")
    .replace(/[^A-Za-z0-9\s\'\‘]/g, "");
  return cleanedName;
};

export const createLookupName = (userName: string) => {
  // converts a username to a lookupname:
  // lowercase alphanumeric, with hyphens for spaces

  const lookupName = userName
    .replace(/\s+/g, " ")
    .replace(/[^A-Za-z0-9\s]/g, "")
    .replaceAll(" ", "-")
    .toLowerCase();

  return lookupName;
};
