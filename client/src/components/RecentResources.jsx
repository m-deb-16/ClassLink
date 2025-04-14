import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import ResourceCard from "./ResourceCard";

function RecentResources({ max = 4 }) {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setResources(sorted.slice(0, max));
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      }
    };

    fetchResources();
  }, [max]);

  return (
    <div>
      <h3 className="text-white text-center mb-4">Recent Resources</h3>
      <Row>
        {resources.map((res) => (
          <Col md={6} lg={3} key={res._id} className="mb-4">
            <ResourceCard resource={res} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default RecentResources;
