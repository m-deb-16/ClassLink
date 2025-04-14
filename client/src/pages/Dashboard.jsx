import NavbarComponent from "../components/NavbarComponent";
import { Container, Row, Col, Button, Image } from "react-bootstrap";

function Dashboard() {
  return (
    <>
      <NavbarComponent />
      <div
        className="hero-section text-white py-5 d-flex justify-content-center align-items-center"
        style={{
          height: "100vh",
          background: "linear-gradient(to right, #6a11cb, #2575fc)", // Gradient background
        }}
      >
        <Container>
          <Row className="align-items-center text-center">
            {/* Left side: Text and Button */}
            <Col md={6}>
              <h1>Welcome to Your Dashboard</h1>
              <p>
                Explore a variety of resources tailored to help you enhance your
                skills and knowledge. Get started today by exploring the
                available materials below.
              </p>
              <Button variant="primary" size="lg" href="/resources">
                Explore Resources
              </Button>
            </Col>

            {/* Right side: Image */}
            <Col md={6}>
              <Image
                src="https://via.placeholder.com/600x400"
                alt="Placeholder Image"
                fluid
                className="rounded"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Dashboard;
