import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

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

                            <div style={styles.userInfo}>
                                <div style={styles.avatar}>
                                    {currentUser?.name?.charAt(0) || 'U'}
                                </div>
                                <div style={styles.userText}>
                                    <span style={styles.username}>{currentUser?.name}</span>
                                    <span style={styles.role}>
                                        {currentUser?.role === 'agent' ? 'Agent' : 'Client'}
                                    </span>
                                </div>
                            </div>

                            <button onClick={handleLogout} style={styles.logoutButton}>
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.navLink}>
                                Connexion
                            </Link>
                            <Link to="/register" style={styles.registerLink}>
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
        backgroundColor: '#ffffff',
        padding: '12px 0',
        color: '#333',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        borderBottom: '1px solid #f0f0f0',
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
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#4a6fa5',
        textDecoration: 'none',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    navLink: {
        color: '#555',
        textDecoration: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    registerLink: {
        color: 'white',
        textDecoration: 'none',
        padding: '6px 14px',
        borderRadius: '4px',
        backgroundColor: '#4a6fa5',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#4a6fa5',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    },
    userText: {
        display: 'flex',
        flexDirection: 'column',
    },
    username: {
        fontWeight: 'bold',
        fontSize: '0.9rem',
        color: '#333',
    },
    role: {
        fontSize: '0.75rem',
        color: '#777',
    },
    logoutButton: {
        backgroundColor: '#f8f9fa',
        color: '#dc3545',
        border: '1px solid #dc3545',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '500',
    }
};

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
    ${styles.navLink}:hover {
        background-color: #f8f9fa;
        color: #4a6fa5;
    }
    
    ${styles.registerLink}:hover {
        background-color: #3a5a8c;
    }
    
    ${styles.logoutButton}:hover {
        background-color: #dc3545;
        color: white;
    }
    
    @media (max-width: 768px) {
        ${styles.navLinks} {
            gap: 10px;
        }
        
        ${styles.userInfo} {
            display: none;
        }
    }
`;
document.head.appendChild(styleSheet);

export default Navbar;
