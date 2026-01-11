import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Componenets/Navbar/Navbar";
import Footer from "./Componenets/Footer/Footer";
import Home from "./Pages/Home/Home";
import AI from "./Pages/Assistant/Assistant";
import Signup from "./Pages/Signup/Signup";
import DepartmentSignup from "./Pages/DepartmentSignup/DepartmentSignup"; // ✅ New import
import Login from "./Pages/Login/Login";
import StudentDashboard from "./Pages/StudentDashboard/StudentDashboard";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import DepartmentDashboard from "./Pages/DepartmentDashboard/DepartmentDashboard";

function App() {
  const user = useSelector((state) => state.user.user);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-assistant" element={<AI />} />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" replace />}
          />
          <Route
            path="/department-signup"
            element={!user ? <DepartmentSignup /> : <Navigate to="/" replace />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace />}
          />

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department-dashboard"
            element={
              <ProtectedRoute allowedRoles={["department"]}>
                <DepartmentDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
