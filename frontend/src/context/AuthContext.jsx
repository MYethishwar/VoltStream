import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("vs_user")) || null
  );

  const login = (userData, token) => {
    localStorage.setItem("vs_user", JSON.stringify(userData));
    localStorage.setItem("vs_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("vs_user");
    localStorage.removeItem("vs_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);