import React, { useEffect } from "react";
import { Router, Switch, Route } from "wouter";
import { AuthProvider, useAuth } from "./Contexts/authContext";
import { isAuthenticated } from "./Services/AuthService";
import AuthenticatedLayout from "./Components/AuthenticatedLayout";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Posts from "./pages/Posts";
import Bitacora from "./pages/Bitacora";

const AppContent = () => {
  const { auth, login } = useAuth();
  const authenticated = !!auth.token;

  useEffect(() => {
    if (!authenticated && isAuthenticated()) {
      const token = isAuthenticated();
      const [username, password] = atob(token).split(":");
      login(username, password);
    }
  }, [authenticated, login]);

  return (
    <Router>
      {authenticated ? (
        <AuthenticatedLayout>
          <Switch>
            <Route path="/cedit-react-app/" component={Home} />
            <Route path="/cedit-react-app/users" component={Users} />
            <Route path="/cedit-react-app/posts" component={Posts} />
            <Route path="/cedit-react-app/bitacora" component={Bitacora} />
          </Switch>
        </AuthenticatedLayout>
      ) : (
        <LoginPage />
      )}
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
