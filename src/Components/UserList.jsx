import React, { useState, useEffect } from "react";
import { getUsers, deleteUser, getRoles } from "../Services/UserService"; // Renombrar deleteUser para evitar colisión de nombres
import AjaxLoader from "./AjaxLoader";
import { useAuth } from "../Contexts/authContext";
import { DeleteButton } from "./DeleteButton";
import { getUserRoles } from "../Services/UserRoles";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);
  const { auth } = useAuth();
  const [roles, setRoles] = useState([]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getUsers();
      const fetchedUserRoles = await getUserRoles();
      const fetchedRoles = await getRoles();
      setUsers(fetchedUsers);
      setUserRoles(fetchedUserRoles);
      setRoles(fetchedRoles);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      // Aquí deberías obtener el valor de reassignId y authName
      const reassignId = prompt(
        "Enter the ID to reassign the user's data to:",
        1
      );
      const authName = auth.username;
      console.log("reassignId:", reassignId);
      console.log("authName:", authName);
      await deleteUser(userId, reassignId, authName); // Usa la función deleteUser del servicio UserService
      loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <>
      <div className="row mt-3">
        {loading ? (
          <AjaxLoader />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre de usuario</th>
                <th>Grupo</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                // Buscamos los roles asociados al usuario actual
                const userRole = userRoles.find(
                  (role) => role.user_id === user.id
                );

                return (
                  <tr key={user.id} className="align-items-center">
                    <td>{user.name}</td>
                    <td>
                      {userRole ? (
                        // Si el usuario tiene roles, los mostramos
                        userRole.roles.map((roleId) => (
                          <span key={roleId}>{roles[roleId].name}, </span>
                        ))
                      ) : (
                        // Si el usuario no tiene roles, mostramos un mensaje
                        <p>No roles</p>
                      )}
                    </td>
                    <td className="d-flex justify-content-end">
                      <DeleteButton
                        onDelete={() => handleDeleteUser(user.id)}
                        itemName={user.username}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default UserList;
