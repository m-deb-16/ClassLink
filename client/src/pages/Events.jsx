// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import NavbarComponent from "../components/NavbarComponent";
// import FooterComponent from "../components/FooterComponent";

// const Events = () => {
//   const [events, setEvents] = useState({ ongoing: [], upcoming: [] });
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

//   useEffect(() => {
//     const fetchEvents = async () => {
//       if (!token) {
//         navigate("/login");
//         return;
//       }
//       try {
//         const response = await axios.get("http://localhost:5000/api/events", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const now = new Date();
//         const ongoing = response.data.filter(
//           (e) => new Date(e.date) <= now && e.status !== "Past"
//         );
//         const upcoming = response.data.filter((e) => new Date(e.date) > now);
//         setEvents({ ongoing, upcoming });
//       } catch (error) {
//         console.error(
//           "Error fetching events:",
//           error.response?.data || error.message
//         );
//         setEvents({ ongoing: [], upcoming: [] });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, [token, navigate]);

//   const handleEnroll = async (eventId, organizerId) => {
//     if (userId === organizerId)
//       return alert("You are the organizer of this event.");
//     if (!token || !userId) {
//       alert("Please log in to enroll in an event.");
//       navigate("/login");
//       return;
//     }
//     try {
//       await axios.post(
//         `http://localhost:5000/api/events/${eventId}/enroll`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Successfully enrolled!");
//       // Refresh
//       const response = await axios.get("http://localhost:5000/api/events", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const now = new Date();
//       const ongoing = response.data.filter(
//         (e) => new Date(e.date) <= now && e.status !== "Past"
//       );
//       const upcoming = response.data.filter((e) => new Date(e.date) > now);
//       setEvents({ ongoing, upcoming });
//     } catch (error) {
//       alert(error.response?.data?.message || "Enrollment failed.");
//     }
//   };

//   const handleCreateEvent = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       alert("Please log in to create an event");
//       navigate("/login");
//       return;
//     }
//     const formData = {
//       title: e.target.title.value.trim(),
//       description: e.target.description.value.trim(),
//       date: e.target.date.value,
//       capacity: parseInt(e.target.capacity.value, 10),
//     };
//     if (
//       !formData.title ||
//       !formData.description ||
//       !formData.date ||
//       isNaN(formData.capacity)
//     ) {
//       return alert("Fill all fields correctly.");
//     }
//     try {
//       await axios.post("http://localhost:5000/api/events", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       alert("Event created successfully!");
//       e.target.reset();
//       const response = await axios.get("http://localhost:5000/api/events", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const now = new Date();
//       const ongoing = response.data.filter(
//         (e) => new Date(e.date) <= now && e.status !== "Past"
//       );
//       const upcoming = response.data.filter((e) => new Date(e.date) > now);
//       setEvents({ ongoing, upcoming });
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to create event.");
//     }
//   };

//   const renderEventCard = (event) => {
//     const isOrganizedByUser = event.organizer?._id === userId;
//     const isEnrolled = event.enrolledUsers?.some((u) => u._id === userId);
//     const visibleDetails =
//       isEnrolled || isOrganizedByUser
//         ? event
//         : {
//             title: event.title,
//             description: event.description,
//             date: event.date,
//             status: event.status,
//             capacity: event.capacity,
//             enrolledUsers: { length: event.enrolledUsers?.length || 0 },
//           };
//     const isFull =
//       visibleDetails.enrolledUsers.length >= visibleDetails.capacity;

