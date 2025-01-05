export const listSection = (fullList: any[], page: number, perPage: number) => {
  // for pagination, returns a given segment of a full list

  // given current page, generates what to show currently
  const firstRecord = page === 1 ? 0 : (page - 1) * perPage;
  const last = firstRecord + perPage - 1;
  const lastRecord = last > fullList.length ? fullList.length : last + 1;
  const section = fullList.slice(firstRecord, lastRecord);

  return section;
};

export const cleanUsername = (userName: string) => {
  // converts a username to something displayable:
  // condense duplicated spaces,
  // remove all special characters but single quotes
  const cleanedName = userName
    .replace(/\s+/g, " ")
    .replace(/[^A-Za-z0-9\s\\]/g, "");
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

export const toggleNav = () => {
  // universal utility to close the navigation toggle
  const toggle: HTMLButtonElement | null = document.querySelector(
    "button#toggle-button"
  );
  const collapseTell = document.querySelector("div#basic-navbar-nav");
  const showing = collapseTell
    ? collapseTell.className.indexOf("show") !== -1
    : false;
  if (toggle && showing) toggle.click();
};

export const convertLengthVals = (index: number) => {
  const conversions = [0, 60, 90, 120, 150, 180, 210, 240, 999];
  const text = [
    "0 minutes",
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
  const text = ["$0", "$1M", "$10M", "$100M", "$250M", "$500M", "$1B", "any"];
  return { gross: conversions[index], label: text[index] };
};

export const convertDate = (date: Date) => {
  const dateObj = new Date(date);
  const formatted = `${dateObj.getMonth()} ${dateObj.getDate()}`;
  return formatted;
};

export const convertMonth = (date: Date) => {
  const dateObj = new Date(date);
  const today = new Date();
  const months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "June",
    "July",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec",
  ];

  return `${months[dateObj.getMonth()]} ${dateObj.getDate()}${
    dateObj.getFullYear() !== today.getFullYear()
      ? `, ${dateObj.getFullYear()}`
      : ""
  }`;
};

export const validateEmail = (text: string) => {
  return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(text);
};

export const thisYear = () => {
  const today = new Date();
  return today.getFullYear();
};

export const pollLimit = (type: string) => {
  return 30;
};

export const accountLimits = () => {
  return {
    password_min: 8,
    username_max: 20,
  };
};
