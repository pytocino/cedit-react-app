import React, { useState, useEffect } from "react";
import { getUserRoles } from "../../Services/UserRoles";
import { getRoles } from "../../Services/UserService";
import AjaxLoader from "../../Components/AjaxLoader";
import { useAuth } from "../../Contexts/authContext";
import { addRandomUsers } from "../../Services/AddUsers";

const Home = () => {
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchRolesAndUserRoles = async () => {
      try {
        setLoading(true);
        const fetchedRolesObject = await getRoles();
        const fetchedUserRoles = await getUserRoles();
        setRoles(fetchedRolesObject);
        setUserRoles(fetchedUserRoles);
      } catch (error) {
        console.error("Failed to fetch roles and user roles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRolesAndUserRoles();
  }, []);

  const getUsersByRole = (roleId) => {
    const usersWithRole = userRoles.filter((userRole) =>
      userRole.roles.includes(roleId)
    );
    return usersWithRole.map((user) => user.user_login).join(", ");
  };

  const handleAddRandomUsers = async () => {
    await addRandomUsers(10, roles); // Añadir 10 usuarios aleatorios
    // Refrescar los roles de usuarios después de añadirlos
    const fetchedUserRoles = await getUserRoles();
    setUserRoles(fetchedUserRoles);
  };

  const roleEntries = Object.entries(roles);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1>Grupos</h1>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {loading ? (
            <AjaxLoader />
          ) : (
            roleEntries.map(([roleId, role]) => (
              <div key={roleId} className="col-3 mb-3">
                <div className="card">
                  <div className="card-header">{role.name}</div>
                  <div className="card-body">
                    <ul>
                      {getUsersByRole(roleId) ? (
                        getUsersByRole(roleId)
                          .split(",")
                          .map((user, index) => (
                            <li key={index}>{user.trim()}</li>
                          ))
                      ) : (
                        <li>Todavia no hay usuarios en este grupo.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="row">
          <div className="col-12">
            <h1>Grupos</h1>
            <button
              onClick={handleAddRandomUsers}
              className="btn btn-primary mb-3"
            >
              Añadir Usuarios Aleatorios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
