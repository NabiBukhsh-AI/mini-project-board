// =============================================================
// ProjectsPage.jsx — Dashboard: list all projects
// =============================================================

import { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";
import { getErrorMessage } from "../utils/helpers";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const { projects, loading, error, createProject, updateProject, deleteProject } =
    useProjects();

  // Modal state: null = closed, "create" = new, object = editing
  const [modal, setModal] = useState(null);
  const [actionError, setActionError] = useState("");

  const handleCreate = async (data) => {
    await createProject(data);
  };

  const handleRename = async (data) => {
    await updateProject(modal.id, data);
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.name}"? This will also delete all its tasks.`)) return;
    try {
      setActionError("");
      await deleteProject(project.id);
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading projects…</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Projects</h1>
          <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setModal("create")}
        >
          + New Project
        </button>
      </div>

      {(error || actionError) && (
        <p className="page-error">{error || actionError}</p>
      )}

      {projects.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__icon">📁</p>
          <p className="empty-state__text">No projects yet.</p>
          <button
            className="btn btn--primary"
            onClick={() => setModal("create")}
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onRename={(p) => setModal(p)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {modal === "create" && (
        <ProjectForm
          onSubmit={handleCreate}
          onClose={() => setModal(null)}
        />
      )}

      {/* Edit / rename modal */}
      {modal && modal !== "create" && (
        <ProjectForm
          project={modal}
          onSubmit={handleRename}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
