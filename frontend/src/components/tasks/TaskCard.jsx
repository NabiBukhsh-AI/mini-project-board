// =============================================================
// TaskCard.jsx — Displays a single task row
// =============================================================

import { formatDate, toDisplayLabel, isOverdue, STATUS_COLORS, PRIORITY_COLORS } from "../../utils/helpers";
import "./TaskCard.css";

/**
 * @param {{ task: import('../../types').Task, onEdit: Function, onDelete: Function, onStatusChange: Function }} props
 */
const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const overdue = isOverdue(task.dueDate) && task.status !== "done";

  return (
    <div className={`task-card ${task.status === "done" ? "task-card--done" : ""}`}>
      <div className="task-card__top">
        {/* Inline status toggle — the most frequent action */}
        <select
          className={`task-status task-status--${STATUS_COLORS[task.status]}`}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          title="Change status"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <span className={`task-priority task-priority--${PRIORITY_COLORS[task.priority]}`}>
          {toDisplayLabel(task.priority)}
        </span>
      </div>

      <div className="task-card__body">
        <p className="task-card__title">{task.title}</p>
        {task.description && (
          <p className="task-card__desc">{task.description}</p>
        )}
      </div>

      <div className="task-card__footer">
        <span className={`task-card__due ${overdue ? "task-card__due--overdue" : ""}`}>
          📅 {overdue && task.status !== "done" ? "⚠️ " : ""}
          {formatDate(task.dueDate)}
        </span>

        <div className="task-card__actions">
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className="btn btn--danger btn--sm"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
