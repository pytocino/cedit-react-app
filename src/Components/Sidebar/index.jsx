import React from "react";
import { Link, useLocation } from "wouter";
import "./Sidebar.css";

const Sidebar = ({ showSidebar }) => {
  const [location] = useLocation();

  // Función para determinar si una ruta está activa
  const isActive = (path) => {
    return location === path;
  };
  return (
    <div className={`sidebar ${showSidebar ? "show" : ""}`}>
      <div
        className="d-flex flex-column flex-shrink-0 p-3"
        style={{ width: "280px" }}
      >
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
        >
          <span className="fs-4">Sidebar</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link href="/cedit-react-app/" className={`nav-link ${isActive("/cedit-react-app/") && "active"}`}>
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/cedit-react-app/users"
              className={`nav-link ${isActive("/cedit-react-app/users") && "active"}`}
            >
              Usuarios
            </Link>
          </li>
          <li>
            <Link
              href="/cedit-react-app/posts"
              className={`nav-link ${isActive("/cedit-react-app/posts") && "active"}`}
            >
              Posts
            </Link>
          </li>
          <li>
            <Link
              href="/cedit-react-app/bitacora"
              className={`nav-link ${isActive("/cedit-react-app/bitacora") && "active"}`}
            >
              Bitácora
            </Link>
          </li>
          <li>
            <Link
              href="/cedit-react-app/other"
              className={`nav-link ${isActive("/cedit-react-app/other") && "active"}`}
            >
              Other
            </Link>
          </li>
        </ul>
        {/* <hr /> */}
        {/* <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
            id="dropdownUser2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://github.com/mdo.png"
              alt=""
              width="32"
              height="32"
              className="rounded-circle me-2"
            />
            <strong>mdo</strong>
          </a>
          <ul
            className="dropdown-menu text-small shadow"
            aria-labelledby="dropdownUser2"
          >
            <li>
              <a className="dropdown-item" href="#">
                New project...
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Settings
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Profile
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Sign out
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
