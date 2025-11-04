import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/addtask.css";

function AddTask() {
  const [taskData, setTaskData] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  const handleAddTask = async () => {
    try {
      console.log(taskData);

      const response = await fetch("http://localhost:3200/add-task", {
        method: "POST",
        credentials:"include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Data stored successfully");
        navigate("/");
      }else{
        alert("try after someime...")
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="container">
      <h1>Add New Task</h1>

      <label>Title</label>
      <input type="text" name="title" placeholder="Enter task title" value={taskData.title} onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
      />

      <label>Description</label>
      <textarea name="description" placeholder="Enter task description" rows={4}value={taskData.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
      ></textarea>

      <button onClick={handleAddTask} className="submit">
        Add Task
      </button>
    </div>
  );
}

export default AddTask;
