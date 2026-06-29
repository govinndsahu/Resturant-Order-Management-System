import { Link } from "react-router-dom";

import { dashboardPages } from "../../constants";
import NotificationButton from "../../components/NotificationButton";
import InstallButton from "../../components/InstallButton";
import { getAppRoute } from "../../utils/util";
import { useConfig } from "../../contexts/ConfigContext";

const Dashboard = ({ appName }) => {
  const { backendUrl } = useConfig();

  const user = JSON.parse(localStorage.getItem("user"));
  const route = (path = "") => getAppRoute(appName, path);

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
              <Link key={i} to={route(page.path)}>
                {page.name}
              </Link>
            ))}
          </ul>
        </main>
      </div>
      <br />
      <NotificationButton />
      <br />
      <br />
      {window.matchMedia("(display-mode: standalone)").matches ? null : (
        <InstallButton />
      )}
    </div>
  );
};

export default Dashboard;
