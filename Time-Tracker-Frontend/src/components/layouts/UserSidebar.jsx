import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { UserNavbar } from './UserNavbar'

export const UserSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();


  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <UserNavbar toggleSidebar={toggleSidebar} />
      <aside
        className={`app-sidebar bg-body-secondary shadow ${
          isSidebarOpen ? "open" : "d-none"
        }`}
      >
        <div className="sidebar-brand">
          <div style={{ display: "flex", alignItems: "center", position: "absolute", top: "10px", left: "10px" }}>
            <img
              src="/timer.png"
              alt="Time Tracker Logo"
              style={{ height: "40px", width: "auto", marginRight: "10px" }}
            />
            <span style={{ fontSize: "1.2em", fontWeight: "bold", color: "#fff" }}>
              Time Tracker
            </span>
          </div>
        </div>

        <div
          className=""
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
              data-lte-toggle="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item menu-open">
                <Link to="addprojectform" className="nav-link active">
                  <i className="nav-icon bi bi-speedometer" />
                  <p>
                    Add Project
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/pm/projects" className="nav-link">
                  <i className="nav-icon bi bi-folder-fill" />
                  <p>Projects Overview</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/pm/team" className="nav-link">
                  <i className="nav-icon bi bi-people-fill" />
                  <p>Team Management</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/pm/tasks" className="nav-link">
                  <i className="nav-icon bi bi-list-task" />
                  <p>Task Assignments</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/pm/reports" className="nav-link">
                  <i className="nav-icon bi bi-graph-up" />
                  <p>Reports & Analytics</p>
                </Link>
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