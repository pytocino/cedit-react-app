// src/Services/userService.js
const API_URL = "https://cedit.upct.es/wp-json/wp/v2";
const username = "admin";
const application_password = "mVef OAnh OdFn wgFK WAqL MeqL";
const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + application_password),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

const createUser = async (user) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + application_password),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

const deleteUser = async (userId, reassignId, authName) => {
  try {
    const forceDelete = authName === "admin" ? true : false;
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + btoa(authName + ":" + application_password),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        force: forceDelete,
        reassign: reassignId,
      }),
    });

    if (!response.ok) {
      throw new Error(
        "Failed to delete user, you don't have permission to delete users"
      );
    }
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, user) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + application_password),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

const getRoles = async () => {
  try {
    const response = await fetch(
      `https://cedit.upct.es/wp-json/custom/v1/roles`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(username + ":" + application_password),
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch roles");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

export { getUsers, createUser, deleteUser, updateUser, getRoles };
