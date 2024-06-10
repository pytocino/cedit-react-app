import React, { useState } from "react";
import { useAuth } from "../../Contexts/authContext";
import { updatePost } from "../../Services/PostService";
import SunEditor from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const EditPost = ({ post, closeModal }) => {
  const [title, setTitle] = useState(post.title.rendered);
  const [content, setContent] = useState(post.content.rendered);
  const { auth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      title: title,
      content: content,
      status: "publish",
    };
    try {
      await updatePost(
        post.id,
        newPost,
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
              minHeight: "250px",
              showPathLabel: false,
            }}
            setContents={content}
            onChange={setContent}

          />
        </div>
        <button type="submit" className="btn btn-primary">
          Actualizar post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
