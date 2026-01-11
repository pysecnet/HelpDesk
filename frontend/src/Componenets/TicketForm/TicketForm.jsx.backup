import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTicket, fetchMyTickets } from "../../features/ticketSlice";
import styles from "./TicketForm.module.css";

export default function TicketForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    studentEmail: "",
    studentPhone: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await dispatch(addTicket(formData)).unwrap();
      setMessage(res?.message || "Ticket created successfully");
      setFormData({
        title: "",
        category: "",
        description: "",
        studentEmail: "",
        studentPhone: "",
      });
      await dispatch(fetchMyTickets());
    } catch (err) {
      setMessage(err?.message || "Error creating ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-5 my-5 text-center">
      <h1 className="display-5 fw-bold">Submit Support Ticket</h1>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      <form onSubmit={handleSubmit} className={styles.ticketForm}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="form-control mb-3"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="form-select mb-3"
        >
          <option value="">Select Category</option>
          <option value="Technical Issue">Technical Issue</option>
          <option value="Academic Query">Academic Query</option>
          <option value="Administrative Help">Administrative Help</option>
        </select>

        <textarea
          name="description"
          placeholder="Describe your issue"
          value={formData.description}
          onChange={handleChange}
          required
          className="form-control mb-3"
        ></textarea>

        <input
          type="email"
          name="studentEmail"
          placeholder="Email"
          value={formData.studentEmail}
          onChange={handleChange}
          required
          className="form-control mb-3"
        />

        <input
          type="text"
          name="studentPhone"
          placeholder="Phone"
          value={formData.studentPhone}
          onChange={handleChange}
          required
          className="form-control mb-3"
        />

        <button
          type="submit"
          className="btn btn-primary btn-lg px-5"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
}
