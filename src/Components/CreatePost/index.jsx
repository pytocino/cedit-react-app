import React, { useState } from "react";
import { createPost } from "../../Services/PostService";
import { useAuth } from "../../Contexts/authContext";
import SunEditor from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const CreatePost = ({ closeModal }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { auth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      title: title,
      content: content,
      status: "publish",
    };
    try {
      await createPost(
        newPost,
        auth.username,
        auth.password
      );
      closeModal();
    } catch (error) {
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
          <SunEditor
            setOptions={{
              buttonList: [
                ["undo", "redo"],
                ["fontSize", "formatBlock"],
                [
                  "bold",
                  "underline",
                  "italic",
                  "strike",
                ],
                ["fontColor", "hiliteColor"],
                ["align", "list"],

                ["table", "horizontalRule", "link", "image"],
                //['imageGallery'], // You must add the "imageGalleryUrl".
                // ["fullScreen", "showBlocks", "codeView"],
                ["removeFormat"]

              ],
              defaultTag: "p",
              minHeight: "600px",
              showPathLabel: false,
            }}
            setContents={content}
            onChange={setContent}

          />
        </div>
        <button type="submit" className="btn btn-primary">
          Crear post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
