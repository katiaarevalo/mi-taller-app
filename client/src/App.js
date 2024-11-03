import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/login"; 
import ProtectedRoutes from "./routes/ProtectedRoutes";
import RouterApp from "./routes/RouterApp"; 

const App = () => {
  return (
    <Routes>
      {/* Redirigir la ruta predeterminada ("/") a "/login" */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Ruta pública para Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route
        path="/*"
        element={
          <ProtectedRoutes>
            <RouterApp /> 
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
};

export default App;