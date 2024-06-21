import React, { useState, useEffect } from "react";
import AjaxLoader from "../AjaxLoader";
import { deletePost } from "../../Services/PostService";
import { EditButton } from "../EditButton";
import { DeleteButton } from "../DeleteButton";
import { useAuth } from "../../Contexts/authContext";
import AddButton from "../AddButton";
import Modal from "../Modal";
import CreateBitacora from "../CreateBitacora";
import EditBitacora from "../EditBitacora";
import useBitacoras from "../../Hooks/useBitacoras"; // Importa el hook personalizado
import { format } from 'date-fns';


const BitacoraList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { auth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const { bitacoras, tags, users, loading, hasMore, loadBitacoras, error: loadError } = useBitacoras(currentPage, selectedTags);

  useEffect(() => {
    if (success || error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setSuccess(false);
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleDelete = async (bitacoraId) => {
    try {
      await deletePost(bitacoraId, auth.username, auth.password);
      loadBitacoras(currentPage);
      setSuccess(true);
    } catch (error) {
      setError("Failed to delete bitacora");
      console.error("Failed to delete bitacora:", error);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleAddButtonClick = () => {
    setModalContent(<CreateBitacora closeModal={handleCloseModal} tags={tags} />);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent(null);
    loadBitacoras(currentPage);
  };

  const handleEditButtonClick = (bitacora) => {
    setModalContent(
      <EditBitacora bitacora={bitacora} closeModal={handleCloseModal} tags={tags} />
    );
    setShowModal(true);
  };

  const handleTagFilter = (tagId) => {
    if (tagId === null) {
      setSelectedTags([]);
    } else {
      if (selectedTags.includes(tagId)) {
        setSelectedTags(
          selectedTags.filter((selectedTag) => selectedTag !== tagId)
        );
      } else {
        setSelectedTags([...selectedTags, tagId]);
      }
    }
    setCurrentPage(1);
  };

  return (
    <div className="row mt-3">
      <div className="col-12 mb-3">
        {showAlert && (
          <div
            className={`alert ${success ? "alert-success" : "alert-danger"}`}
            role="alert"
          >
            {success ? "Bitacora eliminada con éxito" : error}
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <h1>Bitácora</h1>
          <AddButton onClick={handleAddButtonClick} />
        </div>
        <div className="col">
          <h5>Filtrar por etiquetas:</h5>
          <div className="btn-group" key={selectedTags.join('-')}>
            <button
              className={`btn btn-secondary ${selectedTags.length === 0 ? "active" : ""
                }`}
              onClick={() => handleTagFilter(null)}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={`btn btn-secondary ${selectedTags.includes(tag.id) ? "active" : ""
                  }`}
                onClick={() => handleTagFilter(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {loading ? (
        <AjaxLoader />
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Autor</th>
                <th>Fecha</th>
                <th>Título</th>
                <th>Contenido</th>
                <th>Etiquetas</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bitacoras.map((bitacora) => (
                <tr key={bitacora.id}>
                  <td>
                    {users.find((user) => user.id === bitacora.author)?.name || "Desconocido"}
                  </td>
                  <td>{format(new Date(bitacora.date), 'dd/MM/yyyy')}</td>
                  <td>{bitacora.title.rendered}</td>
                  <td dangerouslySetInnerHTML={{ __html: bitacora.content.rendered }}></td>
                  <td>
                    {bitacora.tags.map((tagId) => {
                      const tag = tags.find((tag) => tag.id === tagId);
                      return tag ? tag.name + ", " : "Sin etiqueta";
                    })}
                  </td>
                  <td>
                    <div className="d-flex justify-content-end">
                      <EditButton
                        onClick={() => handleEditButtonClick(bitacora)}
                      />
                      <DeleteButton onClick={() => handleDelete(bitacora.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-primary"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNextPage}
              disabled={!hasMore}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
      <Modal show={showModal} onClose={handleCloseModal} title="Bitácora">
        {modalContent}
      </Modal>
    </div>
  );
};

export default BitacoraList;
