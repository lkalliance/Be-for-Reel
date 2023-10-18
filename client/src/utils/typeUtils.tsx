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

  console.log(
    `The createLookupName function thinks the user is ${userName}...`
  );

  const lookupName = userName
    .replace(/\s+/g, " ")
    .replace(/[^A-Za-z0-9\s\'\‘]/g, "")
    .replace(/[\'\‘']/g, "")
    .replaceAll(" ", "-")
    .toLowerCase();

  console.log(`...and it converted to ${lookupName}`);
  return lookupName;
};
