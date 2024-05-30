import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import MainContent from "../MainContent";
import "./AuthenticatedLayout.css";

const AuthenticatedLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Header toggleSidebar={() => setShowSidebar(!showSidebar)} />
      <Sidebar showSidebar={showSidebar} />
      <MainContent showSidebar={showSidebar}>{children}</MainContent>
    </>
  );
};

export default AuthenticatedLayout;
