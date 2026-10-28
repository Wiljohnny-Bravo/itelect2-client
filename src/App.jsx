import { useEffect, useState } from "react";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

async function fetchTasks() {
  const res = await fetch(`${API_URL}/api/tasks`);
  if (!res.ok) {
    throw new Error(`GET /api/tasks answered ${res.status}`);
  }
  return res.json();
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [loggedInAs, setLoggedInAs] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  async function logIn(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }

    // The id may come in the reply, or only inside the token's payload.
    let id = data.user?.id ?? data.userId ?? null;
    if (id === null) {
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      id = payload.id ?? payload.userId ?? payload.sub ?? null;
    }

    setToken(data.token);
    setUserId(id);
    setLoggedInAs(email);
  }

  function logOut() {
    setToken("");
    setUserId(null);
    setLoggedInAs("");
  }

  async function addTask(title, dueDate) {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: title, dueDate: dueDate, userId: userId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error);
    }
    setTasks(await fetchTasks());
  }

  return (
    <main className="tasks-app">
      <h1>Task Manager</h1>

      {token ? (
        <p className="who">
          Logged in as {loggedInAs} <button onClick={logOut}>Log out</button>
        </p>
      ) : (
        <LoginForm onLogin={logIn} />
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error">Could not load the tasks: {error}</p>}
      {!loading && !error && (
        <>
          <p>{tasks.length} tasks</p>
          {token && <TaskForm onAdd={addTask} />}
          <TaskList tasks={tasks} />
        </>
      )}
    </main>
  );
}

export default App;
