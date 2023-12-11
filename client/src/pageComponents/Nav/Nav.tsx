// This component renders the navigation

import "./Nav.css";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { AuthService } from "../../utils/auth";

interface navProps {
  uname: string;
  lookup: string;
}

export function HeaderNav({ uname, lookup }: navProps) {
  const Auth = new AuthService();
  return (
    <Navbar expand="md" collapseOnSelect={true} bg="transparent" variant="dark">
      <Container>
        <Link to="/" className="navbar-brand">
          <img src="/b4r-full.png" alt="Be for Reel" />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {Auth.loggedIn() ? (
              <>
                <LinkContainer to={`/${lookup}`}>
                  <Nav.Link className="user">{`${uname}`}</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/">
                  <Nav.Link
                    onClick={(e) => {
                      e.preventDefault();
                      Auth.logout();
                    }}
                  >
                    Log out
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/create">
                  <Nav.Link>Create a Poll</Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>Log in or sign up</Nav.Link>
              </LinkContainer>
            )}

            <LinkContainer to="/polls">
              <Nav.Link>Polls</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/users">
              <Nav.Link>Users</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
