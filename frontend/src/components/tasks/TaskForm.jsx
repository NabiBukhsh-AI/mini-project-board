// =============================================================
// TaskForm.jsx — Modal form for creating / editing a task
// =============================================================

import { useState, useEffect } from "react";
import { getErrorMessage } from "../../utils/helpers";
import "../Modal.css";

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [fields, setFields] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill when editing
  useEffect(() => {
    if (task) {
      setFields({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        // Convert ISO to "yyyy-MM-dd" for <input type="date">
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
    }
  }, [task]);

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fields.title.trim()) return;
    try {
      setSubmitting(true);
      setError("");
      const payload = {
        title: fields.title.trim(),
        description: fields.description.trim() || undefined,
        status: fields.status,
        priority: fields.priority,
        // Convert local date input to UTC ISO string for the API
        dueDate: fields.dueDate ? new Date(fields.dueDate).toISOString() : null,
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{task ? "Edit Task" : "New Task"}</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              value={fields.title}
              onChange={set("title")}
              placeholder="What needs to be done?"
              required
              autoFocus
              maxLength={300}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="form-input form-textarea"
              value={fields.description}
              onChange={set("description")}
              placeholder="Optional details"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select id="task-status" className="form-input" value={fields.status} onChange={set("status")}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" className="form-input" value={fields.priority} onChange={set("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-due">Due Date</label>
              <input
                id="task-due"
                type="date"
                className="form-input"
                value={fields.dueDate}
                onChange={set("dueDate")}
              />
            </div>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? "Saving…" : task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
