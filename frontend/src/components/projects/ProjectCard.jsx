// =============================================================
// ProjectCard.jsx — Displays a single project in the grid
// =============================================================

import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/helpers";
import "./ProjectCard.css";

/**
 * @param {{ project: import('../../types').Project, onRename: Function, onDelete: Function }} props
 */
const ProjectCard = ({ project, onRename, onDelete }) => {
  const navigate = useNavigate();
  const taskCount = project._count?.tasks ?? 0;

  return (
    <div className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
      <div className="project-card__body">
        <h3 className="project-card__name">{project.name}</h3>
        {project.description && (
          <p className="project-card__desc">{project.description}</p>
        )}
      </div>

      <div className="project-card__footer">
        <span className="project-card__meta">
          🗂 {taskCount} task{taskCount !== 1 ? "s" : ""}
        </span>
        <span className="project-card__meta">
          📅 {formatDate(project.createdAt)}
        </span>

        <div className="project-card__actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => onRename(project)}
            title="Rename project"
          >
            ✏️
          </button>
          <button
            className="btn btn--danger btn--sm"
            onClick={() => onDelete(project)}
            title="Delete project"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
