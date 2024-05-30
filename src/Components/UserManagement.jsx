// src/components/UserManagement.js
import React, { useState } from "react";
import UserList from "./UserList";
import CreateUser from "./CreateUser";

const UserManagement = () => {
  const [refresh, setRefresh] = useState(false);

  const handleUserCreated = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  return (
    <div className="container mt-4">
      <CreateUser onUserCreated={handleUserCreated} />
      <UserList key={refresh} />
    </div>
  );
};

export default UserManagement;
