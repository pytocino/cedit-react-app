import React, { useState } from "react";
import { createPost } from "../Services/PostService";

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ title, content, status: "publish" });
      setSuccessMessage("Post created successfully!");
      setError("");
      onPostCreated(); // Llamar a la función para recargar la lista de posts
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to create post:", error);
      setError("Failed to create post");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
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
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary">
              Crear post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
