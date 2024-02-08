// This component renders the navigation

import "./Nav.css";
import { useState, Dispatch, SetStateAction } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  faMagnifyingGlass,
  faUser,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../../utils/auth";
import { SearchForm, UserMenu } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface headerNavProps {
  loggedIn: boolean;
  setLogIn: Dispatch<SetStateAction<boolean>>;
}

export function HeaderNav({ loggedIn, setLogIn }: headerNavProps) {
  const Auth = new AuthService();
  const userInfo = Auth.getProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [search, setSearch] = useState("");

  const searchPop = (e: React.MouseEvent<HTMLDivElement>) => {
    // show or hide the search box
    e.preventDefault();
    setShowSearch(!showSearch);
    setShowUserMenu(false);
  };

  const handleSearchSubmit = async () => {
    // send search request
    if (search.length < 3) return;
    setShowSearch(false);
    const term = String(search);
    setSearch("");
    navigate(`/search/${term}`);
  };

  const closeMenus = () => {
    setShowSearch(false);
    setShowUserMenu(false);
  };

  return (
    <Navbar expand="md" collapseOnSelect={true} bg="transparent" variant="dark">
      <Container>
        <Link to="/" className="navbar-brand" onClick={closeMenus}>
          <img src="/b4r-full.png" alt="Be for Reel" />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {loggedIn ? (
              <>
                <LinkContainer to={`/${userInfo.lookupName}`}>
                  <Nav.Link
                    className="user"
                    onClick={() => closeMenus()}
                  >{`${userInfo.userName}`}</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/">
                  <Nav.Link
                    onClick={(e) => {
                      setShowSearch(false);
                      e.preventDefault();
                      Auth.logout();
                      setLogIn(false);
                    }}
                    id="logout-link"
                  >
                    Log out
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/create">
                  <Nav.Link onClick={() => closeMenus()}>Create</Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link onClick={() => closeMenus()}>
                  Log in or sign up
                </Nav.Link>
              </LinkContainer>
            )}

            <LinkContainer to="/polls">
              <Nav.Link onClick={() => closeMenus()}>Polls</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/users">
              <Nav.Link onClick={() => closeMenus()}>Users</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/top-films">
              <Nav.Link onClick={() => closeMenus()}>Films</Nav.Link>
            </LinkContainer>
            {loggedIn && (
              <NavItem
                className={`user-icon faq-round ${showUserMenu && "open"}`}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  setShowSearch(false);
                  setShowUserMenu(!showUserMenu);
                }}
                onMouseOver={() => {
                  setShowUserMenu(true);
                  setShowSearch(false);
                }}
                onMouseOut={() => {
                  setShowUserMenu(false);
                }}
              >
                <FontAwesomeIcon icon={faUser} />
                {showUserMenu && (
                  <UserMenu
                    uname={userInfo.userName}
                    lookup={userInfo.lookupName}
                    menu={showUserMenu}
                    setMenu={setShowUserMenu}
                    setLogIn={setLogIn}
                    setShowSearch={setShowSearch}
                  />
                )}
              </NavItem>
            )}
            <LinkContainer to="/faq">
              <Nav.Link className="faq-round" onClick={() => closeMenus()}>
                <FontAwesomeIcon icon={faCircleQuestion} />
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
        show={showSearch}
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearchSubmit}
      />
    </Navbar>
  );
}
