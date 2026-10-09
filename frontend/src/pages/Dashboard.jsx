import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createProject({ name, description });
      setName("");
      setDescription("");
      setShowForm(false);
      loadProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this project and all its tasks?")) return;
    try {
      await api.deleteProject(id);
      loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">OT</span>
          <span>Onboarding Tracker</span>
        </div>
        <div className="topbar-right">
          <span className="user-chip">{user?.name}</span>
          <button className="ghost-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="content">
        <div className="content-header">
          <div>
            <h1>Your projects</h1>
            <p className="muted">Every client onboarding, tracked in one place.</p>
          </div>
          <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New project"}
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {showForm && (
          <form className="inline-form" onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Short description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit" className="primary-btn" disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="muted">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects yet.</p>
            <p className="muted">Create your first project to start tracking onboarding tasks.</p>
          </div>
        ) : (
          <div className="project-grid">
            {projects.map((p) => (
              <div
                key={p._id}
                className="project-card"
                onClick={() => navigate(`/projects/${p._id}`)}
              >
                <div className="project-card-top">
                  <h3>{p.name}</h3>
                  <button className="icon-btn" onClick={(e) => handleDelete(p._id, e)} title="Delete project">
                    ✕
                  </button>
                </div>
                <p className="muted">{p.description || "No description"}</p>
                <span className="project-date">
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
