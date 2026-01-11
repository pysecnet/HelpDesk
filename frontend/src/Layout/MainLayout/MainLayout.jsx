import Navbar from "../../Componenets/Navbar/Navbar";
import Footer from "../../Componenets/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 container-fluid py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
