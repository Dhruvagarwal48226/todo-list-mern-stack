import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../style/addtask.css";

function UpdateTask() {
  const [taskData, setTaskData] = useState({ title: "", description: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTask(id);
  }, [id]);

  // Fetch single task by ID
  const fetchTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3200/task/${taskId}` , {credentials:"include"});
      const data = await response.json();
      if (data.result) {
        setTaskData(data.result);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  // Update task
  const updateTask = async () => {
    try {
      const response = await fetch("http://localhost:3200/update-task", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/");
      } else {
        alert("Update failed. Try again.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="container">
      <h1>Update Task</h1>

      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        name="title"
        placeholder="Enter task title"
        value={taskData.title}
        onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        rows={4}
        name="description"
        placeholder="Enter task description"
        value={taskData.description}
        onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
      ></textarea>

      <button onClick={updateTask} className="submit">
        Update Task
      </button>
    </div>
  );
}

export default UpdateTask;
