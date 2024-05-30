const getUserRoles = async () => {
  try {
    const username = "admin";
    const application_password = "mVef OAnh OdFn wgFK WAqL MeqL";
    const perPage = 100; // Puedes ajustar este valor según sea necesario
    const maxPages = 100; // Límite máximo de páginas para evitar bucles infinitos
    let page = 1;
    let allUsers = [];
    let hasMore = true;

    while (hasMore && page <= maxPages) {
      const response = await fetch(
        `https://cedit.upct.es/wp-json/custom/v1/user-roles?per_page=${perPage}&page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Basic " + btoa(username + ":" + application_password),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      const data = await response.json();

      if (data.length < perPage) {
        hasMore = false;
      }

      allUsers = [...allUsers, ...data];
      page += 1;
    }

    // Normalize roles to arrays
    const normalizedData = allUsers.map((user) => {
      if (typeof user.roles === "object" && !Array.isArray(user.roles)) {
        user.roles = Object.values(user.roles);
      }
      return user;
    });

    return normalizedData;
  } catch (error) {
    console.error("Fetch failed:", error);
    return []; // Devuelve un array vacío en caso de error
  }
};

export { getUserRoles };
