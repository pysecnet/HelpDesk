import { useState, useEffect } from "react";

export default function SupportTicket() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const departments = ["IT Support", "Finance", "Library", "Hostel", "Admin"];

  // Example: Fetch tickets from backend later
  useEffect(() => {
    // Replace with API call
    setTickets([
      {
        id: 1,
        subject: "Wi-Fi Connectivity Issue in Dorm",
        description: "Unable to connect to Wi-Fi since morning.",
        email: "student1@sau.edu.pk",
        status: "Closed",
        submitted: "Aug 28, 2025",
        updated: "Aug 28, 2025",
        department: "",
      },
      {
        id: 2,
        subject: "Portal Login Error",
        description: "Can’t log into student portal after password reset.",
        email: "student2@sau.edu.pk",
        status: "Open",
        submitted: "Aug 27, 2025",
        updated: "Aug 28, 2025",
        department: "",
      },
      {
        id: 3,
        subject: "Lab PC not working",
        description: "Computer in Lab 2 is not turning on.",
        email: "student3@sau.edu.pk",
        status: "In Progress",
        submitted: "Aug 25, 2025",
        updated: "Aug 26, 2025",
        department: "IT Support",
      },
    ]);
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || ticket.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    closed: tickets.filter((t) => t.status === "Closed").length,
  };

  const handleAssignClick = (ticket) => {
    setSelectedTicket(ticket);
    setSelectedDepartment("");
    const modalEl = document.getElementById("assignModal");
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  };

  const handleAssignConfirm = () => {
    if (!selectedDepartment) return alert("Please select a department!");
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: "In Progress",
              department: selectedDepartment,
              updated: "Now",
            }
          : t
      )
    );

    const modalEl = document.getElementById("assignModal");
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus, updated: "Now" } : t
      )
    );
  };

  return (
    <div className="container mt-4 text-start">
      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 text-center bg-light">
            <h6 className="fw-semibold">Total Tickets</h6>
            <h4 className="fw-bold text-primary">{counts.total}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 text-center bg-light">
            <h6 className="fw-semibold">Open</h6>
            <h4 className="fw-bold text-info">{counts.open}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 text-center bg-light">
            <h6 className="fw-semibold">In Progress</h6>
            <h4 className="fw-bold text-warning">{counts.inProgress}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 text-center bg-light">
            <h6 className="fw-semibold">Resolved</h6>
            <h4 className="fw-bold text-success">{counts.closed}</h4>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Search by subject or email..."
          className="form-control w-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select w-auto ms-3"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Closed</option>
        </select>
      </div>

      {/* Ticket List */}
      {filteredTickets.length > 0 ? (
        filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="card mb-3 shadow-sm border-0 p-3 bg-white"
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="fw-bold mb-1">{ticket.subject}</h5>
                <span
                  className={`badge ${
                    ticket.status === "Open"
                      ? "bg-info"
                      : ticket.status === "In Progress"
                      ? "bg-warning text-dark"
                      : "bg-success"
                  }`}
                >
                  {ticket.status}
                </span>
                {ticket.department && (
                  <span className="badge bg-secondary ms-2">
                    {ticket.department}
                  </span>
                )}
                <p className="mt-2 mb-1 text-muted">{ticket.description}</p>
                <small className="text-secondary">
                  Email: {ticket.email} <br />
                  Submitted: {ticket.submitted} | Updated: {ticket.updated}
                </small>
              </div>

              <div className="d-flex flex-column align-items-end">
                <button className="btn btn-outline-primary btn-sm mb-2">
                  View
                </button>
                <button
                  className="btn btn-outline-success btn-sm mb-2"
                  onClick={() => handleAssignClick(ticket)}
                >
                  Assign
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleStatusChange(ticket.id, "Closed")}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted mt-4">No tickets found.</p>
      )}

      {/* Assign Modal */}
      <div
        className="modal fade"
        id="assignModal"
        tabIndex="-1"
        aria-labelledby="assignModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-sm">
            <div className="modal-header">
              <h5 className="modal-title" id="assignModalLabel">
                Assign Ticket
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-2">
                Select the department for:{" "}
                <strong>{selectedTicket?.subject || "N/A"}</strong>
              </p>
              <select
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleAssignConfirm}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
