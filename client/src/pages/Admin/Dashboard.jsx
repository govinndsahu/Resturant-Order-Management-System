import React from "react";
import { dashboardPages } from "../../constants";
import { Link } from "react-router-dom";
import NotificationButton from "../../components/NotificationButton";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return !user ? (
    <>
      <h1 id="dashboard-page" className="text-2xl">
        You are not authorized to visit this page!
      </h1>
    </>
  ) : (
    <div id="dashboard-page">
      <div className="dashboard z-2">
        <h1 className="text-3xl">Admin Panel</h1>
        <main className="main-content">
          <h1>
            Welcome <span id="name">{user?.name}</span> to the Admin Dashboard
          </h1>
          <ul className="dashboard-links">
            {dashboardPages?.map((page, i) => (
              <Link key={i} to={page.path}>
                {page.name}
              </Link>
            ))}
          </ul>
        </main>
      </div>
      <br />
      <NotificationButton />
    </div>
  );
};

export default Dashboard;
