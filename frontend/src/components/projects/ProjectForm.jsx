// =============================================================
// ProjectForm.jsx — Modal form for create / rename project
// =============================================================

import { useState, useEffect } from "react";
import { getErrorMessage } from "../../utils/helpers";
import "../Modal.css";

/**
 * @param {{ project?: object, onSubmit: Function, onClose: Function }} props
 */
const ProjectForm = ({ project, onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing an existing project
  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSubmitting(true);
      setError("");
      await onSubmit({ name: name.trim(), description: description.trim() || undefined });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{project ? "Rename Project" : "New Project"}</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="proj-name">Name *</label>
            <input
              id="proj-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Redesign"
              required
              autoFocus
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="proj-desc">Description</label>
            <textarea
              id="proj-desc"
              className="form-input form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional project description"
              rows={3}
              maxLength={2000}
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? "Saving…" : project ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
