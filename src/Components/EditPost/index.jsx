import React, { useState } from "react";
import { useAuth } from "../../Contexts/authContext";
import { updatePost } from "../../Services/PostService";

const EditPost = ({ post, closeModal }) => {
  const [title, setTitle] = useState(post.title.rendered);
  const [content, setContent] = useState(post.content.rendered);
  const { auth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(
        post.id,
        { title, content, status: "publish" },
        auth.username,
        auth.password
      );
      closeModal();
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Editar post</h2>
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
          Actualizar post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
