// src/Services/postService.js
const API_URL = "https://cedit.upct.es/wp-json/wp/v2";
const username = "admin";
const application_password = "mVef OAnh OdFn wgFK WAqL MeqL";

const getPosts = async (page = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/posts?page=${page}&password=${application_password}`,
      {
        method: "GET",
        // headers: {
        //   Authorization: "Basic " + btoa(username + ":" + application_password),
        //   "Content-Type": "application/json",
        // },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

const createPost = async (post) => {
  try {
    post.password = application_password;
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + application_password),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create post:", error);
    throw error;
  }
};

const deletePost = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + application_password),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
  } catch (error) {
    console.error("Failed to delete post:", error);
    throw error;
  }
};

const updatePost = async (postId, post) => {
  try {
    post.password = application_password;
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + application_password),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error("Failed to update post");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update post:", error);
    throw error;
  }
};

const getTags = async () => {
  try {
    const response = await fetch(`${API_URL}/tags`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + application_password),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

export { getPosts, createPost, deletePost, updatePost, getTags };
