import "../../css/users.css";
import { useEffect, useState } from "react";
import axios from "axios";

import { deleteUserApi, getUsersApi, updateUserApi } from "../../apis/userApis";
import { useConfig } from "../../contexts/ConfigContext";

const Users = () => {
  const { backendUrl, user } = useConfig();

  const currentUser = user;
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await getUsersApi(backendUrl);

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
      setLoadingId(userId);
      const { data } = await updateUserApi(userId, backendUrl);

      if (data?.success) {
        fetchUsers();
      } else {
        console.error("Failed to make admin:", data.message);
      }
    } catch (error) {
      console.error("Error making admin:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoadingId(userId);
      const { data } = await deleteUserApi(userId, backendUrl);

      if (data?.success) {
        fetchUsers();
      } else {
        console.error("Failed to delete user: ", data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Unauthorized state
  if (currentUser?.role !== 2) {
    return (
      <div className="users-unauthorized">
        <div className="users-unauthorized-content">
          <i className="ri-shield-cross-line"></i>
          <h2>Access Denied</h2>
          <p>You are not authorized to manage users.</p>
        </div>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    if (role === 2) {
      return (
        <span className="user-badge main-admin">
          <i className="ri-vip-crown-fill"></i>
          Main Admin
        </span>
      );
    }
    if (role === 1) {
      return (
        <span className="user-badge admin">
          <i className="ri-shield-user-fill"></i>
          Admin
        </span>
      );
    }
    return (
      <span className="user-badge user">
        <i className="ri-user-3-line"></i>
        User
      </span>
    );
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#667eea",
      "#764ba2",
      "#f59e0b",
      "#ef4444",
      "#22c55e",
      "#3b82f6",
      "#ec4899",
      "#14b8a6",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="users-page">
      {/* Header */}
      <div className="users-header">
        <div className="users-header-content">
          <div className="users-header-icon">
            <i className="ri-team-line"></i>
          </div>
          <div>
            <h1>Manage Users</h1>
            <p>View and manage your team members</p>
          </div>
        </div>
      </div>

      <div className="users-container">
        {/* Stats */}
        <div className="users-stats">
          <div className="users-stat-card">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="users-stat-card">
            <span className="stat-value">
              {users.filter((u) => u.role === 2).length}
            </span>
            <span className="stat-label">Main Admins</span>
          </div>
          <div className="users-stat-card">
            <span className="stat-value">
              {users.filter((u) => u.role === 1).length}
            </span>
            <span className="stat-label">Admins</span>
          </div>
          <div className="users-stat-card">
            <span className="stat-value">
              {users.filter((u) => u.role === 0).length}
            </span>
            <span className="stat-label">Users</span>
          </div>
        </div>

        {/* Users List */}
        <div className="users-list-section">
          <div className="users-list-header">
            <h2>
              <i className="ri-list-check-2"></i>
              All Users
            </h2>
            <span className="users-count">{users.length} members</span>
          </div>

          {users.length === 0 ? (
            <div className="users-empty">
              <i className="ri-inbox-line"></i>
              <p>No users found.</p>
            </div>
          ) : (
            <div className="users-list">
              {users.map((u, index) => (
                <div
                  key={u._id}
                  className={`user-card ${loadingId === u._id ? "loading" : ""}`}>
                  <div className="user-card-main">
                    <div
                      className="user-avatar"
                      style={{ background: getAvatarColor(u.name) }}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h3 className="user-name">{u.name}</h3>
                      <span className="user-username">@{u.username}</span>
                      {getRoleBadge(u.role)}
                    </div>
                  </div>

                  <div className="user-card-actions">
                    {u.role === 0 && (
                      <button
                        className="user-btn-promote"
                        onClick={() => handleMakeAdmin(u._id)}
                        disabled={loadingId === u._id}>
                        {loadingId === u._id ? (
                          <span className="btn-spinner-sm"></span>
                        ) : (
                          <i className="ri-arrow-up-circle-line"></i>
                        )}
                        <span>Make Admin</span>
                      </button>
                    )}
                    {u.role < 2 && (
                      <button
                        className="user-btn-delete"
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={loadingId === u._id}>
                        {loadingId === u._id ? (
                          <span className="btn-spinner-sm"></span>
                        ) : (
                          <i className="ri-delete-bin-6-line"></i>
                        )}
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
