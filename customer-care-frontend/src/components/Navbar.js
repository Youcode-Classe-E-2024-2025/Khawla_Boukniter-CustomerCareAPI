import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    Customer Care
                </Link>

                <div style={styles.navLinks}>
                    {isLoggedIn ? (
                        <>
                            <Link to="/tickets" style={styles.navLink}>
                                Tickets
                            </Link>

                            {currentUser?.role === 'client' && (
                                <Link to="/tickets/new" style={styles.navLink}>
                                    Nouveau Ticket
                                </Link>
                            )}

                            <div style={styles.userInfo}>
                                <span style={styles.username}>
                                    {currentUser?.name || 'Utilisateur'}
                                </span>
                                <span style={styles.role}>
                                    {currentUser?.role === 'agent' ? 'Agent' : 'Client'}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                style={styles.logoutButton}
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.navLink}>
                                Connexion
                            </Link>
                            <Link to="/register" style={styles.navLink}>
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        backgroundColor: '#2c3e50',
        padding: '15px 0',
        color: 'white',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white',
        textDecoration: 'none',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginRight: '10px',
    },
    username: {
        fontWeight: 'bold',
    },
    role: {
        fontSize: '0.8rem',
        opacity: 0.8,
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    }
};

export default Navbar;
