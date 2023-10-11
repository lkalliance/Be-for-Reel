// Various functions having to do with logging in and out

import decode from "jwt-decode";
import { userVoteProps, userData } from "./interfaces";

interface userInfoReturn {
  data: userData;
}

class AuthService {
  getProfile() {
    if (this.loggedIn()) {
      const userInfo: userInfoReturn = decode(this.getToken());
      return {
        userName: userInfo.data.userName,
        email: userInfo.data.email,
        _id: userInfo.data._id,
        compareUserName: userInfo.data.compareUserName,
        votes: userInfo.data.votes,
      };
    }
    return { userName: "", _id: "", email: "", compareUserName: "", votes: [] };
  }

  loggedIn() {
    const token = this.getToken();
    return token ? true : false;
  }

  isTokenExpired(token: string) {
    const decoded = decode(token);
    console.log(decoded);
    // if (decoded.exp < Date.now() / 1000) {
    //   localStorage.removeItem("id_token");
    //   return true;
    // }
    return false;
  }

  getToken() {
    return localStorage.getItem("id_token") || "";
  }

  login(idToken: string) {
    localStorage.setItem("id_token", idToken);
    // window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("b4r_username");
    window.location.assign("/");
  }
}

export default new AuthService();
