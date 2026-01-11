import { useState } from "react";
import styles from "./AdminDashboard.module.css";
import Ticket from "../../Componenets/Ticket/Ticket";
import DepartmentSection from "../../Componenets/DepartmentSection/DepartmentSection";
import UpdateDatabase from "../../Componenets/UpdateDatabase/UpdateDatabase";
import SupportTicket from "../../Componenets/SupportTicket/SupportTicket"; // ✅ New Component

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("tickets");

  return (
    <div className="px-4 py-5 my-2 text-center">
      <img
        className="d-block mx-auto mb-4"
        src="/docs/5.0/assets/brand/bootstrap-logo.svg"
        alt="Admin"
        width="72"
        height="57"
      />
      <h1 className="display-5 fw-bold">Admin Dashboard</h1>

      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">
          Manage support tickets, departments, and your AI assistant database.
        </p>

        {/* Navigation Buttons */}
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <button
            type="button"
            className={`btn ${
              activeSection === "tickets"
                ? "btn-primary"
                : "btn-outline-primary"
            } btn-lg px-4`}
            onClick={() => setActiveSection("tickets")}
          >
            Support Tickets
          </button>

          <button
            type="button"
            className={`btn ${
              activeSection === "departments"
                ? "btn-primary"
                : "btn-outline-primary"
            } btn-lg px-4`}
            onClick={() => setActiveSection("departments")}
          >
            Departments
          </button>

          <button
            type="button"
            className={`btn ${
              activeSection === "database"
                ? "btn-primary"
                : "btn-outline-primary"
            } btn-lg px-4`}
            onClick={() => setActiveSection("database")}
          >
            Update Database
          </button>
        </div>
      </div>

      {/* Dynamic Section Rendering */}
      <div className="my-5">
        {activeSection === "tickets" && (
          <>
            {/* Ticket Section */}
            {Ticket ? (
              <Ticket isAdmin={true} />
            ) : (
              <p>No tickets component found.</p>
            )}

            {/* Hide SupportTicket for admin */}
            <div className="mt-5">
              {false && SupportTicket ? <SupportTicket /> : null}
            </div>
          </>
        )}

        {activeSection === "departments" &&
          (DepartmentSection ? (
            <DepartmentSection />
          ) : (
            <p>No departments found.</p>
          ))}
        {activeSection === "database" &&
          (UpdateDatabase ? (
            <UpdateDatabase />
          ) : (
            <p>No database component found.</p>
          ))}
      </div>
    </div>
  );
}
