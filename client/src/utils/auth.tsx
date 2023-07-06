import jwt_decode from "jwt-decode";

class AuthService {
  // getProfile() {
  //   return decode(this.getToken());
  // }

  loggedIn() {
    const token = this.getToken();
    return token ? true : false;
  }

  isTokenExpired(token: string) {
    const decoded = jwt_decode(token);
    console.log(decoded);
    // if (decoded.exp < Date.now() / 1000) {
    //   localStorage.removeItem("id_token");
    //   return true;
    // }
    return false;
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  getUsername() {
    return localStorage.getItem("b4r_username");
  }

  login(idToken: string, username: string) {
    localStorage.setItem("id_token", idToken);
    localStorage.setItem("b4r_username", username);
    window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("b4r_username");
    window.location.assign("/");
  }
}

export default new AuthService();
