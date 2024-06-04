import React, { useState } from "react";
import { useAuth } from "../../Contexts/authContext";
import { editBitacora } from "../../Services/BitacoraService";
import SunEditor from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
const EditBitacora = ({ bitacora, closeModal }) => {
  const [title, setTitle] = useState(bitacora.title.rendered);
  const [content, setContent] = useState(bitacora.content.rendered);
  const { auth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editBitacora(
        bitacora.id,
        { title, content, status: "publish" },
        auth.username,
        auth.password
      );
      closeModal();
    } catch (error) {
      console.error("Failed to update bitacora:", error);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Editar bitácora</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="title">Título</label>
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
                ["fontSize"],
                [
                  "bold",
                  "underline",
                  "italic",
                  "strike",
                ],
                ["fontColor", "hiliteColor"],
                ["align", "list"],

                ["table", "horizontalRule", "link", "image"],
                ['imageGallery'], // You must add the "imageGalleryUrl".
                // ["fullScreen", "showBlocks", "codeView"],
                ["removeFormat"]

              ],
              defaultTag: "div",
              minHeight: "600px",
              showPathLabel: false,
            }}
            setContents={content}
            onChange={setContent}

          /></div>
        <button type="submit" className="btn btn-primary">
          Actualizar bitácora
        </button>
      </form>
    </div>
  );
};

export default EditBitacora;
