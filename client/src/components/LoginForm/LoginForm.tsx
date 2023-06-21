import "./LoginForm.css";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    return id === "username" ? setUsername(value) : setPassword(value);
  };
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Username ${username} and password ${password}`);
  };
  return (
    <form>
      <label>username</label>
      <input
        type="text"
        placeholder="username"
        id="username"
        onChange={handleInputChange}
      />
      <label>password</label>
      <input
        type="password"
        placeholder="password"
        id="password"
        onChange={handleInputChange}
      />
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
}
