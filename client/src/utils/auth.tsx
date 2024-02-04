// Various functions having to do with logging in and out

import decode from "jwt-decode";
import { userData } from "./interfaces";

interface userInfoReturn {
  data: userData;
}

export class AuthService {
  getProfile() {
    if (this.loggedIn()) {
      const userInfo: userInfoReturn = decode(this.getToken());
      return {
        // user name to display
        userName: userInfo.data.userName,
        email: userInfo.data.email,
        _id: userInfo.data._id,
        confirmed: userInfo.data.confirmed,
        // user name to lookup
        lookupName: userInfo.data.lookupName,
        // object that holds user's votes for reference
        votes: userInfo.data.votes,
        activePolls: userInfo.data.activePolls,
      };
    }
    return {
      userName: "",
      _id: "",
      email: "",
      lookupName: "",
      confirmed: false,
      votes: {},
      activePolls: [],
    };
  }

  loggedIn() {
    const token = this.getToken();
    return token ? true : false;
  }

  // isTokenExpired(token: string) {
  //   const decoded = decode(token);
  //   if (decoded.exp < Date.now() / 1000) {
  //     localStorage.removeItem("id_token");
  //     return true;
  //   }
  //   return false;
  // }

  getToken() {
    return localStorage.getItem("id_token") || "";
  }

  login(idToken: string) {
    localStorage.setItem("id_token", idToken);
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("b4r_username");
  }
}
