export interface iUserAuth {
  email: String;
  username: String;
  _id: String;
}

export interface iAddUser {
  username: String;
  email: String;
  password: String;
}

export interface iLogin {
  username: String;
  password: String;
}
