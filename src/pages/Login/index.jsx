import React, { useState } from "react";
import { authenticate, borrarTodasLasCookies } from "../../Services/AuthService";
import { useLocation } from "wouter";
import { useNavigate, useNavigation } from "react-router-dom";
import '../../index.css';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  console.log(location);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    borrarTodasLasCookies();
    try {
      await authenticate(username, password);
      const redirectPath = "/cedit-react-app";
      window.location.href = redirectPath;
    } catch (error) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-header">Inicio de Sesión</div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group d-flex">
                  <button type="button" className="btn btn-secondary" onClick={() => { window.location.href = 'https://cedit.upct.es/'; }}>
                    Wordpress
                  </button>
                </div>
                <div className="form-group d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Iniciar Sesión
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
