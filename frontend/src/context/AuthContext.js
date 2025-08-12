import React, { createContext, useState, useContext } from 'react';

// Create context
const AuthContext = createContext();

// Provide context to app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function: save token & user info
  const login = (data) => {
    // Save token for axios interceptor
    localStorage.setItem('token', data.token);

    // Save user info in state (customize based on your response shape)
    setUser({ id: data.id, name: data.name, email: data.email });
  };

  // Optional logout function clears token & user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context easily
export const useAuth = () => useContext(AuthContext);
