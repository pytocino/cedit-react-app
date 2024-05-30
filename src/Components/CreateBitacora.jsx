import React, { useState } from "react";
import { createBitacora } from "../Services/BitacoraService";

const CreateBitacora = ({ onBitacoraCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBitacora({
        title,
        content,
        status: "publish",
        categories: 23,
      });
      setSuccessMessage("Bitacora created successfully!");
      setErrorMessage("");
      onBitacoraCreated(); // Llamar a la función para recargar la lista de bitacoras
      // Limpiar el formulario
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to create bitacora:", error);
      setErrorMessage("Failed to create bitacora. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">Crear bitacora</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="title">Titulo</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="content">Contenido</label>
              <textarea
                className="form-control"
                id="content"
                rows="5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Crear bitacora
            </button>
            {successMessage && (
              <div className="alert alert-success mt-3">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="alert alert-danger mt-3">{errorMessage}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBitacora;
