import React from "react";
import "./MainContent.css";

const MainContent = ({ children, showSidebar }) => (
  <main className={showSidebar ? "content-with-sidebar" : "content"}>
    {children}
  </main>
);

export default MainContent;
