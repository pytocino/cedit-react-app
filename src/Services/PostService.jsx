// src/Services/postService.js
const API_URL = "https://cedit.upct.es/wp-json/wp/v2";

const getPosts = async (page = 1, username, password) => {
  try {
    const response = await fetch(
      `${API_URL}/posts?page=${page}&password=${password}`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(username + ":" + password),
          "Content-Type": "application/json",
        },
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

const createPost = async (post, username, password) => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
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

const deletePost = async (postId, username, password) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/json",
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

const updatePost = async (postId, post, username, password) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
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

const getTags = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/tags/?per_page=100`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
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

// Función para eliminar una etiqueta por ID
const deleteTag = async (tagId, username, password) => {
  try {
    const response = await fetch(`${API_URL}/tags/${tagId}?force=true`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete tag");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to delete tag:", error);
    throw error;
  }
};

// Función para eliminar todas las etiquetas
const deleteAllTags = async (username, password) => {
  try {
    const tags = await getTags(username, password);
    const deletePromises = tags.map((tag) =>
      deleteTag(tag.id, username, password)
    );
    await Promise.all(deletePromises);
    console.log("All tags deleted successfully");
  } catch (error) {
    console.error("Failed to delete all tags:", error);
    throw error;
  }
};

export { getPosts, createPost, deletePost, updatePost, getTags, deleteAllTags };
