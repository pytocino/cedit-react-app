import React from "react";

const AjaxLoader = () => {
  return (
    <div className="col-12 text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default AjaxLoader;
