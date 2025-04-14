import { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSignInAlt,
  FaUserPlus,
  FaHome,
  FaAddressBook,
  FaConciergeBell,
  FaSignOutAlt,
  FaComments,
} from "react-icons/fa";
import "./NavbarComponent.css";
function NavbarComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/"); // Redirects to home (login page)
  };

  const handleLoginRedirect = () => {
    if (isLoggedIn) {
      navigate("/dashboard"); // Redirect to dashboard if logged in
    } else {
      navigate("/"); // Navigate to login page if not logged in
    }
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      // className="shadow-sm"
      className="navbar-custom"
    >
      <Container>
        <Navbar.Brand as={Link} to={isLoggedIn ? "/dashboard" : "/"}>
          <img
            src="https://i.postimg.cc/NfM78ptP/Pngtree-hand-drawn-online-education-online-4986515.png" // Replace with your image URL
            alt="MyApp Logo"
            className="navbar-logo"
            style={{ height: "60px", width: "auto" }} // Adjust logo size
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className="text-light hover-text"
                >
                  <FaHome className="me-1" /> Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/resources"
                  className="text-light hover-text"
                >
                  <FaConciergeBell className="me-1" /> Resources
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/events"
                  className="text-light hover-text"
                >
                  <FaConciergeBell className="me-1" /> Events
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  className="text-light hover-text"
                >
                  <FaAddressBook className="me-1" /> Contact Us
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/discussion"
                  className="text-light hover-text"
                >
                  <FaComments className="me-1" /> Forum
                </Nav.Link>
                <Button
                  variant="outline-light"
                  onClick={handleLogout}
                  className="ms-2 logout-btn"
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  onClick={handleLoginRedirect}
                  className="me-2 hover-text"
                >
                  <FaSignInAlt className="me-1" />{" "}
                  {isLoggedIn ? "Go to Dashboard" : "Login"}
                </Button>
                <Button
                  variant="primary"
                  as={Link}
                  to="/register"
                  className="hover-text"
                >
                  <FaUserPlus className="me-1" /> Register
                </Button>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  className="text-light hover-text"
                >
                  <FaAddressBook className="me-1" /> Contact Us
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/discussion"
                  className="text-light hover-text"
                >
                  <FaComments className="me-1" /> Forum
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
