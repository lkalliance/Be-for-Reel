// This component renders the navigation

/* REQUIRED PROPS:
loggedIn: flag for whether a user is logged in
setLogIn: setter for the flag
setShowUserMenu: setter for closing the user menu
currentSwitch: what is the current a/b setting */

import "./Nav.css";
import {
  useState,
  forwardRef,
  useImperativeHandle,
  Dispatch,
  SetStateAction,
} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  faMagnifyingGlass,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { toggleNav } from "../../utils";
import { SearchForm } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface headerNavProps {
  loggedIn: boolean;
  setLogIn: Dispatch<SetStateAction<boolean>>;
  setShowUserMenu: Dispatch<SetStateAction<boolean>>;
  currentSwitch: string;
}

export const HeaderNav = forwardRef(
  ({ loggedIn, setShowUserMenu, currentSwitch }: headerNavProps, ref) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");

    // reference to search toggle to be able to attach its action anywhere
    useImperativeHandle(ref, () => ({
      closeSearch: () => {
        setShowSearch(false);
      },
    }));

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
      <Navbar
        expand="sm"
        collapseOnSelect={true}
        bg="transparent"
        variant="dark"
      >
        <Container>
          <Link
            to="/"
            className="navbar-brand"
            onClick={() => {
              closeMenus();
              toggleNav();
            }}
          >
            <img src="/b4r-full.png" alt="Be for Reel" />
          </Link>
          <Navbar.Toggle id="toggle-button" aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {loggedIn && (
                <LinkContainer to="/create" className="create-nav-link">
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

              {/* {loggedIn && (
              <> */}
              {/* <NavItem
                  className={`click-to-navigate user-icon faq-round ${
                    showUserMenu && "show-menu"
                  }`}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    setShowSearch(false);
                    // navigate(`/${lookupName}`);
                    toggleNav();
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
                </NavItem> */}

              {/* <NavItem
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
                </NavItem> */}
              {/* </>
            )} */}
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
);
