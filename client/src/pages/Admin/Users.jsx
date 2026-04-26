import axios from "axios";
import React, { useEffect, useState } from "react";

const Users = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URI}/users`,
        { withCredentials: true },
      );
      if (data?.success) {
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URI}/users/update/${userId}`,
        {},
        {
          withCredentials: true,
        },
      );
      if (data?.success) {
        fetchUsers(); // Refresh the user list after making an admin
      } else {
        console.error("Failed to make admin:", data.message);
      }
    } catch (error) {
      console.error("Error making admin:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URI}/users/delete/${userId}`,
        { withCredentials: true },
      );
      if (data?.success) {
        fetchUsers(); // Refresh the user list after deleting a user
      } else {
        console.error("Failed to delete user: ", data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return user?.role === 2 ? (
    <div id="users-page">
      <div className="users-container">
        <h1>Users</h1>
        <div className="users-list">
          <table className="table">
            <thead>
              <tr>
                <th>S.N</th>
                <th>Name</th>
                <th>Role & Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}.</td>
                  <td>{user.name}</td>
                  <td>
                    {user.role === 2 ? (
                      <span className="main-admin">Main Admin</span>
                    ) : user.role === 1 ? (
                      <span className="admin">Admin</span>
                    ) : (
                      <span
                        className="user"
                        onClick={() => {
                          handleMakeAdmin(user._id);
                        }}>
                        Make Admin
                      </span>
                    )}
                    {user.role < 2 ? (
                      <button
                        className="user-delete"
                        onClick={() => {
                          handleDeleteUser(user._id);
                        }}>
                        Delete
                      </button>
                    ) : (
                      <span></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <div id="users-page" className="not-authorized">
      <h1>Not Authorized</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
};

export default Users;
