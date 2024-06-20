import React, { useState, useEffect, useRef } from "react";
import { getUsers, deleteUser, getRoles } from "../../Services/UserService";
import AjaxLoader from "../AjaxLoader";
import { useAuth } from "../../Contexts/authContext";
import { DeleteButton } from "../DeleteButton";
import { getUserRoles } from "../../Services/UserRoles";
import AddButton from "../AddButton";
import Modal from "../Modal"; // Importa el modal genérico
import CreateUser from "../CreateUser";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);
  const { auth } = useAuth();
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const allUsersRef = useRef([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Estado para el contenido del modal
  const [success, setSuccess] = useState(false); // Estado para mostrar mensaje de éxito
  const [error, setError] = useState(null); // Estado para mostrar mensaje de error
  const [selectedEmails, setSelectedEmails] = useState([]);


  const loadUsers = async (page = 1, perPage = 100) => {
    try {
      setLoading(true);
      const fetchedUsers = await getUsers(
        page,
        perPage,
        auth.username,
        auth.password
      );
      const fetchedUserRoles = await getUserRoles(auth.username, auth.password);
      const fetchedRoles = await getRoles(auth.username, auth.password);

      allUsersRef.current = fetchedUsers;

      setUserRoles(fetchedUserRoles);
      setRoles(fetchedRoles);
      setHasMore(fetchedUsers.length >= perPage);

      const filteredUsers = filterUsersByRole(fetchedUsers, selectedRole);
      setUsers(filteredUsers);
      setSelectedEmails(filteredUsers.map(user => user.email));
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const perPage = selectedRole ? 100 : 100;
    loadUsers(currentPage, perPage);
  }, [currentPage, selectedRole]);

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
      await deleteUser(userId, reassignId, auth.username, auth.password);
      loadUsers(currentPage, selectedRole ? 100 : 100);
      setSuccess(true);
    } catch (error) {
      console.error("Failed to delete user:", error);
      setError(error.message);
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

  const handleAddButtonClick = () => {
    setModalContent(<CreateUser closeModal={handleCloseModal} />);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    loadUsers(currentPage, selectedRole ? 100 : 100);
  };

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (success || error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setSuccess(false);
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="row mt-3">
      <div className="col-12 mb-3">
        {showAlert && (
          <div
            className={`alert ${success ? "alert-success" : "alert-danger"}`}
            role="alert"
          >
            {success ? "Usuario eliminado con éxito" : error}
          </div>
        )}
        <h1>Usuarios</h1>
        <div className="d-flex justify-content-between">
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
              <option value="">Todos</option>
              {Object.entries(roles).map(([roleId, role]) => (
                <option key={roleId} value={roleId}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <a
          href={`mailto:${selectedEmails.join(";")}`}
          className="btn btn-secondary d-flex align-items-center justify-content-center"
        >
          Enviar correo al grupo seleccionado
        </a>
          <AddButton onClick={handleAddButtonClick} />
        </div>
      </div>
      {loading ? (
        <AjaxLoader />
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre de usuario</th>
                <th>Grupo</th>
                <th>Correo</th>
                <th>Telefono</th>
                <th>Tarjeta</th>
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
                          <span key={roleId}>
                            {roles[roleId] ? roles[roleId].name : "Unknown"},
                          </span>
                        ))
                      ) : (
                        <p>No roles</p>
                      )}
                    </td>
                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                    <td>{user.meta.telefono}</td>
                    <td>{user.meta.tarjeta === true ? "Si" : "No"}</td>
                    <td className="d-flex justify-content-end">
                      <DeleteButton onClick={() => handleDeleteUser(user.id)} />
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

      {/* Modal */}
      <Modal show={showModal} onClose={handleCloseModal} title="Add User">
        {modalContent}
      </Modal>
    </div>
  );
};

export default UserList;
