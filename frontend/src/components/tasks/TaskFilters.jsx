// =============================================================
// TaskFilters.jsx — Filter and sort controls for task list
// =============================================================

import "./TaskFilters.css";

/**
 * @param {{ filters: object, onChange: Function }} props
 */
const TaskFilters = ({ filters, onChange }) => {
  const set = (key) => (e) =>
    onChange({ ...filters, [key]: e.target.value || undefined });

  return (
    <div className="task-filters">
      <div className="task-filters__group">
        <label htmlFor="filter-status">Filter by status</label>
        <select
          id="filter-status"
          className="form-input form-input--sm"
          value={filters.status || ""}
          onChange={set("status")}
        >
          <option value="">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="task-filters__group">
        <label htmlFor="filter-sort">Sort by</label>
        <select
          id="filter-sort"
          className="form-input form-input--sm"
          value={filters.sortBy || ""}
          onChange={set("sortBy")}
        >
          <option value="">Date created</option>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <div className="task-filters__group">
        <label htmlFor="filter-order">Order</label>
        <select
          id="filter-order"
          className="form-input form-input--sm"
          value={filters.sortOrder || "asc"}
          onChange={set("sortOrder")}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {(filters.status || filters.sortBy) && (
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => onChange({})}
          title="Clear filters"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
