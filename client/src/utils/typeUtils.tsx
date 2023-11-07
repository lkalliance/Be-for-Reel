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

export const convertLengthVals = (index: number) => {
  const conversions = [0, 30, 60, 90, 120, 150, 180, 210, 240, 999];
  const text = [
    "0 minutes",
    "30 minutes",
    "1 hour",
    "1½ hour",
    "2 hours",
    "2½ hours",
    "3 hours",
    "3½ hours",
    "4 hours",
    "any",
  ];
  return { minutes: conversions[index], label: text[index] };
};

export const convertGrossVals = (index: number) => {
  const conversions = [
    0, 1000000, 10000000, 100000000, 250000000, 500000000, 1000000000, 999,
  ];
  const text = [
    "$0",
    "$1 million",
    "$10 million",
    "$100 million",
    "$250 million",
    "$500 million",
    "$1 billion",
    "any",
  ];
  return { gross: conversions[index], label: text[index] };
};
