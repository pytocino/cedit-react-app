const API_URL = "https://cedit.upct.es/wp-json/wp/v2";

const setCookie = (name, value, minutes) => {
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const borrarTodasLasCookies = () => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name] = cookie.split("=");
    console.log(name.trim());
    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
};

// Función para autenticar al usuario
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
      throw new Error("Authentication failed: Invalid username or password");
    }
    borrarTodasLasCookies();
    setCookie("authToken", btoa(username + ":" + password), 15);
    return true;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error; // Lanzar error para manejarlo en el componente llamador
  }
};


// Función para obtener el token de autenticación de las cookies
const getToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
};

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  return !!getToken();
};

// Función para eliminar el token de autenticación
const clearToken = () => {
  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};



export { authenticate, getToken, isAuthenticated, clearToken };
