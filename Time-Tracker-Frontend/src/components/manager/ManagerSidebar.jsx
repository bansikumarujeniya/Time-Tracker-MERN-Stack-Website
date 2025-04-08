import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { ManagerNavbar } from "./ManagerNavbar";

export const ManagerSidebar = () => {
  const [auth, setAuth] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "Project Manager") {
      setAuth(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (auth === null) return null;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      <style>{`
        .nav-link.active-link {
          background-color: #D0DDD0 !important;
          color: #5A6E58 !important;
          font-weight: bold;
          border-radius: 5px;
          width: 93%;
          display: block;
          box-sizing: border-box;
        }
      `}</style>

      <ManagerNavbar toggleSidebar={toggleSidebar} />
      <aside
        className={`app-sidebar bg-body-secondary shadow ${
          isSidebarOpen ? "open" : "d-none"
        }`}
      >
        <div className="sidebar-brand">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: "10px",
              left: "10px",
            }}
          >
            <img
              src="/timer.png"
              alt="Time Tracker Logo"
              style={{ height: "40px", width: "auto", marginRight: "10px" }}
            />
            <span
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Time Tracker
            </span>
          </div>
        </div>

        <div
          data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll"
          tabIndex={-1}
          style={{
            marginRight: "-16px",
            marginBottom: "-16px",
            marginLeft: 0,
            top: "-8px",
            right: "auto",
            left: "-8px",
            width: "calc(100% + 16px)",
            padding: 8,
          }}
        >
          <nav className="mt-2">
            <ul
              className="nav sidebar-menu flex-column"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <NavLink
                  to="addprojectform"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                >
                  <i className="nav-icon bi bi-speedometer" />
                  <p>Add Project</p>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="projectlist"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                >
                  <i className="nav-icon bi bi-folder-fill" />
                  <p>Project Lists</p>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="modulelist"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                >
                  <i className="nav-icon bi bi-folder-fill" />
                  <p>Modules Lists</p>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="taskassignment"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                >
                  <i className="nav-icon bi bi-list-task" />
                  <p>Task Assignments</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
};
