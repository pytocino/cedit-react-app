import React, { useState, useEffect, useRef } from "react";
import { deletePost, getPosts, getTags } from "../../Services/PostService";
import AjaxLoader from "../AjaxLoader";
import { EditButton } from "../EditButton";
import { DeleteButton } from "../DeleteButton";
import { useAuth } from "../../Contexts/authContext";
import AddButton from "../AddButton";
import Modal from "../Modal"; // Importa el modal genérico
import CreatePost from "../CreatePost";
import EditPost from "../EditPost";
import { getUsers } from "../../Services/UserService";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tags, setTags] = useState([]);
  const prevPagePostsRef = useRef([]);
  const { auth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Estado para el contenido del modal
  const [success, setSuccess] = useState(false); // Estado para mostrar mensaje de éxito
  const [error, setError] = useState(null); // Estado para mostrar mensaje de error
  const [showAlert, setShowAlert] = useState(false);
  const [users, setUsers] = useState([]);

  const loadPosts = async (page = 1) => {
    try {
      setLoading(true);
      const fetchedPosts = await getPosts(page, auth.username, auth.password);
      const fetchedTags = await getTags(auth.username, auth.password);
      const fetchedUsers = await getUsers(1, 10, auth.username, auth.password);
      setUsers(fetchedUsers);
      setPosts(fetchedPosts);
      setTags(fetchedTags);
      // Verificar si hay más de 10 resultados y si los resultados son diferentes de la página anterior
      setHasMore(
        fetchedPosts.length >= 10 &&
        !arraysAreEqual(fetchedPosts, prevPagePostsRef.current)
      );
      prevPagePostsRef.current = fetchedPosts.slice(); // Copiar los resultados de la página actual para la próxima comparación
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };
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

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId, auth.username, auth.password);
      loadPosts(currentPage);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleAddButtonClick = () => {
    setModalContent(<CreatePost closeModal={handleCloseModal} />);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    loadPosts(currentPage);
  };

  const handleEditButtonClick = (post) => {
    setModalContent(<EditPost post={post} closeModal={handleCloseModal} />);
    setShowModal(true);
  };

  // Función para verificar si dos arrays de posts son iguales
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



  return (
    <div className="row mt-3">
      <div className="col-12 mb-3">
        {showAlert && (
          <div
            className={`alert ${success ? "alert-success" : "alert-danger"}`}
            role="alert"
          >
            {success ? "Post eliminado con éxito" : error}
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <h1>Posts</h1>
          <AddButton onClick={handleAddButtonClick} />
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
                <th>Titulo</th>
                <th>Contenido</th>
                <th>Etiquetas</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    {users.map((user) => {
                      if (user.id === post.author) {
                        return user.name;
                      }
                    })}
                  </td>
                  <td>{post.title.rendered}</td>
                  <td
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                  ></td>
                  <td>
                    {post.tags.map((tagId) => {
                      const tag = tags.find((tag) => tag.id === tagId);
                      return tag ? tag.name : "Sin etiqueta";
                    })}
                  </td>
                  <td>
                    <div className="d-flex justify-content-end">
                      <EditButton onClick={() => handleEditButtonClick(post)} />
                      <DeleteButton onClick={() => handleDelete(post.id)} />
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
      <Modal show={showModal} onClose={handleCloseModal} title="Post">
        {modalContent}
      </Modal>
    </div>
  );
};

export default PostList;
