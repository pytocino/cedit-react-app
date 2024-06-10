import React, { useState, useEffect } from "react";
import { deletePost } from "../../Services/PostService";
import AjaxLoader from "../AjaxLoader";
import { EditButton } from "../EditButton";
import { DeleteButton } from "../DeleteButton";
import { useAuth } from "../../Contexts/authContext";
import AddButton from "../AddButton";
import Modal from "../Modal";
import CreatePost from "../CreatePost";
import EditPost from "../EditPost";
import usePosts from "../../Hooks/usePosts"; // Importa tu hook personalizado

const PostList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { auth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const { posts, users, loading, hasMore, loadPosts } = usePosts(currentPage);

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

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId, auth.username, auth.password);
      loadPosts(currentPage);
      setSuccess(true);
    } catch (error) {
      setError("Failed to delete post");
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

  return (
    <div className="row mt-3">
      <div className="col-12 mb-3">
        {showAlert && (
          <div className={`alert ${success ? "alert-success" : "alert-danger"}`} role="alert">
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
                <th>Título</th>
                <th>Contenido</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    {users.find((user) => user.id === post.author)?.name || "Desconocido"}
                  </td>
                  <td>{post.title.rendered}</td>
                  <td dangerouslySetInnerHTML={{ __html: post.content.rendered }}></td>
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