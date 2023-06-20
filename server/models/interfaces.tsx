export interface iUserPolls {
  poll_id: string;
  title: string;
  votes: number;
  comments: number;
}

export interface iUserComments {
  poll_id: string;
  title: string;
  movie: string;
  text: string;
}

export interface iUser {
  username: string;
  email: string;
  password: string;
  votes: string[];
  polls: iUserPolls[];
  comments: iUserComments[];
}
