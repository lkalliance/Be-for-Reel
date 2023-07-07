import decode from "jwt-decode";

interface userData {
  email: string;
  userName: string;
  _id: string;
  iat: number;
  exp: number;
}

interface userInfoReturn {
  data: userData;
}

class AuthService {
  getProfile() {
    if (this.loggedIn()) {
      const userInfo: userInfoReturn = decode(this.getToken());
      return { username: userInfo.data.userName, id: userInfo.data._id };
    }
    return { username: "", id: "" };
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
