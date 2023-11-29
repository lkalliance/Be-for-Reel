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

            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/polls">
              <Nav.Link>Polls</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    // <nav className="navbar navbar-expand-lg navbar-light bg-light">
    //   <div className="container-fluid">
    //     <Link to="/" className="navbar-brand">
    //       <img src="/b4r-full.png" alt="Be for Reel" />
    //     </Link>
    //     <button
    //       className="navbar-toggler"
    //       type="button"
    //       data-bs-toggle="collapse"
    //       data-bs-target="#navbarTogglerDemo02"
    //       aria-controls="navbarTogglerDemo02"
    //       aria-expanded="false"
    //       aria-label="Toggle navigation"
    //     >
    //       <span className="navbar-toggler-icon"></span>
    //     </button>
    //     <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
    //       <ul className="navbar-nav me-auto mb-2 mb-lg-0">
    //         {Auth.loggedIn() ? (
    //           <>
    //             <li className="nav-item">
    //               <NavLink
    //                 to={`/${lookup}`}
    //                 className="user"
    //               >{`${uname}`}</NavLink>
    //             </li>
    //             <li className="nav-item">
    //               <a
    //                 href="/"
    //                 onClick={(e) => {
    //                   e.preventDefault();
    //                   Auth.logout();
    //                 }}
    //               >
    //                 Log out
    //               </a>
    //             </li>
    //             <li className="nav-item">
    //               <NavLink to="/create">Create a Poll</NavLink>
    //             </li>
    //           </>
    //         ) : (
    //           <li className="nav-item">
    //             <NavLink to="/login">Log in or sign up</NavLink>
    //           </li>
    //         )}
    //         <li className="nav-item">
    //           <NavLink to="/">Home</NavLink>
    //         </li>
    //         <li className="nav-item">
    //           <NavLink to="/polls">Polls</NavLink>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </nav>
  );
}
