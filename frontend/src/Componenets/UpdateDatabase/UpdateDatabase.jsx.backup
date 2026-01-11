import { useState } from "react";
import API_URL from "../../api"; // make sure your API_URL is correct

export default function UpdateDatabase() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token"); // ✅ get JWT token

  const handleAddQA = async (e) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      setMessage("❌ Both question and answer are required.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/assistant/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ pass token
        },
        body: JSON.stringify({ question, answer }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ FAQ added successfully!");
        setQuestion("");
        setAnswer("");
      } else {
        setMessage(`❌ Error: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <div className="container my-5 text-start">
      <h3 className="mb-4 fw-bold text-center">🧠 Update Assistant Database</h3>
      <p className="text-center text-muted mb-4">
        Add new questions and answers to help the AI Assistant respond better.
      </p>

      <form
        onSubmit={handleAddQA}
        className="border p-4 rounded shadow-sm bg-light"
      >
        <div className="mb-3">
          <label className="form-label fw-semibold">Question:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter the question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Answer:</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Enter the answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add to Database
        </button>

        {message && <p className="mt-3 text-center">{message}</p>}
      </form>
    </div>
  );
}
