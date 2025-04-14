// import { useEffect, useState } from "react";
// import axios from "axios";

// function Resources() {
//   const [resources, setResources] = useState([]);
//   const [filteredResources, setFilteredResources] = useState([]);
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("PDF");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const [filterType, setFilterType] = useState("All");
//   const [tagSearch, setTagSearch] = useState("");

//   const fetchResources = async () => {
//     const token = localStorage.getItem("token");
//     const res = await axios.get("http://localhost:5000/api/resources", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     setResources(res.data);
//     setFilteredResources(res.data);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select a file");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", title);
//     formData.append("type", type.toLowerCase());
//     formData.append("description", description);
//     formData.append("tags", JSON.stringify(tags.split(",")));

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("http://localhost:5000/api/resources/upload", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setTitle("");
//       setType("PDF");
//       setDescription("");
//       setTags("");
//       setFile(null);
//       setSuccessMessage("Resource uploaded successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
//       fetchResources();
//     } catch (err) {
//       alert("Upload failed: " + (err.response?.data?.error || "Unknown error"));
//       console.error(err);
//     }
//   };

//   // Filter logic
//   useEffect(() => {
//     let filtered = [...resources];

//     if (filterType !== "All") {
//       filtered = filtered.filter(
//         (r) => r.type.toLowerCase() === filterType.toLowerCase()
//       );
//     }

//     if (tagSearch.trim() !== "") {
//       const searchTags = tagSearch
//         .toLowerCase()
//         .split(",")
//         .map((t) => t.trim());
//       filtered = filtered.filter((r) =>
//         r.tags.some((tag) => searchTags.includes(tag.toLowerCase()))
//       );
//     }

//     setFilteredResources(filtered);
//   }, [filterType, tagSearch, resources]);

//   useEffect(() => {
//     fetchResources();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>📚 Upload Learning Resource</h2>
//       {successMessage && (
//         <div style={{ color: "green", marginBottom: "10px" }}>
//           {successMessage}
//         </div>
//       )}
//       <form onSubmit={handleUpload}>
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <br />
//         <select value={type} onChange={(e) => setType(e.target.value)}>
//           <option value="PDF">PDF</option>
//           <option value="Video">Video</option>
//           <option value="Text">Text</option>
//           <option value="Image">Image</option>
//           <option value="Link">Link</option>
//         </select>
//         <br />
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <br />
//         <input
//           type="text"
//           placeholder="Tags (comma separated)"
//           value={tags}
//           onChange={(e) => setTags(e.target.value)}
//         />
//         <br />
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx,.pptx,.txt,.md,image/*"
//           onChange={(e) => setFile(e.target.files[0])}
//           required
//         />
//         <br />
//         <button type="submit">Upload</button>
//       </form>

//       <hr />

//       <h3>🔍 Filter Resources</h3>
//       <div>
//         <label>Type:</label>
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//         >
//           <option value="All">All</option>
//           <option value="PDF">PDF</option>
//           <option value="Video">Video</option>
//           <option value="Text">Text</option>
//           <option value="Image">Image</option>
//           <option value="Link">Link</option>
//         </select>

//         <label style={{ marginLeft: "20px" }}>Tags:</label>
//         <input
//           type="text"
//           placeholder="e.g. html,css"
//           value={tagSearch}
//           onChange={(e) => setTagSearch(e.target.value)}
//         />
//       </div>

//       <hr />

//       <h3>Filtered Resources</h3>
//       {filteredResources.length === 0 && <p>No matching resources found.</p>}
//       {filteredResources.map((res) => (
//         <div key={res._id} style={{ marginBottom: "10px" }}>
//           <strong>{res.title}</strong> ({res.type})<p>{res.description}</p>
//           <p>📎 Tags: {res.tags.join(", ")}</p>
//           {res.type.toLowerCase() === "image" ? (
//             <img
//               src={`http://localhost:5000/api/resources/file/${res._id}`}
//               alt={res.title}
//               style={{ maxWidth: "300px" }}
//             />
//           ) : (
//             <a
//               href={`http://localhost:5000/api/resources/file/${res._id}`}
//               target="_blank"
//               rel="noreferrer"
//             >
//               View File
//             </a>
//           )}
//           <hr />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Resources;
import { useEffect, useRef, useState } from "react";
import axios from "axios";

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
    <div style={{ padding: "20px" }}>
      <h2>📚 Upload Learning Resource</h2>
      {successMessage && (
        <div style={{ color: "green", marginBottom: "10px" }}>
          {successMessage}
        </div>
      )}
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="PDF">PDF</option>
          <option value="Video">Video</option>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
          <option value="Link">Link</option>
        </select>
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <br />
        <input
          type="file"
          accept=".pdf,.doc,.docx,.pptx,.txt,.md,image/*"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileInputRef} // ✅ Controlled with useRef
          required
        />
        <br />
        <button type="submit">Upload</button>
      </form>

      <hr />

      <h3>🔍 Filter Resources</h3>
      <div>
        <label>Type:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="PDF">PDF</option>
          <option value="Video">Video</option>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
          <option value="Link">Link</option>
        </select>

        <label style={{ marginLeft: "20px" }}>Tags:</label>
        <input
          type="text"
          placeholder="e.g. html,css"
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
        />
      </div>

      <hr />

      <h3>Filtered Resources</h3>
      {filteredResources.length === 0 && <p>No matching resources found.</p>}
      {filteredResources.map((res) => (
        <div key={res._id} style={{ marginBottom: "10px" }}>
          <strong>{res.title}</strong> ({res.type})<p>{res.description}</p>
          <p>📎 Tags: {res.tags.join(", ")}</p>
          {res.type.toLowerCase() === "image" ? (
            <img
              src={`http://localhost:5000/api/resources/file/${res._id}`}
              alt={res.title}
              style={{ maxWidth: "300px" }}
            />
          ) : (
            <a
              href={`http://localhost:5000/api/resources/file/${res._id}`}
              target="_blank"
              rel="noreferrer"
            >
              View File
            </a>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Resources;
