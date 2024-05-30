const API_URL = "https://cedit.upct.es/wp-json/wp/v2";
const username = "admin";
const application_password = "mVef OAnh OdFn wgFK WAqL MeqL";

const getBitacoras = async (page = 1, selectedTags) => {
  try {
    let url = `${API_URL}/posts/?categories=23&password=${application_password}&page=${page}`;

    // Agregar el parámetro de tags solo si selectedTag no es null
    if (selectedTags !== undefined && selectedTags !== null) {
      url += `&tags=${selectedTags}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + application_password),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bitacoras");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

const createBitacora = async (post) => {
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

const editBitacora = async (postId, post) => {
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
      throw new Error("Failed to edit post");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to edit post:", error);
    throw error;
  }
};

export { getBitacoras, createBitacora, editBitacora };
