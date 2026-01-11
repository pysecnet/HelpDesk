import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Ticket from "../../Componenets/Ticket/Ticket";
import TicketForm from "../../Componenets/TicketForm/TicketForm";
import { fetchMyTickets } from "../../features/ticketSlice";

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const {
    tickets = [],
    loading,
    error,
  } = useSelector((state) => state.tickets); // ✅ default empty array

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  const hasOpenTicket = tickets.some(
    (t) => t.status === "Open" || t.status === "In Progress"
  );

  return (
    <div className="py-5 text-center">
      <h1>Student Dashboard</h1>

      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <button
          className={`btn ${
            activeSection === "create" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveSection("create")}
        >
          Submit Ticket
        </button>
        <button
          className={`btn ${
            activeSection === "view" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveSection("view")}
        >
          View Tickets
        </button>
      </div>

      <div className="mt-4">
        {activeSection === "create" && !hasOpenTicket && <TicketForm />}

        {activeSection === "create" && hasOpenTicket && (
          <p className="text-warning">
            You have an active ticket. Cannot submit a new one.
          </p>
        )}

        {activeSection === "view" && (
          <>
            {loading && <p>Loading tickets...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && tickets.length === 0 && (
              <p>No tickets found.</p>
            )}
            {tickets.length > 0 &&
              tickets.map((ticket) => (
                <Ticket key={ticket._id} ticket={ticket} />
              ))}
          </>
        )}
      </div>
    </div>
  );
}
