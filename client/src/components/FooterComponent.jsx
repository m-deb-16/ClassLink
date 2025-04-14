import { Container } from "react-bootstrap";

function FooterComponent() {
  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <Container className="text-center">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Learning Resources Manager. All
          rights reserved.
        </p>
      </Container>
    </footer>
  );
}

export default FooterComponent;
