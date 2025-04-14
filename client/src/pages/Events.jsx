import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";

const Events = () => {
  const [events, setEvents] = useState({ ongoing: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Options: "all", "enrolled", "createdByMe"
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      console.log("Token:", token); // Debug token
      console.log("Extracted userId:", userId); // Debug userId
      try {
        const response = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched events data on load:", response.data); // Debug initial fetch
        const now = new Date();
        const ongoing = response.data.filter(
          (e) => new Date(e.date) <= now && e.status !== "Past"
        );
        const upcoming = response.data.filter(
          (e) => new Date(e.date) > now // Removed status !== "Full" filter
        );
        setEvents({ ongoing, upcoming });
      } catch (error) {
        console.error(
          "Error fetching events:",
          error.response?.data || error.message
        );
        setEvents({ ongoing: [], upcoming: [] }); // Reset to empty on error
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const handleEnroll = async (eventId, organizerId) => {
    if (userId === organizerId) {
      alert("You are the organizer of this event and cannot enroll!");
      return;
    }
    if (!token || !userId) {
      alert("Please log in to enroll in an event.");
      navigate("/login");
      return;
    }
    console.log(
      "Attempting to enroll with userId:",
      userId,
      "for event:",
      eventId
    ); // Debug
    try {
      await axios.post(
        `http://localhost:5000/api/events/${eventId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully enrolled in the event!");
      // Refresh all events to ensure consistency across users
      const allEventsResponse = await axios.get(
        "http://localhost:5000/api/events",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(
        "Refreshed events data after enrollment:",
        allEventsResponse.data
      ); // Debug
      const now = new Date();
      const ongoing = allEventsResponse.data.filter(
        (e) => new Date(e.date) <= now && e.status !== "Past"
      );
      const upcoming = allEventsResponse.data.filter(
        (e) => new Date(e.date) > now
      );
      setEvents({ ongoing, upcoming });
    } catch (error) {
      console.error("Enrollment error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Enrollment failed. Check console for details."
      );
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to create an event");
      navigate("/login");
      return;
    }
    const formData = {
      title: e.target.title.value.trim(),
      description: e.target.description.value.trim(),
      date: e.target.date.value,
      capacity: parseInt(e.target.capacity.value, 10),
    };
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      isNaN(formData.capacity)
    ) {
      alert("Please fill all fields correctly. Capacity must be a number.");
      return;
    }
    console.log("Sending data to server:", formData);
    try {
      await axios.post("http://localhost:5000/api/events", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Event created successfully!");
      e.target.reset();
      // Refresh all events to ensure consistency across users
      const response = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Refreshed events data after creation:", response.data); // Debug
      const now = new Date();
      const ongoing = response.data.filter(
        (e) => new Date(e.date) <= now && e.status !== "Past"
      );
      const upcoming = response.data.filter((e) => new Date(e.date) > now);
      setEvents({ ongoing, upcoming });
    } catch (error) {
      console.error(
        "Create event error:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to create event. Check console for details."
      );
    }
  };

  const renderEventCard = (event) => {
    const isOrganizedByUser = event.organizer?._id === userId;
    const isEnrolled = event.enrolledUsers?.some((u) => u._id === userId);
    console.log("Rendering event:", event); // Debug event data
    const visibleDetails =
      isEnrolled || isOrganizedByUser
        ? event
        : {
            title: event.title,
            description: event.description,
            date: event.date,
            status: event.status,
            capacity: event.capacity,
            enrolledUsers: { length: event.enrolledUsers?.length || 0 }, // Include enrolled count
          };
    const isFull =
      visibleDetails.enrolledUsers.length >= visibleDetails.capacity;

    return (
      <div key={event._id} className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{visibleDetails.title}</h5>
          <p className="card-text">{visibleDetails.description}</p>
          <p className="card-text">
            Date: {new Date(visibleDetails.date).toLocaleDateString()}
          </p>
          <p className="card-text">
            Enrolled: {visibleDetails.enrolledUsers.length}/
            {visibleDetails.capacity}
          </p>
          <p className="card-text">Event status: {isFull ? "Full" : "Open"}</p>
          {isEnrolled && visibleDetails.enrolledUsers && (
            <p className="card-text">
              Enrolled Users:{" "}
              {visibleDetails.enrolledUsers.map((u) => u.name).join(", ")}
            </p>
          )}
          {isOrganizedByUser ? (
            <p className="card-text text-info">
              You are the organizer of this event.
            </p>
          ) : isFull ? (
            <p className="card-text text-warning">Event status: Full</p>
          ) : !isEnrolled ? (
            <button
              className="btn btn-primary"
              onClick={() => handleEnroll(event._id, event.organizer?._id)}
              disabled={isFull}
            >
              Enroll
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  const filteredEvents = (eventList) => {
    const allEvents = [...eventList.ongoing, ...eventList.upcoming];
    switch (filter) {
      case "enrolled":
        return allEvents.filter((e) =>
          e.enrolledUsers?.some((u) => u._id === userId)
        );
      case "createdByMe":
        return allEvents.filter((e) => e.organizer?._id === userId);
      default:
        return allEvents;
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <NavbarComponent />
      <div className="container mt-4">
        <h2>Create Even Form</h2>
        <form onSubmit={handleCreateEvent}>
          <div className="mb-3">
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Title"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="description"
              className="form-control"
              placeholder="Description"
              required
            />
          </div>
          <div className="mb-3">
            <input type="date" name="date" className="form-control" required />
          </div>
          <div className="mb-3">
            <input
              type="number"
              name="capacity"
              className="form-control"
              placeholder="Capacity"
              min="1"
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Create Event
          </button>
        </form>

        <h2 className="mt-4">Events</h2>
        <div className="mb-3">
          <button
            className="btn btn-secondary me-2"
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className="btn btn-secondary me-2"
            onClick={() => setFilter("enrolled")}
          >
            Enrolled
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setFilter("createdByMe")}
          >
            Created by Me
          </button>
        </div>
        {filteredEvents(events).filter((e) => e.status !== "Past").length ===
        0 ? (
          <p>No ongoing events to display.</p>
        ) : (
          filteredEvents(events)
            .filter((e) => e.status !== "Past")
            .map(renderEventCard)
        )}

        {/* <h2 className="mt-4">Upcoming Events</h2>
      <div className="mb-3">
        <button className="btn btn-secondary me-2" onClick={() => setFilter("all")}>
          All
        </button>
        <button className="btn btn-secondary me-2" onClick={() => setFilter("enrolled")}>
          Enrolled
        </button>
        <button className="btn btn-secondary" onClick={() => setFilter("createdByMe")}>
          Created by Me
        </button>
      </div>
      {filteredEvents(events).filter((e) => e.status !== "Full" && new Date(e.date) > new Date()).length === 0 ? (
        <p>No upcoming events to display.</p>
      ) : (
        filteredEvents(events)
          .filter((e) => e.status !== "Full" && new Date(e.date) > new Date())
          .map(renderEventCard)
      )} */}
      </div>
    </>
  );
};

export default Events;
