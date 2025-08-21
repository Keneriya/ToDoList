import React, { useState, useEffect } from "react";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState(""); 

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch("http://localhost:8080/api/todo/all")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setMessage("Tasks loaded successfully!");
        setMessageType("success");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => {
        console.error(err);
        setMessage("Failed to load tasks!");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  const handleAddTask = () => {
    if (!newTitle.trim()) return;

    const taskObj = {
      id: Math.floor(Math.random() * 100000),
      title: newTitle,
      description: newDescription,
      completed: false,
      dueDate: newDueDate || null,
    };

    fetch("http://localhost:8080/api/todo/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskObj),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add task");
        return res.json();
      })
      .then(() => {
        fetchTasks();
        setNewTitle("");
        setNewDescription("");
        setNewDueDate("");
        setMessage("Task added successfully!");
        setMessageType("success");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => {
        console.error(err);
        setMessage("Failed to add task!");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:8080/api/todo/delete/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete task");
        fetchTasks();
        setMessage("Task deleted successfully!");
        setMessageType("success");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => {
        console.error(err);
        setMessage("Failed to delete task!");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  const moveTaskUp = (index) => {
    if (index === 0) return;
    const updated = [...tasks];
    [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
    setTasks(updated);
  };

  const moveTaskDown = (index) => {
    if (index === tasks.length - 1) return;
    const updated = [...tasks];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setTasks(updated);
  };

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>

      {/* Success / Error message */}
      {message && <div className={`message ${messageType}`}>{message}</div>}

      <div className="task-inputs">
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        <button className="add-button" onClick={handleAddTask}>Add Task</button>
        <button className="add-button" onClick={fetchTasks}>Get All Tasks</button>
      </div>

      <ol>
        {tasks.map((task, index) => (
          <li key={task.id}>
            <span className="text">
              <strong>{task.title}</strong> - {task.description} {task.dueDate ? `(Due: ${task.dueDate})` : ""}
            </span>
            <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
              <button className="edit-button" onClick={() => EditTodo(index)}>Edit</button>
    
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoList;
