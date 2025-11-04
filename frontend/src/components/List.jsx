import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import "../style/list.css";

function List() {
  const [taskData, setTaskData] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:3200/tasks", { credentials: "include" });
      const data = await res.json();
      setTaskData(data.success ? data.result : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTaskData([]);
    }
  };

  // Delete single task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:3200/delete/${id}`, { method: "DELETE" , credentials:"include" });
      const data = await res.json();
      if (data.success) fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Select/Deselect all tasks
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedTasks(taskData.map((item) => item._id));
    } else {
      setSelectedTasks([]);
    }
  };

  // Select/Deselect single task
  const handleSelectSingle = (id) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter((item) => item !== id));
    } else {
      setSelectedTasks([id, ...selectedTasks]);
    }
  };

  // Delete multiple selected tasks
  const deleteMultiple = async () => {
    if (selectedTasks.length === 0) return;

    try {
      const res = await fetch("http://localhost:3200/delete-multiple/", {
        credentials:"include",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedTasks),
        
      });
      const data = await res.json();
      if (data.success) {
        setSelectedTasks([]);
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting multiple tasks:", error);
    }
  };

  return (
    <div className="list-container">
      <h1>To-Do List</h1>

      <button onClick={deleteMultiple} className="delete-item delete-multiple">
        Delete Selected
      </button>

      <ul className="task-list">
        {/* List Header */}
        <li className="list-header">
          <input type="checkbox" onChange={handleSelectAll} checked={selectedTasks.length === taskData.length && taskData.length > 0} />
        </li>
        <li className="list-header">S.No</li>
        <li className="list-header">Title</li>
        <li className="list-header">Description</li>
        <li className="list-header">Action</li>

        {/* Task Items */}
        {taskData.map((item, index) => (
          <Fragment key={item._id}>
            <li className="list-item">
              <input
                type="checkbox"
                checked={selectedTasks.includes(item._id)}
                onChange={() => handleSelectSingle(item._id)}
              />
            </li>
            <li className="list-item">{index + 1}</li>
            <li className="list-item">{item.title}</li>
            <li className="list-item">{item.description}</li>
            <li className="list-item">
              <button onClick={() => deleteTask(item._id)} className="delete-item">
                Delete
              </button>
              <Link to={`update/${item._id}`} className="update-item">
                Update
              </Link>
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

export default List;