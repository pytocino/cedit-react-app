// src/components/User.js
import React from "react";

const User = ({ user, onDelete }) => {
  return (
    <div className="card" style={{ minHeight: "175px" }}>
      <div className="card-body">
        <h5 className="card-title">{user.name}</h5>
        <p className="card-text">{user.link}</p>
      </div>
      <div className="card-footer d-flex">
        <button className="btn btn-danger" onClick={() => onDelete(user.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default User;
