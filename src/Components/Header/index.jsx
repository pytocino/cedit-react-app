import React from "react";
import { LogOut } from "../LogOut";
import "./Header.css";

const Header = ({ toggleSidebar }) => (
  <header className="header justify-content-between ">
    <button className="sidebar-toggle btn" onClick={toggleSidebar}>
      ☰
    </button>
    <LogOut />
  </header>
);

export default Header;
