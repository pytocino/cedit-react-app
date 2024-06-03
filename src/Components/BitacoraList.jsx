import React, { useState, useEffect, useRef } from "react";
import { getBitacoras } from "../Services/BitacoraService";
import AjaxLoader from "./AjaxLoader";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { deleteAllTags, deletePost, getTags } from "../Services/PostService";
import { useAuth } from "../Contexts/authContext";

const BitacoraList = () => {
  const [bitacoras, setBitacoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const prevPageBitacorasRef = useRef([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]); // Inicializar como un array vacío
  const { auth } = useAuth();

  const loadBitacoras = async (page = 1) => {
    try {
      setLoading(true);
      let fetchedBitacoras = [];
      if (selectedTags.length > 0) {
        fetchedBitacoras = await getBitacoras(
          page,
          selectedTags.join(","),
          auth.username,
          auth.password
        );
      } else {
        fetchedBitacoras = await getBitacoras(
          page,
          null,
          auth.username,
          auth.password
        );
      }
      const fetchedTags = await getTags(auth.username, auth.password);
      setBitacoras(fetchedBitacoras);
      setTags(fetchedTags);
      setHasMore(
        fetchedBitacoras.length >= 10 &&
          !arraysAreEqual(fetchedBitacoras, prevPageBitacorasRef.current)
      );
      prevPageBitacorasRef.current = fetchedBitacoras.slice();
    } catch (error) {
      console.error("Failed to load bitacoras:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBitacoras(currentPage);
  }, [currentPage, selectedTags]);

  const handleDelete = async (bitacoraId) => {
    try {
      await deletePost(bitacoraId, auth.username, auth.password);
      loadBitacoras();
    } catch (error) {
      console.error("Failed to delete bitacora:", error);
    }
  };

  const handleUpdate = () => {
    loadBitacoras(currentPage);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  // Función para verificar si dos arrays de bitacoras son iguales
  const arraysAreEqual = (array1, array2) => {
    if (array1.length !== array2.length) {
      return false;
    }
    for (let i = 0; i < array1.length; i++) {
      if (
        array1[i].title.rendered !== array2[i].title.rendered ||
        array1[i].content.rendered !== array2[i].content.rendered
      ) {
        return false;
      }
    }
    return true;
  };

  const handleTagFilter = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tagId)
      );
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
    setCurrentPage(1); // Resetear a la primera página al aplicar el filtro
  };

  const handleDeleteAllTags = async () => {
    deleteAllTags(auth.username, auth.password);
    setSelectedTags([]);
    setCurrentPage(1);
  };

  return (
    <div className="container mt-3">
      {loading ? (
        <AjaxLoader />
      ) : (
        <>
          <div className="row mt-3">
            <div className="col">
              <h5>Filtrar por etiquetas:</h5>
              <div className="btn-group">
                <button
                  className={`btn btn-secondary ${
                    selectedTags.length === 0 ? "active" : ""
                  }`}
                  onClick={() => handleTagFilter(null)}
                >
                  All
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    className={`btn btn-secondary ${
                      selectedTags.includes(tag.id) ? "active" : ""
                    }`}
                    onClick={() => handleTagFilter(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
            {/* <div className="col my-2">
              <button className="btn btn-danger" onClick={handleDeleteAllTags}>
                Borrar todas las etiquetas
              </button>
            </div> */}
          </div>
          <div className="mt-5 d-flex justify-content-between">
            <button
              className="btn btn-primary"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              className="btn btn-primary"
              onClick={handleNextPage}
              disabled={!hasMore}
            >
              Next
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Contenido</th>
                <th>Etiquetas</th>
                <th>Fecha</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bitacoras.map((bitacora) => (
                <tr key={bitacora.id} className="align-items-center">
                  <td>{bitacora.title.rendered}</td>
                  <td
                    dangerouslySetInnerHTML={{
                      __html: bitacora.content.rendered,
                    }}
                  ></td>
                  <td>
                    {bitacora.tags
                      .map((tagId) => {
                        const tag = tags.find((tag) => tag.id === tagId);
                        return tag ? tag.name : "";
                      })
                      .join(", ")}
                  </td>
                  <td>{bitacora.date}</td>
                  <td>
                    <div className="d-flex justify-content-end">
                      <EditButton
                        bitacora={bitacora}
                        tags={tags}
                        onClick={onclick}
                      />
                      <DeleteButton onClick={() => handleDelete(bitacora.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-5 d-flex justify-content-between">
            <button
              className="btn btn-primary"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              className="btn btn-primary"
              onClick={handleNextPage}
              disabled={!hasMore}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BitacoraList;
