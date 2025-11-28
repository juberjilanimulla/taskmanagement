import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../styles/UserTasks.css";

const base_url = import.meta.env.VITE_BASE_URL;

const UserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${base_url}/api/user/tasks`, authHeader);
      setTasks(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE TASK
  const handleCreateTask = async (e) => {
    e.preventDefault();

    const newTask = {
      title: formData.title,
      description: formData.description,
      status: "pending", // default
    };

    try {
      await axios.post(
        `${base_url}/api/user/tasks/create`,
        newTask,
        authHeader
      );

      toast.success("Task created successfully!");
      closeForm();
      fetchTasks();
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  // UPDATE TASK
  const handleUpdateTask = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${base_url}/api/user/tasks/update/${editingTask._id}`,
        formData,
        authHeader
      );

      toast.success("Task updated successfully!");
      closeForm();
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  // DELETE TASK
  const handleDeleteTask = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this task?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${base_url}/api/user/tasks/delete/${id}`, authHeader);
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  // OPEN EDIT FORM
  const openEditForm = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setShowForm(true);
  };

  // CLOSE FORM + RESET
  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      status: "pending",
    });
  };

  return (
    <div className="tasks-container">
      {/* HEADER */}
      <div className="tasks-header">
        <h2>My Tasks</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Add Task
        </button>
      </div>

      {/* TASK TABLE */}
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-task">
                No tasks found
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <span
                    className={`status-badge ${
                      task.status === "completed" ? "completed" : "pending"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>

                <td className="task-actions">
                  <button
                    className="edit-btn"
                    onClick={() => openEditForm(task)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* FORM MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editingTask ? "Edit Task" : "Create Task"}</h3>

            <form
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              className="modal-form"
            >
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>

              {/* ONLY SHOW STATUS FIELD IN EDIT MODE */}
              {editingTask && (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              )}

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {editingTask ? "Update" : "Create"}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTasks;
