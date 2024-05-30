import React, { useState } from "react";
import BitacoraList from "./BitacoraList";
import CreateBitacora from "./CreateBitacora";

const BitacoraManagement = () => {
  const [refresh, setRefresh] = useState(false);

  const handleBitacoraCreated = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  return (
    <div className="container mt-4">
      <CreateBitacora onBitacoraCreated={handleBitacoraCreated} />
      <BitacoraList key={refresh} />
    </div>
  );
};

export default BitacoraManagement;
