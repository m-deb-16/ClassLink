import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";

function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PDF");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [tagSearch, setTagSearch] = useState("");

  const fetchResources = async () => {
    const res = await axios.get("http://localhost:5000/api/resources");
    setResources(res.data);
    setFilteredResources(res.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags.split(",")));

    try {
      await axios.post("http://localhost:5000/api/resources/upload", formData);
      setTitle("");
      setType("PDF");
      setDescription("");
      setTags("");
      setFile(null);
      fetchResources();
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    }
  };

  // Filtering logic
  useEffect(() => {
    let filtered = [...resources];

    if (filterType !== "All") {
      filtered = filtered.filter((r) => r.type === filterType);
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
    <>
      <NavbarComponent />

      <div style={{ padding: "40px" }}>
        {/* Upload Form */}
        <h2 className="mb-4 d-flex justify-content-center">
          Upload Learning Resource
        </h2>
        <div className="d-flex justify-content-center">
          <Form onSubmit={handleUpload} className="w-75 ">
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
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

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx,.pptx,.txt,.md,image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Upload
            </Button>
          </Form>
        </div>

        <hr />

        {/* Filter Section */}
        <div>
          <h3>Filter Resources</h3>
          <Form className=" w-75">
            <Row>
              <Col md={4}>
                <Form.Control
                  as="select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Text">Text</option>
                  <option value="Image">Image</option>
                  <option value="Link">Link</option>
                </Form.Control>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search Tags"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <hr />

        {/* Display Filtered Resources */}
        <h3>Filtered Resources</h3>
        {filteredResources.length === 0 ? (
          <p>No matching resources found.</p>
        ) : (
          filteredResources.map((res) => (
            <div key={res._id} style={{ marginBottom: "20px" }}>
              <h5>
                {res.title} ({res.type})
              </h5>
              <p>{res.description}</p>
              <p>📎 Tags: {res.tags.join(", ")}</p>
              {res.type === "Image" ? (
                <img
                  src={res.fileUrl}
                  alt={res.title}
                  style={{ maxWidth: "300px", marginBottom: "10px" }}
                />
              ) : (
                <a href={res.fileUrl} target="_blank" rel="noreferrer">
                  View File
                </a>
              )}
              <hr />
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Resources;
