import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import ContactForm from "./pages/ContactForm";
import Events from "./pages/Events";
import Discussion from "./pages/Discussion";
// import { isLoggedIn } from "./utils/auth";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/events" element={<Events />} />
        <Route path="/discussion" element={<Discussion />} />

        {/* Add Contact route */}
      </Routes>
    </>
  );
}

export default App;
