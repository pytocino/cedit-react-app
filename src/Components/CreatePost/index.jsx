import React, { useState } from "react";
import { createPost } from "../../Services/PostService";
import { useAuth } from "../../Contexts/authContext";

const CreatePost = ({ closeModal }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { auth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(
        { title, content, status: "publish" },
        auth.username,
        auth.password
      );
      closeModal();
    } catch (error) {
      console.error("Failed to create post:", error);
      setError("Failed to create post");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Crear post</h2>
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
          Crear post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
