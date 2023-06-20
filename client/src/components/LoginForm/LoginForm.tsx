import "./LoginForm.css";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Form>
      <Form.Group className="mb-3" controlId="loginForm.usernameInput">
        <Form.Label>username</Form.Label>
        <Form.Control type="text" placeholder="username" />
      </Form.Group>
      <Form.Group controlId="loginForm.passwordInput">
        <Form.Label>password</Form.Label>
        <Form.Control type="password" placeholder="password" />
      </Form.Group>
      <Button>Submit</Button>
    </Form>
  );
}
