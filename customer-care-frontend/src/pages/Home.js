// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

function Home() {
    const isLoggedIn = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>Bienvenue sur Customer Care</h1>
                <p style={styles.subtitle}>
                    Plateforme de gestion de tickets de support client
                </p>

                {isLoggedIn ? (
                    <div style={styles.actionContainer}>
                        <p style={styles.welcomeMessage}>
                            Bonjour, {currentUser?.name || 'Utilisateur'} !
                        </p>
                        <p>
                            {currentUser?.role === 'agent'
                                ? 'Vous êtes connecté en tant qu\'agent de support.'
                                : 'Vous êtes connecté en tant que client.'}
                        </p>
                        <Link to="/tickets" style={styles.button}>
                            Voir mes tickets
                        </Link>
                    </div>
                ) : (
                    <div style={styles.actionContainer}>
                        <p style={styles.message}>
                            Connectez-vous pour accéder à vos tickets ou créez un compte.
                        </p>
                        <div style={styles.buttonContainer}>
                            <Link to="/login" style={styles.button}>
                                Se connecter
                            </Link>
                            <Link to="/register" style={{ ...styles.button, ...styles.registerButton }}>
                                S'inscrire
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
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    content: {
        textAlign: 'center',
        maxWidth: '800px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2c3e50',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#7f8c8d',
        marginBottom: '30px',
    },
    actionContainer: {
        marginTop: '30px',
    },
    welcomeMessage: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    message: {
        marginBottom: '20px',
        fontSize: '1.1rem',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
    },
    button: {
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#3498db',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    registerButton: {
        backgroundColor: '#2ecc71',
    }
};

export default Home;
