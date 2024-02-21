// This component renders the navigation

/* REQUIRED PROPS:
loggedIn: flag for whether a user is logged in
setLogIn: setter for the flag */

import "./Nav.css";
import { useState, Dispatch, SetStateAction } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  faMagnifyingGlass,
  faUser,
  faCircleQuestion,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../../utils/auth";
import { SearchForm, UserMenu, UserIcon } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface headerNavProps {
  loggedIn: boolean;
  setLogIn: Dispatch<SetStateAction<boolean>>;
}

export function HeaderNav({ loggedIn, setLogIn }: headerNavProps) {
  const auth = new AuthService();
  const { userName, lookupName } = auth.getProfile();
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
            {!loggedIn && (
              <LinkContainer to="/login">
                <Nav.Link onClick={() => closeMenus()}>
                  Log in or sign up
                </Nav.Link>
              </LinkContainer>
            )}

            {loggedIn && (
              <LinkContainer to="/create">
                <Nav.Link onClick={() => closeMenus()}>Create</Nav.Link>
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

            {loggedIn && (
              <>
                <Navbar.Text
                  className={`click-to-navigate user${
                    showUserMenu ? " show-menu" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    setShowSearch(false);
                    navigate(`/${lookupName}`);
                  }}
                  onMouseOver={() => {
                    setShowUserMenu(true);
                    setShowSearch(false);
                  }}
                  onMouseOut={() => {
                    setShowUserMenu(false);
                  }}
                >
                  <UserIcon username={userName} />
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    className="caret-right reverse"
                  />
                  {showUserMenu && (
                    <UserMenu
                      uname={userName}
                      lookup={lookupName}
                      setMenu={setShowUserMenu}
                      setLogIn={setLogIn}
                      setShowSearch={setShowSearch}
                      showUserName={false}
                    />
                  )}
                </Navbar.Text>
                <Navbar.Text
                  className={`click-to-show user${
                    showUserMenu ? " show-menu" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    setShowSearch(false);
                    setShowUserMenu(!showUserMenu);
                  }}
                  onMouseOver={() => {
                    setShowSearch(false);
                  }}
                >
                  {`${userName}`}
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    className="caret-right reverse"
                  />
                  {showUserMenu && (
                    <UserMenu
                      uname={userName}
                      lookup={lookupName}
                      setMenu={setShowUserMenu}
                      setLogIn={setLogIn}
                      setShowSearch={setShowSearch}
                      showUserName={false}
                    />
                  )}
                </Navbar.Text>
                <NavItem
                  className={`click-to-navigate user-icon faq-round ${
                    showUserMenu && "show-menu"
                  }`}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    setShowSearch(false);
                    navigate(`/${lookupName}`);
                  }}
                  onMouseOver={() => {
                    setShowUserMenu(true);
                    setShowSearch(false);
                  }}
                  onMouseOut={() => {
                    setShowUserMenu(false);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className={showUserMenu ? "show-menu" : ""}
                  />
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    className="caret-right reverse"
                  />
                  {showUserMenu && (
                    <UserMenu
                      uname={userName}
                      lookup={lookupName}
                      setMenu={setShowUserMenu}
                      setLogIn={setLogIn}
                      setShowSearch={setShowSearch}
                      showUserName={true}
                    />
                  )}
                </NavItem>
                <NavItem
                  className={`click-to-show user-icon faq-round ${
                    showUserMenu && "show-menu"
                  }`}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    setShowSearch(false);
                    setShowUserMenu(!showUserMenu);
                  }}
                  onMouseOver={() => {
                    setShowSearch(false);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className={showUserMenu ? "show-menu" : ""}
                  />
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    className="caret-right reverse"
                  />
                  {showUserMenu && (
                    <UserMenu
                      uname={userName}
                      lookup={lookupName}
                      setMenu={setShowUserMenu}
                      setLogIn={setLogIn}
                      setShowSearch={setShowSearch}
                      showUserName={true}
                    />
                  )}
                </NavItem>
              </>
            )}
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
