// src/components/common/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

function Navbar() {
    const isLoggedIn = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout()
            .then(() => {
                window.location.href = '/login';
            })
            .catch(error => {
                console.error('Erreur lors de la déconnexion:', error);
            });
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>
                <Link to="/" style={styles.link}>Customer Care</Link>
            </div>

            <div style={styles.links}>
                {isLoggedIn ? (
                    <>
                        <Link to="/tickets" style={styles.link}>Mes tickets</Link>
                        <span style={styles.username}>
                            Bonjour, {currentUser?.name || 'Utilisateur'}
                        </span>
                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Connexion</Link>
                        <Link to="/register" style={styles.link}>Inscription</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#2c3e50',
        color: 'white',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
    },
    username: {
        marginRight: '10px',
    },
    logoutButton: {
        padding: '5px 10px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    }
};

export default Navbar;
