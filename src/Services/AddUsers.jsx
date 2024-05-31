const addUser = async (userData, username, password) => {
  try {
    const response = await fetch("https://cedit.upct.es/wp-json/wp/v2/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(username + ":" + password),
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    return await response.json();
  } catch (error) {
    console.error("Add user failed:", error);
    return null;
  }
};

const generateRandomUser = (roles) => {
  const randomString = (length) =>
    Math.random()
      .toString(36)
      .substring(2, 2 + length);
  const roleNames = Object.keys(roles);
  const randomRole = roleNames[Math.floor(Math.random() * roleNames.length)];

  return {
    username: `user_${randomString(8)}`,
    email: `${randomString(8)}@example.com`,
    password: randomString(12),
    roles: [randomRole],
  };
};

const addRandomUsers = async (count, roles, username, password) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const newUser = generateRandomUser(roles);
    const addedUser = await addUser(newUser, username, password);
    if (addedUser) {
      users.push(addedUser);
    }
  }
  return users;
};

export { addUser, addRandomUsers };
