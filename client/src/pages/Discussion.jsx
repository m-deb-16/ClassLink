// client/src/pages/Discussion.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarComponent from "../components/NavbarComponent";

const Discussion = () => {
  // State for new doubt form
  const [newDoubt, setNewDoubt] = useState({ studentName: "", doubtText: "" });
  // State for reply form (one per doubt)
  const [replies, setReplies] = useState({});
  // State for all doubts
  const [doubts, setDoubts] = useState([]);

  // Fetch all doubts on component mount
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/discussion/all"
        );
        setDoubts(response.data);
      } catch (error) {
        console.error("Error fetching doubts:", error);
      }
    };
    fetchDoubts();
  }, []);

  // Handle posting a new doubt
  const handlePostDoubt = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/discussion/post",
        newDoubt
      );
      setDoubts([response.data.doubt, ...doubts]); // Add new doubt to the top
      setNewDoubt({ studentName: "", doubtText: "" }); // Reset form
    } catch (error) {
      console.error("Error posting doubt:", error);
    }
  };

  // Handle reply form change
  const handleReplyChange = (doubtId, field, value) => {
    setReplies((prev) => {
      const currentReply = prev[doubtId] || { studentName: "", replyText: "" };
      return {
        ...prev,
        [doubtId]: { ...currentReply, [field]: value },
      };
    });
  };

  // Handle posting a reply
  const handlePostReply = async (doubtId) => {
    const replyData = replies[doubtId] || { studentName: "", replyText: "" };
    try {
      const response = await axios.post(
        `http://localhost:5000/api/discussion/reply/${doubtId}`,
        replyData
      );
      const updatedDoubt = response.data.doubt;
      setDoubts(
        doubts.map((doubt) => (doubt._id === doubtId ? updatedDoubt : doubt))
      );
      setReplies((prev) => ({
        ...prev,
        [doubtId]: { studentName: "", replyText: "" },
      })); // Reset reply form
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  return (
    <>
      <NavbarComponent />

      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ color: "#333" }}>Student Discussion Forum</h1>

        {/* Form to post a new doubt */}
        <div
          style={{
            marginBottom: "20px",
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <h3 style={{ color: "#555" }}>Post a New Doubt</h3>
          <form onSubmit={handlePostDoubt}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Name:{" "}
              </label>
              <input
                type="text"
                value={newDoubt.studentName}
                onChange={(e) =>
                  setNewDoubt({ ...newDoubt, studentName: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Doubt:{" "}
              </label>
              <textarea
                value={newDoubt.doubtText}
                onChange={(e) =>
                  setNewDoubt({ ...newDoubt, doubtText: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  minHeight: "80px",
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Post Doubt
            </button>
          </form>
        </div>

        {/* List of doubts */}
        <div>
          <h3 style={{ color: "#555" }}>All Doubts</h3>
          {doubts.length === 0 ? (
            <p>No doubts posted yet.</p>
          ) : (
            doubts.map((doubt) => (
              <div
                key={doubt._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <p style={{ margin: "0 0 10px 0" }}>
                  <strong>{doubt.studentName}</strong> (
                  {new Date(doubt.createdAt).toLocaleString()}):{" "}
                  {doubt.doubtText}
                </p>

                {/* Replies */}
                <div style={{ marginLeft: "20px" }}>
                  <h4 style={{ color: "#666", marginBottom: "10px" }}>
                    Replies:
                  </h4>
                  {doubt.replies.length === 0 ? (
                    <p style={{ color: "#888" }}>No replies yet.</p>
                  ) : (
                    doubt.replies.map((reply, index) => (
                      <p key={index} style={{ margin: "5px 0", color: "#444" }}>
                        <strong>{reply.studentName}</strong> (
                        {new Date(reply.createdAt).toLocaleString()}):{" "}
                        {reply.replyText}
                      </p>
                    ))
                  )}

                  {/* Reply form */}
                  <div
                    style={{
                      marginTop: "15px",
                      borderTop: "1px solid #ddd",
                      paddingTop: "10px",
                    }}
                  >
                    <h5 style={{ color: "#666", marginBottom: "10px" }}>
                      Reply to this doubt:
                    </h5>
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Name:{" "}
                      </label>
                      <input
                        type="text"
                        value={replies[doubt._id]?.studentName || ""}
                        onChange={(e) =>
                          handleReplyChange(
                            doubt._id,
                            "studentName",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Reply:{" "}
                      </label>
                      <textarea
                        value={replies[doubt._id]?.replyText || ""}
                        onChange={(e) =>
                          handleReplyChange(
                            doubt._id,
                            "replyText",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          minHeight: "60px",
                        }}
                        required
                      />
                    </div>
                    <button
                      onClick={() => handlePostReply(doubt._id)}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Discussion;
