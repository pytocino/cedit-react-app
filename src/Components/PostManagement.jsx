// src/components/PostManagement.js
import React, { useState } from "react";
import CreatePost from "./CreatePost";
import PostList from "./PostList";

const PostManagement = () => {
  const [refresh, setRefresh] = useState(false);

  const handlePostCreated = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  return (
    <div className="container mt-4">
      <CreatePost onPostCreated={handlePostCreated} />
      <PostList key={refresh} />
    </div>
  );
};

export default PostManagement;