//     return (
//       <div key={event._id} className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h5 className="card-title">{visibleDetails.title}</h5>
//           <p className="card-text">{visibleDetails.description}</p>
//           <p className="card-text">
//             <strong>Date:</strong>{" "}
//             {new Date(visibleDetails.date).toLocaleDateString()}
//           </p>
//           <p className="card-text">
//             <strong>Enrolled:</strong> {visibleDetails.enrolledUsers.length}/
//             {visibleDetails.capacity}
//           </p>
//           <p
//             className={`card-text ${isFull ? "text-warning" : "text-success"}`}
//           >
//             <strong>Status:</strong> {isFull ? "Full" : "Open"}
//           </p>
//           {isOrganizedByUser && (
//             <p className="text-info">You are the organizer of this event.</p>
//           )}
//           {!isOrganizedByUser && !isEnrolled && !isFull && (
//             <button
//               className="btn btn-outline-primary"
//               onClick={() => handleEnroll(event._id, event.organizer?._id)}
//             >
//               Enroll
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const filteredEvents = (eventList) => {
//     const all = [...eventList.ongoing, ...eventList.upcoming];
//     switch (filter) {
//       case "enrolled":
//         return all.filter((e) =>
//           e.enrolledUsers?.some((u) => u._id === userId)
//         );
//       case "createdByMe":
//         return all.filter((e) => e.organizer?._id === userId);
//       default:
//         return all;
//     }
//   };

//   if (loading) return <p className="text-center mt-5">Loading events...</p>;

//   return (
//     <>
//       <NavbarComponent />
//       <div className="container mt-5">
//         <div className="row">
//           <div className="col-lg-6 mx-auto mb-5">
//             <h3 className="mb-3">Create Event</h3>
//             <form onSubmit={handleCreateEvent}>
//               <input
//                 name="title"
//                 className="form-control mb-3"
//                 placeholder="Title"
//                 required
//               />
//               <input
//                 name="description"
//                 className="form-control mb-3"
//                 placeholder="Description"
//                 required
//               />
//               <input
//                 type="date"
//                 name="date"
//                 className="form-control mb-3"
//                 required
//               />
//               <input
//                 type="number"
//                 name="capacity"
//                 className="form-control mb-3"
//                 placeholder="Capacity"
//                 min="1"
//                 required
//               />
//               <button type="submit" className="btn btn-success w-100">
//                 Create
//               </button>
//             </form>
//           </div>
//         </div>

//         <h3 className="mt-4">Browse Events</h3>
//         <div className="mb-3">
//           <button
//             className={`btn me-2 ${
//               filter === "all" ? "btn-primary" : "btn-outline-primary"
//             }`}
//             onClick={() => setFilter("all")}
//           >
//             All
//           </button>
//           <button
//             className={`btn me-2 ${
//               filter === "enrolled" ? "btn-primary" : "btn-outline-primary"
//             }`}
//             onClick={() => setFilter("enrolled")}
//           >
//             Enrolled
//           </button>
//           <button
//             className={`btn ${
//               filter === "createdByMe" ? "btn-primary" : "btn-outline-primary"
//             }`}
//             onClick={() => setFilter("createdByMe")}
//           >
//             Created by Me
//           </button>
//         </div>

//         <div className="mt-3">
//           {filteredEvents(events).filter((e) => e.status !== "Past").length ===
//           0 ? (
//             <p>No events to display.</p>
//           ) : (
//             filteredEvents(events)
//               .filter((e) => e.status !== "Past")
//               .map(renderEventCard)
//           )}
//         </div>
//       </div>

//       <FooterComponent />
//     </>
//   );
// };

// export default Events;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import EventCard from "../components/EventCard";
import Footer from "../components/FooterComponent";

const Events = () => {
  const [events, setEvents] = useState({ ongoing: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const now = new Date();
        const ongoing = response.data.filter(
          (e) => new Date(e.date) <= now && e.status !== "Past"
        );
        const upcoming = response.data.filter((e) => new Date(e.date) > now);
        setEvents({ ongoing, upcoming });
      } catch (error) {
        console.error(
          "Error fetching events:",
          error.response?.data || error.message
        );
        setEvents({ ongoing: [], upcoming: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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

    try {
      await axios.post(
        `http://localhost:5000/api/events/${eventId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully enrolled in the event!");
      refreshEvents();
    } catch (error) {
      console.error("Enrollment error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Enrollment failed.");
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
      alert("Please fill all fields correctly.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/events", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Event created successfully!");
      e.target.reset();
      refreshEvents();
    } catch (error) {
      console.error(
        "Create event error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to create event.");
    }
  };

  const refreshEvents = async () => {
    const response = await axios.get("http://localhost:5000/api/events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const now = new Date();
    const ongoing = response.data.filter(
      (e) => new Date(e.date) <= now && e.status !== "Past"
    );
    const upcoming = response.data.filter((e) => new Date(e.date) > now);
    setEvents({ ongoing, upcoming });
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

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <NavbarComponent />

      <div className="container my-4">
        <h2 className="mb-3">Create Event</h2>
        <form
          onSubmit={handleCreateEvent}
          className="border p-4 rounded shadow-sm"
        >
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

        <hr className="my-5" />

        <h2 className="mb-3">Events</h2>
        <div className="mb-4">
          <button
            className={`btn me-2 ${
              filter === "all" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn me-2 ${
              filter === "enrolled" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter("enrolled")}
          >
            Enrolled
          </button>
          <button
            className={`btn ${
              filter === "createdByMe" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter("createdByMe")}
          >
            Created by Me
          </button>
        </div>

        {filteredEvents(events).filter((e) => e.status !== "Past").length ===
        0 ? (
          <p>No events to display.</p>
        ) : (
          filteredEvents(events)
            .filter((e) => e.status !== "Past")
            .map((event) => (
              <EventCard
                key={event._id}
                event={event}
                userId={userId}
                onEnroll={handleEnroll}
              />
            ))
        )}
      </div>

      <Footer />
    </>
  );
};

export default Events;
