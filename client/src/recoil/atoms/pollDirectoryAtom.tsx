import { atom } from "recoil";

export const genresAtom = atom({
  key: "genres",
  default: ["all"],
});
