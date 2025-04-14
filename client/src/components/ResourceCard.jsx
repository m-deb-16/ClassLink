import { Card, Button } from "react-bootstrap";

function ResourceCard({ resource }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{resource.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Type: {resource.type}
        </Card.Subtitle>
        <Card.Text>{resource.description}</Card.Text>
        <p>📎 Tags: {resource.tags.join(", ")}</p>
        <Button
          variant="link"
          href={`http://localhost:5000/api/resources/file/${resource._id}`}
          target="_blank"
        >
          View File
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ResourceCard;
