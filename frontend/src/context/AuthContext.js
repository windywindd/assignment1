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

    // Save user info in state, including role
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role, // <-- store role here
      token: data.token, // optional, if you want to keep token in context
    });
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
