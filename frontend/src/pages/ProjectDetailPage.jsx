// =============================================================
// ProjectDetailPage.jsx — Project tasks with filter/sort/CRUD
// =============================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { getProject } from "../services/project.service";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import TaskFilters from "../components/tasks/TaskFilters";
import { getErrorMessage } from "../utils/helpers";
import "./ProjectDetailPage.css";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [modal, setModal] = useState(null); // null | "create" | task object
  const [actionError, setActionError] = useState("");

  // Fetch project details (name, description)
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProject(projectId);
        setProject(data);
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 403) {
          navigate("/projects", { replace: true });
        }
      } finally {
        setProjectLoading(false);
      }
    };
    load();
  }, [projectId, navigate]);

  const { tasks, loading, error, createTask, updateTask, deleteTask } =
    useTasks(projectId, filters);

  // ── Task actions ───────────────────────────────────────────

  const handleCreate = async (data) => {
    await createTask(data);
  };

  const handleEdit = async (data) => {
    await updateTask(modal.id, data);
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      setActionError("");
      await updateTask(taskId, { status });
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      setActionError("");
      await deleteTask(taskId);
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  if (projectLoading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading project…</div>
      </div>
    );
  }

  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  // If a status filter is active, show a flat list instead of grouped view
  const isFiltered = !!filters.status || !!filters.sortBy;

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/projects">Projects</Link>
        <span className="breadcrumb__sep">›</span>
        <span>{project?.name}</span>
      </nav>

      <div className="page-header">
        <div>
          <h1 className="page-title">{project?.name}</h1>
          {project?.description && (
            <p className="page-subtitle">{project.description}</p>
          )}
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setModal("create")}
        >
          + New Task
        </button>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} />

      {(error || actionError) && (
        <p className="page-error" style={{ marginTop: "1rem" }}>
          {error || actionError}
        </p>
      )}

      {loading ? (
        <div className="loading-spinner" style={{ marginTop: "2rem" }}>Loading tasks…</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state" style={{ marginTop: "2rem" }}>
          <p className="empty-state__icon">✅</p>
          <p className="empty-state__text">
            {filters.status ? "No tasks match this filter." : "No tasks yet."}
          </p>
          {!filters.status && (
            <button className="btn btn--primary" onClick={() => setModal("create")}>
              Add your first task
            </button>
          )}
        </div>
      ) : isFiltered ? (
        // ── Flat list when filtered ──────────────────────────
        <div className="task-list" style={{ marginTop: "1rem" }}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => setModal(t)}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        // ── Kanban-style grouped columns ─────────────────────
        <div className="kanban" style={{ marginTop: "1rem" }}>
          {[
            { key: "todo", label: "To Do" },
            { key: "in_progress", label: "In Progress" },
            { key: "done", label: "Done" },
          ].map(({ key, label }) => (
            <div key={key} className="kanban__column">
              <div className="kanban__column-header">
                <span className="kanban__column-title">{label}</span>
                <span className="kanban__column-count">{grouped[key].length}</span>
              </div>
              <div className="kanban__tasks">
                {grouped[key].length === 0 ? (
                  <p className="kanban__empty">No tasks here</p>
                ) : (
                  grouped[key].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={(t) => setModal(t)}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create task modal */}
      {modal === "create" && (
        <TaskForm
          onSubmit={handleCreate}
          onClose={() => setModal(null)}
        />
      )}

      {/* Edit task modal */}
      {modal && modal !== "create" && (
        <TaskForm
          task={modal}
          onSubmit={handleEdit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;
