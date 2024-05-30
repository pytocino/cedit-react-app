import React, { useState, useEffect, useRef } from "react";
import { getUsers, deleteUser, getRoles } from "../Services/UserService";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRole, setSelectedRole] = useState(""); // Estado para el filtro por rol
  const allUsersRef = useRef([]); // Guardar todos los usuarios

  const loadUsers = async (page = 1, perPage = 10) => {
    try {
      setLoading(true);
      const fetchedUsers = await getUsers(page, perPage);
      const fetchedUserRoles = await getUserRoles();
      const fetchedRoles = await getRoles();

      const filteredUsers = filterUsersByRole(fetchedUsers, selectedRole);

      setUsers(filteredUsers);
      setUserRoles(fetchedUserRoles);
      setRoles(fetchedRoles);
      setHasMore(fetchedUsers.length >= perPage);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const perPage = selectedRole ? 100 : 10; // Cambia perPage según si hay filtro o no
    loadUsers(currentPage, perPage);
  }, [currentPage]);

  useEffect(() => {
    const filteredUsers = filterUsersByRole(allUsersRef.current, selectedRole);
    setUsers(filteredUsers);
    setCurrentPage(1); // Reinicia a la primera página cuando cambia el filtro
  }, [selectedRole]);

  const filterUsersByRole = (users, role) => {
    if (!role) return users;
    const userIdsWithSelectedRole = userRoles
      .filter((userRole) => userRole.roles.includes(role))
      .map((userRole) => userRole.user_id);
    return users.filter((user) => userIdsWithSelectedRole.includes(user.id));
  };

  const handleDeleteUser = async (userId) => {
    try {
      const reassignId = prompt(
        "Enter the ID to reassign the user's data to:",
        1
      );
      const authName = auth.username;
      await deleteUser(userId, reassignId, authName);
      loadUsers(currentPage, selectedRole ? 100 : 10);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="row mt-3">
        <div className="col-12 mb-3">
          <h1>Lista de usuarios</h1>
          <div className="d-flex">
            <button
              className="btn btn-primary"
              onClick={() => loadUsers(currentPage, selectedRole ? 100 : 10)}
              disabled={loading}
            >
              Buscar
            </button>
            <div className="ms-3">
              <label htmlFor="roleFilter" className="me-2">
                Filtrar por rol/grupo
              </label>
              <select
                id="roleFilter"
                className="form-select"
                onChange={handleRoleChange}
                value={selectedRole}
              >
                <option value="">All</option>
                {Object.entries(roles).map(([roleId, role]) => (
                  <option key={roleId} value={roleId}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <AjaxLoader />
        ) : (
          <>
            <div className="mb-3 d-flex justify-content-between">
              <button
                className="btn btn-primary"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage}</span>
              <button
                className="btn btn-primary"
                onClick={handleNextPage}
                disabled={!hasMore}
              >
                Next
              </button>
            </div>
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
                  const userRole = userRoles.find(
                    (role) => role.user_id === user.id
                  );

                  return (
                    <tr key={user.id} className="align-items-center">
                      <td>{user.name}</td>
                      <td>
                        {userRole ? (
                          userRole.roles.map((roleId) => (
                            <span key={roleId}>{roles[roleId].name}, </span>
                          ))
                        ) : (
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
            <div className="mb-5 d-flex justify-content-between">
              <button
                className="btn btn-primary"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage}</span>
              <button
                className="btn btn-primary"
                onClick={handleNextPage}
                disabled={!hasMore}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserList;
