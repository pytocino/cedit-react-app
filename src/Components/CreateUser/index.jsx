import React, { useState, useEffect } from "react";
import { createUser, getRoles } from "../../Services/UserService";
import { useAuth } from "../../Contexts/authContext";
import AjaxLoader from "../AjaxLoader";

const CreateUser = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState(["subscriber"]);
  const [roleOptions, setRoleOptions] = useState([]);
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const fetchedRoles = await getRoles(auth.username, auth.password);
      const transformedRoles = Object.entries(fetchedRoles).map(
        ([id, details]) => ({
          id,
          name: details.name,
        })
      );
      setRoleOptions(transformedRoles);
    } catch (error) {
      console.error("Failed to load roles:", error);
    } finally {
      setLoading(false);
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
      roles: roles,
      password: password,
    };

    try {
      await createUser(newUser, auth.username, auth.password);
      setName("");
      setEmail("");
      setPassword("");
      setRoles(["subscriber"]);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    if (roles.includes(roleId)) {
      setRoles(roles.filter((role) => role !== roleId));
    } else {
      setRoles([...roles, roleId]);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <h1>Create User</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-2">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label className="form-label">
                Roles/Grupos{" "}
                <small>
                  (es necesario marcar al menos un rol/grupo, por defect está
                  marcado suscriptor)
                </small>
              </label>
              <div className="d-flex flex-wrap">
                {loading ? (
                  <AjaxLoader />
                ) : Array.isArray(roleOptions) && roleOptions.length > 0 ? (
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
              Create User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
