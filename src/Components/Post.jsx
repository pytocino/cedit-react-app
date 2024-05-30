import React, { useState } from "react";
import { deletePost, updatePost } from "../Services/PostService";

const Post = ({ post }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title.rendered);
  const [editedContent, setEditedContent] = useState(post.content.rendered);

  const handleUpdate = () => {
    updatePost(post.id, {
      title: editedTitle,
      content: editedContent,
    });
    setIsEditing(false);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              type="text"
              className="form-control mb-2"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className="form-control mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </>
        ) : (
          <>
            <h5 className="card-title">Titulo: {post.title.rendered}</h5>
            <div
              className="card-text"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </>
        )}
      </div>
      <div className="card-footer">
        {isEditing ? (
          <button className="btn btn-success me-2" onClick={handleUpdate}>
            Save
          </button>
        ) : (
          <>
            <button
              className="btn btn-primary me-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                deletePost(post.id);
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
