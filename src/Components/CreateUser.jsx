import React, { useState, useEffect } from "react";
import { createUser, getRoles } from "../Services/UserService";

const CreateUser = ({ onUserCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState(["subscriber"]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);

  const loadRoles = async () => {
    try {
      const fetchedRoles = await getRoles();
      const transformedRoles = Object.entries(fetchedRoles).map(
        ([id, details]) => ({
          id,
          name: details.name,
        })
      );
      setRoleOptions(transformedRoles);
    } catch (error) {
      console.error("Failed to load roles:", error);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: name,
      name: name,
      email: email,
      password: password,
      roles: roles,
    };

    try {
      await createUser(newUser);
      setSuccessMessage("User created successfully!");
      setErrorMessage("");
      onUserCreated(); // Llamar a la función para recargar la lista de usuarios
      // Limpiar el formulario
      setName("");
      setEmail("");
      setPassword("");
      setRoles(["subscriber"]);
    } catch (error) {
      console.error("Failed to create user:", error);
      setErrorMessage("Failed to create user. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    if (roles.includes(role)) {
      setRoles(roles.filter((r) => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">Crear usuario</h2>
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Roles/Grupos{" "}
                <small>
                  (es necesario marcar al menos un rol/grupo, por defect está
                  marcado suscriptor)
                </small>
              </label>
              <div className="d-flex flex-wrap">
                {Array.isArray(roleOptions) && roleOptions.length > 0 ? (
                  roleOptions.map((role) => (
                    <div key={role.id} className="form-check me-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={role.id}
                        id={`role-${role.id}`}
                        checked={roles.includes(role.id)}
                        onChange={handleRoleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`role-${role.id}`}
                      >
                        {role.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <div>No hay roles disponibles.</div>
                )}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Crear usuario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
