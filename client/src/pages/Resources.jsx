import NavbarComponent from "../components/NavbarComponent"; // Import Navbar
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap"; // Updated imports
import FooterComponent from "../components/FooterComponent";
function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PDF");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [filterType, setFilterType] = useState("All");
  const [tagSearch, setTagSearch] = useState("");

  const fileInputRef = useRef(null);

  const fetchResources = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/resources", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setResources(res.data);
    setFilteredResources(res.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("type", type.toLowerCase());
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags.split(",")));

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/resources/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTitle("");
      setType("PDF");
      setDescription("");
      setTags("");
      setFile(null);
      fileInputRef.current.value = ""; // ✅ Reset file input
      setSuccessMessage("Resource uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchResources();
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.error || "Unknown error"));
      console.error(err);
    }
  };

  useEffect(() => {
    let filtered = [...resources];

    if (filterType !== "All") {
      filtered = filtered.filter(
        (r) => r.type.toLowerCase() === filterType.toLowerCase()
      );
    }

    if (tagSearch.trim() !== "") {
      const searchTags = tagSearch
        .toLowerCase()
        .split(",")
        .map((t) => t.trim());
      filtered = filtered.filter((r) =>
        r.tags.some((tag) => searchTags.includes(tag.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  }, [filterType, tagSearch, resources]);

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div>
      <NavbarComponent />
      <Container className="py-5">
        <Row>
          <Col md={12}>
            <h2>Upload Resource</h2>
            {successMessage && (
              <div style={{ color: "green", marginBottom: "10px" }}>
                {successMessage}
              </div>
            )}
            <Form onSubmit={handleUpload}>
              <Form.Group controlId="title">
                <Form.Control
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="type" className="my-3">
                <Form.Control
                  as="select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Text">Text</option>
                  <option value="Image">Image</option>
                  <option value="Link">Link</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="description" className="my-3">
                <Form.Control
                  as="textarea"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="tags" className="my-3">
                <Form.Control
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="file" className="my-3">
                <Form.Control
                  type="file"
                  accept=".pdf,.doc,.docx,.pptx,.txt,.md,image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  ref={fileInputRef}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Upload
              </Button>
            </Form>
          </Col>
        </Row>

        <hr />

        <Row>
          <Col md={12}>
            <h3>Filter Resources</h3>
            <Form.Group controlId="filterType" className="my-3">
              <Form.Control
                as="select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All</option>
                <option value="PDF">PDF</option>
                <option value="Video">Video</option>
                <option value="Text">Text</option>
                <option value="Image">Image</option>
                <option value="Link">Link</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="tagSearch" className="my-3">
              <Form.Control
                type="text"
                placeholder="Search by file name"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />

        <h3>Filtered Resources</h3>
        {filteredResources.length === 0 && <p>No matching resources found.</p>}
        <Row>
          {filteredResources.map((res) => (
            <Col md={4} key={res._id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{res.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Type: {res.type}
                  </Card.Subtitle>
                  <Card.Text>{res.description}</Card.Text>
                  <p>📎 Tags: {res.tags.join(", ")}</p>

                  {/* allows image preview */}
                  {/* {res.type.toLowerCase() === "image" ? (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5000/api/resources/file/${res._id}`}
                      alt={res.title}
                      style={{ maxHeight: "50px", objectFit: "scale-down" }}
                    />
                  ) : ( */}
                  <Button
                    variant="link"
                    href={`http://localhost:5000/api/resources/file/${res._id}`}
                    target="_blank"
                  >
                    View File
                  </Button>
                  {/* )} */}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <FooterComponent />
    </div>
  );
}

export default Resources;
