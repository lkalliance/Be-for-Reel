// This component renders the navigation

/* REQUIRED PROPS:
uname: full username of current user
lookup: unique lookup name of the user */

import "./Nav.css";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../../utils/auth";
import { SearchForm } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface navProps {
  uname: string;
  lookup: string;
}

export function HeaderNav({ uname, lookup }: navProps) {
  const Auth = new AuthService();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(
    location.pathname.indexOf("/search") > -1
  );
  const [search, setSearch] = useState("");

  const searchPop = (e: React.MouseEvent<HTMLDivElement>) => {
    // show or hide the search box
    e.preventDefault();
    setShowSearch(!showSearch);
  };

  const handleSearchSubmit = async () => {
    // send search request
    if (search.length < 3) return;
    setShowSearch(false);
    const term = String(search);
    setSearch("");
    navigate(`/search/${term}`);
  };

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
                  <Nav.Link
                    className="user"
                    onClick={() => setShowSearch(false)}
                  >{`${uname}`}</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/">
                  <Nav.Link
                    onClick={(e) => {
                      setShowSearch(false);
                      e.preventDefault();
                      Auth.logout();
                    }}
                  >
                    Log out
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/create">
                  <Nav.Link onClick={() => setShowSearch(false)}>
                    Create
                  </Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link onClick={() => setShowSearch(false)}>
                  Log in or sign up
                </Nav.Link>
              </LinkContainer>
            )}

            <LinkContainer to="/polls">
              <Nav.Link onClick={() => setShowSearch(false)}>Polls</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/users">
              <Nav.Link onClick={() => setShowSearch(false)}>Users</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/top-films">
              <Nav.Link onClick={() => setShowSearch(false)}>Films</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/faq">
              <Nav.Link
                className="faq-round"
                onClick={() => setShowSearch(false)}
              >
                <div className="round">?</div>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to={location.pathname}>
              <Nav.Link id="search-toggle" onClick={searchPop}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <SearchForm
        show={showSearch || location.pathname.indexOf("/search/") >= 0}
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearchSubmit}
      />
    </Navbar>
  );
}
