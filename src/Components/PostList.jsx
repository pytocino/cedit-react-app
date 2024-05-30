import React, { useState, useEffect, useRef } from "react";
import { deletePost, getPosts, getTags } from "../Services/PostService";
import AjaxLoader from "./AjaxLoader";
import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tags, setTags] = useState([]);
  const prevPagePostsRef = useRef([]);

  const loadPosts = async (page = 1) => {
    try {
      setLoading(true);
      const fetchedPosts = await getPosts(page);
      const fetchedTags = await getTags();
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
    loadPosts(currentPage);
  }, [currentPage]);

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      loadPosts(currentPage);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleUpdate = () => {
    loadPosts(currentPage);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
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
    <div className="row mt-3 flex-grow-0">
      {loading ? (
        <AjaxLoader />
      ) : (
        <>
          <div className="d-flex justify-content-between">
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
              {posts.map((post) => (
                <tr key={post.id} className="align-items-center">
                  <td>{post.title.rendered}</td>
                  <td
                    dangerouslySetInnerHTML={{
                      __html: post.content.rendered,
                    }}
                  ></td>
                  <td>
                    {post.tags
                      .map((tagId) => {
                        const tag = tags.find((tag) => tag.id === tagId);
                        return tag ? tag.name : "";
                      })
                      .join(", ")}
                  </td>
                  <td>{post.date}</td>
                  <td>
                    <div className="d-flex justify-content-end">
                      <EditButton bitacora={post} onClick={handleUpdate} />
                      <DeleteButton onClick={() => handleDelete(post.id)} />
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

export default PostList;
