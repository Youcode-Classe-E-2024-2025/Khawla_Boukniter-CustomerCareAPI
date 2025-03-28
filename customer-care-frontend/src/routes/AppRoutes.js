import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import TicketList from '../pages/tickets/TicketList';
import TicketDetail from '../pages/tickets/TicketDetail';
import CreateTicket from '../pages/tickets/CreateTicket';
import authService from '../services/authService';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/tickets"
                element={
                    <PrivateRoute>
                        <TicketList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/tickets/new"
                element={
                    <PrivateRoute>
                        <CreateTicket />
                    </PrivateRoute>
                }
            />
            <Route
                path="/tickets/:id"
                element={
                    <PrivateRoute>
                        <TicketDetail />
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;
