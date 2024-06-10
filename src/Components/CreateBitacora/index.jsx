import React, { useState } from "react";
import { useAuth } from "../../Contexts/authContext";
import { createBitacora } from "../../Services/BitacoraService";
import SunEditor from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const CreateBitacora = ({ closeModal, tags }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { auth } = useAuth();
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBitacora = {
      title: title,
      content: content,
      status: "publish",
      categories: 23,
      tags: selectedTags,
    };
    try {
      await createBitacora(
        newBitacora,
        auth.username,
        auth.password
      );
      closeModal();
    } catch (error) {
      setError("Failed to create post");
    }
  };

  const handleTags = (e) => {
    const tagId = parseInt(e.target.value);
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  }

  return (
    <div>
      <h2 className="mb-4">Crear Bitácora</h2>
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
        <div className="form-group mb-3">
          <label htmlFor="tags">Etiquetas</label>
          <div className="d-flex flex-wrap">
            {tags.map((tag) => (
              <div key={tag.id} className="form-check me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={tag.id}
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onChange={handleTags}
                />
                <label
                  className="form-check-label"
                  htmlFor={`tag-${tag.id}`}
                >
                  {tag.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Crear bitácora
        </button>
      </form>
    </div>
  );
};

export default CreateBitacora;
