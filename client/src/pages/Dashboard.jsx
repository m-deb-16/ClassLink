import React, { useState, useEffect } from "react";
import NavbarComponent from "../components/NavbarComponent";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import "./Dashboard.css"; // Custom styles
import EventCard from "../components/EventCard";
import axios from "axios";
import Footer from "../components/FooterComponent";
import RecentResources from "../components/RecentResources";

function Dashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const now = new Date();
        const upcoming = response.data.filter(
          (e) => new Date(e.date) > now && e.status !== "Past"
        );
        setUpcomingEvents(upcoming.slice(0, 3)); // Show top 3 upcoming events
      } catch (error) {
        console.error("Error fetching events:", error);
        setUpcomingEvents([]);
      }
    };

    if (token) {
      fetchEvents();
    }
  }, [token]);

  const handleEnroll = async (eventId, organizerId) => {
    if (userId === organizerId) {
      alert("You are the organizer of this event and cannot enroll!");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/events/${eventId}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Successfully enrolled in the event!");
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Failed to enroll in the event.");
    }
  };

  return (
    <>
      <NavbarComponent />
      <div
        className="hero-section text-white py-5 d-flex justify-content-center align-items-center"
        style={{
          height: "100vh",
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
        }}
      >
        <Container>
          <Row className="align-items-center text-center">
            <Col md={6}>
              <h1 className="display-4 font-weight-bold">Welcome!</h1>
              <p className="lead mb-4">
                Explore a variety of resources tailored to help you enhance your
                skills and knowledge. Get started today by exploring the
                available materials below.
              </p>
              <Button
                variant="primary"
                size="lg"
                href="/resources"
                className="btn-hero"
              >
                Explore Resources
              </Button>
            </Col>

            <Col md={6}>
              <Image
                src="https://i.postimg.cc/L6QdvC1q/Pngtree-the-companys-business-partner-xie-3737636.png"
                alt="Learning Resources"
                fluid
                className="rounded img-hero"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Upcoming Events Section */}
      <Container className="my-5">
        <h2 className="mb-4 text-center">Recent Events</h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-center">No upcoming events at the moment.</p>
        ) : (
          upcomingEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              userId={userId}
              onEnroll={handleEnroll}
            />
          ))
        )}
        <div className="text-center mt-4">
          <Button variant="outline-primary" href="/events">
            View All Events
          </Button>
        </div>
      </Container>
      <Container>
        <h2 className="mb-4 text-center">Recently uploaded resources</h2>
        <RecentResources max={4} />
        <div
          className="text-center mt-4"
          style={{ paddingBottom: "25px", paddingTop: "10px" }}
        >
          <Button variant="outline-primary" href="/resources">
            View All Resources
          </Button>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default Dashboard;
