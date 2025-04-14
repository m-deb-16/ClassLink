import React from "react";

const EventCard = ({ event, userId, onEnroll }) => {
  const isOrganizedByUser = event.organizer?._id === userId;
  const isEnrolled = event.enrolledUsers?.some((u) => u._id === userId);
  const visibleDetails =
    isEnrolled || isOrganizedByUser
      ? event
      : {
          title: event.title,
          description: event.description,
          date: event.date,
          status: event.status,
          capacity: event.capacity,
          enrolledUsers: { length: event.enrolledUsers?.length || 0 },
        };

  const isFull = visibleDetails.enrolledUsers.length >= visibleDetails.capacity;

  return (
    <div className="card mb-3 shadow-sm">
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
            onClick={() => onEnroll(event._id, event.organizer?._id)}
            disabled={isFull}
          >
            Enroll
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default EventCard;
