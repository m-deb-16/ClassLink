import { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

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
    navigate("/"); // Redirects to home (which is the login page)
  };

  const handleLoginRedirect = () => {
    if (isLoggedIn) {
      navigate("/dashboard"); // Redirect to dashboard if already logged in
    } else {
      navigate("/"); // Otherwise, navigate to the login (which is also the home page)
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={isLoggedIn ? "/dashboard" : "/"}>
          MyApp
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/resources">
                  Resources
                </Nav.Link>
                <Button
                  variant="outline-light"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Login Button now works for home page and redirects to login */}
                <Button
                  variant="outline-light"
                  onClick={handleLoginRedirect}
                  className="me-2"
                >
                  {isLoggedIn ? "Go to Dashboard" : "Login"}
                </Button>
                <Button variant="primary" as={Link} to="/register">
                  Register
                </Button>
              </>
            )}

            {/* Always visible Contact Us link */}
            <Nav.Link as={Link} to="/contact">
              Contact Us
            </Nav.Link>
            <Nav.Link as={Link} to="/discussion">
              Forum
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
