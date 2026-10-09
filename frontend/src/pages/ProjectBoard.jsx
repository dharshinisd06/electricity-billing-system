import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";

const STATUSES = ["To Do", "In Progress", "Done"];

export default function ProjectBoard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [creating, setCreating] = useState(false);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks(id);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createTask({ title, assignee, dueDate, project: id });
      setTitle("");
      setAssignee("");
      setDueDate("");
      setShowForm(false);
      loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.deleteTask(taskId);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const isOverdue = (task) =>
    task.status !== "Done" && new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          <span className="brand-mark">OT</span>
          <span>Onboarding Tracker</span>
        </div>
        <button className="ghost-btn" onClick={() => navigate("/dashboard")}>
          ← All projects
        </button>
      </header>

      <main className="content">
        <div className="content-header">
          <div>
            <h1>Task board</h1>
            <p className="muted">Drag status forward as work moves through the pipeline.</p>
          </div>
          <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New task"}
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {showForm && (
          <form className="inline-form" onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <button type="submit" className="primary-btn" disabled={creating}>
              {creating ? "Adding..." : "Add task"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="muted">Loading tasks...</p>
        ) : (
          <div className="board">
            {STATUSES.map((status) => {
              const columnTasks = tasks.filter((t) => t.status === status);
              return (
                <div key={status} className="board-column">
                  <div className="board-column-header">
                    <span>{status}</span>
                    <span className="count-badge">{columnTasks.length}</span>
                  </div>

                  {columnTasks.length === 0 && (
                    <p className="muted small">No tasks here</p>
                  )}

                  {columnTasks.map((task) => (
                    <div key={task._id} className={`task-card ${isOverdue(task) ? "overdue" : ""}`}>
                      <div className="task-card-top">
                        <h4>{task.title}</h4>
                        <button className="icon-btn" onClick={() => handleDelete(task._id)} title="Delete task">
                          ✕
                        </button>
                      </div>
                      <p className="muted small">{task.assignee || "Unassigned"}</p>
                      <p className={`due-date ${isOverdue(task) ? "overdue-text" : ""}`}>
                        Due {new Date(task.dueDate).toLocaleDateString()}
                        {isOverdue(task) ? " · Overdue" : ""}
                      </p>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
