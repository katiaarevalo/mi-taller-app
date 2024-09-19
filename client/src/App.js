import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login"; 
import ProtectedRoutes from "./routes/ProtectedRoutes";
import RouterApp from "./routes/RouterApp"; 

const App = () => {
  return (
    <Routes>
      {/* Ruta pública para Login */}
      <Route path="/login" element={<Login />} />
      
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