const API_URL = "https://cedit.upct.es/wp-json/wp/v2";

const setCookie = (name, value, minutes) => {
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const authenticate = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users?context=edit`, {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Authentication failed");
    }

    setCookie("authToken", btoa(username + ":" + password), 15);
    return true, password;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};

const getToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
};

const isAuthenticated = () => {
  return !!getToken();
};

const clearToken = () => {
  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export { authenticate, getToken, isAuthenticated, clearToken };
