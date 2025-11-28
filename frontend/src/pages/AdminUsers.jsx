import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import "../styles/AdminUsers.css";

const base_url = import.meta.env.VITE_BASE_URL;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${base_url}/api/admin/users`, authHeader);
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this user?",
      text: "This action is permanent.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `${base_url}/api/admin/users/delete/${id}`,
        authHeader
      );

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <h2>Users List</h2>
      </div>

      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-users">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.firstname} {user.lastname}
                </td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td className="role-badge">{user.role}</td>

                <td>
                  <div className="user-actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
