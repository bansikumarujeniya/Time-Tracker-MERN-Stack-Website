import React from "react";
import { useNavigate } from "react-router-dom";
import hamburgermenu from "../../assets/hamburgermenu.png";

export const ManagerNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.clear();

   
    navigate("/landingpage");

    
    window.location.reload();
  };

  return (
    <nav className="app-header navbar navbar-expand bg-body">
      {/*begin::Container*/}
      <div className="container-fluid d-flex justify-content-between">
        {/*begin::Start Navbar Links*/}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link btn btn-light"
              href="#"
              role="button"
              style={{ color: "white" }}
              onClick={toggleSidebar}
            >
              <img src={hamburgermenu} style={{ height: "20px", width: "20px" }} alt="Menu" />
            </a>
          </li>
        </ul>

        {/*begin::Logout Button*/}
        <button
          className="btn"
          style={{
            backgroundColor: "#AAB99A",
            color: "white",
            padding: "11px 22px",
            borderRadius: "73px",
            fontWeight: "bold",
            border: "none",
            transition: "background-color 0.3s, color 0.3s",
          }}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "#AAB99A";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#AAB99A";
            e.target.style.color = "white";
          }}
        >
          Logout
        </button>
      </div>
      {/*end::Container*/}
    </nav>
  );
};
