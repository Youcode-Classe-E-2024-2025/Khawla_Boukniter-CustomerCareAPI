import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

function Home() {
    const isLoggedIn = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>Customer Care</h1>
                <div style={styles.titleAccent}></div>

                <p style={styles.subtitle}>
                    Une plateforme simple et efficace pour gérer vos demandes de support
                </p>

                {isLoggedIn ? (
                    <div style={styles.userSection}>
                        <p style={styles.welcomeMessage}>
                            Bienvenue, <span style={styles.userName}>{currentUser?.name || 'Utilisateur'}</span>
                        </p>

                        <p style={styles.roleInfo}>
                            {currentUser?.role === 'agent'
                                ? 'Vous êtes connecté en tant qu\'agent de support'
                                : 'Vous êtes connecté en tant que client'}
                        </p>

                        <Link to="/tickets" style={styles.primaryButton}>
                            Accéder à mes tickets
                        </Link>
                    </div>
                ) : (
                    <div style={styles.authSection}>
                        <div style={styles.featureGrid}>
                            <div style={styles.featureCard}>
                                <h3 style={styles.featureTitle}>Suivi simplifié</h3>
                                <p style={styles.featureText}>
                                    Suivez l'état de vos demandes en temps réel
                                </p>
                            </div>

                            <div style={styles.featureCard}>
                                <h3 style={styles.featureTitle}>Communication directe</h3>
                                <p style={styles.featureText}>
                                    Échangez facilement avec notre équipe de support
                                </p>
                            </div>

                            <div style={styles.featureCard}>
                                <h3 style={styles.featureTitle}>Résolution rapide</h3>
                                <p style={styles.featureText}>
                                    Obtenez des solutions efficaces à vos problèmes
                                </p>
                            </div>
                        </div>

                        <div style={styles.ctaSection}>
                            <Link to="/login" style={styles.primaryButton}>
                                Se connecter
                            </Link>
                            <Link to="/register" style={styles.secondaryButton}>
                                Créer un compte
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#fafafa',
        padding: '20px',
    },
    content: {
        textAlign: 'center',
        maxWidth: '800px',
        padding: '40px 30px',
        backgroundColor: 'white',
        borderRadius: '6px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
    },
    title: {
        fontSize: '2.2rem',
        fontWeight: '500',
        color: '#333',
        marginBottom: '8px',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '-0.02em',
    },
    titleAccent: {
        width: '40px',
        height: '3px',
        backgroundColor: '#6b46c1',
        margin: '0 auto 25px',
        borderRadius: '2px',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#718096',
        marginBottom: '40px',
        maxWidth: '500px',
        margin: '0 auto 40px',
        lineHeight: '1.6',
        fontWeight: '400',
    },
    userSection: {
        backgroundColor: '#f8f9fa',
        padding: '25px',
        borderRadius: '6px',
        marginTop: '30px',
    },
    welcomeMessage: {
        fontSize: '1.1rem',
        color: '#4a5568',
        marginBottom: '5px',
    },
    userName: {
        fontWeight: '600',
        color: '#2d3748',
    },
    roleInfo: {
        fontSize: '0.9rem',
        color: '#718096',
        marginBottom: '20px',
    },
    authSection: {
        marginTop: '30px',
    },
    featureGrid: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '35px',
        flexWrap: 'wrap',
    },
    featureCard: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '6px',
        width: '220px',
        transition: 'transform 0.2s ease',
    },
    featureTitle: {
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '8px',
    },
    featureText: {
        fontSize: '0.85rem',
        color: '#718096',
        lineHeight: '1.5',
    },
    ctaSection: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '10px',
    },
    primaryButton: {
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#6b46c1',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        border: 'none',
    },
    secondaryButton: {
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: 'white',
        color: '#6b46c1',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        border: '1px solid #6b46c1',
    }
};

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
    ${styles.primaryButton}:hover {
        background-color: #805ad5;
    }
    
    ${styles.secondaryButton}:hover {
        background-color: #f8f4ff;
    }
    
    ${styles.featureCard}:hover {
        transform: translateY(-3px);
    }
`;
document.head.appendChild(styleSheet);

export default Home;
