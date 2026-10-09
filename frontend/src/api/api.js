const BASE_URL = "http://localhost:5000/api";

// Reads the stored token and builds the Authorization header.
// Centralizing this means every request automatically stays authenticated
// without repeating this logic in every component.
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic request wrapper — handles JSON parsing and error surfacing in one place
async function request(path, { method = "GET", body, auth = true } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? authHeader() : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    // Backend sends { message: "..." } on errors — surface that to the caller
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),

  getProjects: () => request("/projects"),
  createProject: (payload) => request("/projects", { method: "POST", body: payload }),
  deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" }),

  getTasks: (projectId) => request(`/tasks/project/${projectId}`),
  createTask: (payload) => request("/tasks", { method: "POST", body: payload }),
  updateTask: (id, payload) => request(`/tasks/${id}`, { method: "PUT", body: payload }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
