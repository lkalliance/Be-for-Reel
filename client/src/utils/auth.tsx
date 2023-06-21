import jwt_decode from "jwt-decode";

class AuthService {
  // getProfile() {
  //   return decode(this.getToken());
  // }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  }

  isTokenExpired(token: string) {
    const decoded = jwt_decode(token);
    // if (decoded.exp < Date.now() / 1000) {
    //   localStorage.removeItem("id_token");
    //   return true;
    // }
    return false;
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  login(idToken: string) {
    localStorage.setItem("id_token", idToken);
    // window.location.reload();
  }

  logout() {
    localStorage.removeItem("id_token");
    window.location.reload();
  }
}

export default new AuthService();
