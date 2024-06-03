import React, { useState, useEffect } from "react";
import { getTags } from "../Services/PostService";
import { createBitacora, editBitacora } from "../Services/BitacoraService";

const BitacoraForm = ({ bitacora, onSave }) => {
  const [title, setTitle] = useState(bitacora ? bitacora.title.rendered : "");
  const [content, setContent] = useState(
    bitacora ? bitacora.content.rendered : ""
  );
  const [selectedTags, setSelectedTags] = useState(
    bitacora ? bitacora.tags : []
  );
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const fetchedTags = await getTags();
        setTags(fetchedTags);
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    };

    loadTags();
  }, []);

  const handleTagChange = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bitacoraData = {
        title: title,
        content: content,
        tags: selectedTags,
        status: "publish",
      };

      if (bitacora) {
        await editBitacora(bitacora.id, bitacoraData);
      } else {
        await createBitacora(bitacoraData);
      }
      onSave();
    } catch (error) {
      console.error("Failed to save bitacora:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Título</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Contenido</label>
        <textarea
          className="form-control"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div className="form-group">
        <label>Etiquetas</label>
        <div>
          {tags.map((tag) => (
            <div key={tag.id} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={() => handleTagChange(tag.id)}
              />
              <label className="form-check-label">{tag.name}</label>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
};

export default BitacoraForm;
