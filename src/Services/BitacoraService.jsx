const API_URL = "https://cedit.upct.es/wp-json/wp/v2";

const getBitacoras = async (page = 1, selectedTags, startDate, endDate, username, password) => {
  try {
    let url = `${API_URL}/posts/?categories=23&page=${page}&password=${password}`;
    if (selectedTags !== undefined && selectedTags !== null) {
      url += `&tags=${selectedTags}`;
    }

    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();
      url += `&after=${formattedStartDate}&before=${formattedEndDate}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
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

const createBitacora = async (bitacora, username, password) => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bitacora),
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

const editBitacora = async (bitacoraId, bitacora, username, password) => {
  try {
    const response = await fetch(`${API_URL}/posts/${bitacoraId}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bitacora),
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
