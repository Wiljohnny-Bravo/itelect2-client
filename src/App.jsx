import { useState } from "react";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import "./App.css";

const STARTING_TASKS = [
  { id: 1, title: "Finish GT12 deployment", dueDate: "2026-10-14" },
  { id: 2, title: "Read Session 13 notes", dueDate: "2026-10-19" },
  { id: 3, title: "Build React client", dueDate: "2026-10-21" },
];

function App() {
  const [tasks, setTasks] = useState(STARTING_TASKS);

  function addTask(title) {
    const newTask = {
      id: Date.now(),
      title: title,
      dueDate: "No due date",
    };
    setTasks([...tasks, newTask]);
  }

  return (
    <main className="tasks-app">
      <h1>Task Manager</h1>
      <p>{tasks.length} tasks</p>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} />
    </main>
  );
}

export default App;
