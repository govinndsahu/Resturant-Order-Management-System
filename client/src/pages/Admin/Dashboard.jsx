import "../../css/dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { dashboardPages } from "../../constants";
import NotificationButton from "../../components/NotificationButton";
import InstallButton from "../../components/InstallButton";
import { exportOrdersToExcel, getAppRoute } from "../../utils/util";
import { useConfig } from "../../contexts/ConfigContext";
import { getUserApi } from "../../apis/userApis";
import { getArchivedOrdersApi } from "../../apis/apis";
import NoDataPopup from "../../components/NoDataPopup";

const Dashboard = ({ appName }) => {
  const navigate = useNavigate();
  const { menuName, backendUrl } = useConfig();
  const user = JSON.parse(localStorage.getItem("user"));

  const route = (path = "") => getAppRoute(appName, path);

  const [greeting, setGreeting] = useState("Good day");
  const [showPopup, setShowPopup] = useState(false);

  const getUser = async (userId) => {
    try {
      const { data } = await getUserApi(backendUrl, userId);
      if (data?.success) {
        localStorage.setItem("user", JSON.stringify(data?.user));
      } else {
        console.error("Failed to fetch user:", data?.message);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    getUser(user?._id);
  }, []);

  // Page icons mapping
  const pageIcons = {
    Categories: "ri-apps-line",
    Products: "ri-restaurant-line",
    Orders: "ri-file-list-3-line",
    "Orders Histories": "ri-history-line",
    Users: "ri-team-line",
    "Menu Configuration": "ri-settings-3-line",
  };

  const pageColors = {
    Categories: { bg: "#eff6ff", icon: "#3b82f6", border: "#dbeafe" },
    Products: { bg: "#f0fdf4", icon: "#22c55e", border: "#dcfce7" },
    Orders: { bg: "#fef3c7", icon: "#f59e0b", border: "#fde68a" },
    "Orders Histories": { bg: "#f5f3ff", icon: "#8b5cf6", border: "#ddd6fe" },
    Users: { bg: "#fdf2f8", icon: "#ec4899", border: "#fbcfe8" },
    "Menu Configuration": { bg: "#f3f4f6", icon: "#6b7280", border: "#d1d5db" },
  };

  if (!user) {
    return (
      <div className="admin-unauthorized">
        <div className="unauthorized-content">
          <i className="ri-shield-cross-line"></i>
          <h2>Access Denied</h2>
          <p>You are not authorized to visit this page.</p>
          <button onClick={() => navigate(route("loginpage"))}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-welcome">
            <div className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-welcome-text">
              <span className="greeting">{greeting},</span>
              <h1>{user?.name}</h1>
              <p>Welcome to your Admin Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#eff6ff", color: "#3b82f6" }}>
            <i className="ri-apps-line"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Categories</span>
            <span className="stat-value">Manage</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#f0fdf4", color: "#22c55e" }}>
            <i className="ri-restaurant-line"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Products</span>
            <span className="stat-value">Manage</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#fef3c7", color: "#f59e0b" }}>
            <i className="ri-file-list-3-line"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Orders</span>
            <span className="stat-value">View</span>
          </div>
        </div>
      </div>

      {/* Export Banner */}
      <div className="admin-export-banner">
        <button
          className="admin-export-btn"
          onClick={async () => {
            const { data } = await getArchivedOrdersApi(backendUrl);

            if (!data?.orders || data?.orders.length === 0) {
              setShowPopup(true);
              return;
            }

            exportOrdersToExcel(
              data?.orders,
              `orders_${data.orders[0]?.createdAt?.slice(0, 10)}`,
            );
          }}>
          <i className="ri-file-excel-2-line"></i>
          Export Orders to Excel
        </button>
      </div>

      <NoDataPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />

      {/* Main Navigation Grid */}
      <div className="admin-section">
        <h2 className="section-title">
          <i className="ri-dashboard-3-line"></i>
          Management
        </h2>
        <div className="admin-grid">
          {dashboardPages?.map((page, i) => {
            const colors = pageColors[page.name] || pageColors.Categories;
            return (
              <Link
                key={i}
                to={route(page.path)}
                className="admin-card"
                style={{
                  "--card-bg": colors.bg,
                  "--card-border": colors.border,
                  "--card-icon": colors.icon,
                }}>
                <div
                  className="admin-card-icon"
                  style={{ background: colors.bg, color: colors.icon }}>
                  <i className={pageIcons[page.name] || "ri-apps-line"}></i>
                </div>
                <div className="admin-card-content">
                  <h3>{page.name}</h3>
                  <p>Manage {page.name.toLowerCase()}</p>
                </div>
                <div className="admin-card-arrow">
                  <i className="ri-arrow-right-s-line"></i>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="admin-actions">
        <NotificationButton />
        {window.matchMedia("(display-mode: standalone)").matches ? null : (
          <InstallButton menuName={menuName} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
