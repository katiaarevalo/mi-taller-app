import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import WorkOrders from "../pages/WorkOrders";
import Vehicles from "../pages/Vehicles";
import Clients from "../pages/Clients";
import ErrorScreen from "../pages/ErrorScreen";
import { Grid2 } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Cotizaciones from "../pages/Cotizaciones";
import WorkOrdersCalendar from '../pages/WorkOrdersCalendar';
import Suppliers from "../pages/Suppliers";

const RouterApp = () => {
  return (
    <>
      <Grid2 container sx={{ minHeight: "98vh" }}>
        <Grid2 item xs={12} md={2.5}>
          <Sidebar />
        </Grid2>

        <Grid2 item xs={12} md={9.5}>
          <Grid2
            container
            direction="column"
            justifyContent="center"
            paddingRight={2}
            paddingLeft={2}
          >
            <Grid2 item xs={12}>
              <Routes>
                <Route path="/" element={<Navigate to="/analytics" />} />
                <Route path="/analytics" element={<Dashboard />} />
                <Route path="/work-orders-calendar" element={<WorkOrdersCalendar />} />
                <Route path="/work-orders" element={<WorkOrders />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/cotizaciones" element={<Cotizaciones />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/*" element={<ErrorScreen />} />
              </Routes>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </>
  );
};

export default RouterApp;