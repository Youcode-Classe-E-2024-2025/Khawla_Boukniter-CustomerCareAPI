import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(formData);
            navigate('/tickets');
        } catch (error) {
            setError(error.message || 'Échec de connexion. Veuillez vérifier vos identifiants.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <div style={styles.formHeader}>
                    <h2 style={styles.title}>Connexion</h2>
                    <div style={styles.titleAccent}></div>
                </div>

                {error && (
                    <div style={styles.errorContainer}>
                        <p style={styles.errorText}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Email"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Mot de passe"
                        />
                    </div>

                    <button
                        type="submit"
                        style={loading ? { ...styles.button, ...styles.buttonLoading } : styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div style={styles.registerLinkContainer}>
                    <p style={styles.registerText}>
                        Pas encore de compte ? <Link to="/register" style={styles.registerLink}>S'inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#fafafa',
        padding: '20px',
    },
    formContainer: {
        width: '100%',
        maxWidth: '360px',
        padding: '35px 30px',
        backgroundColor: 'white',
        borderRadius: '6px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
    },
    formHeader: {
        marginBottom: '30px',
        textAlign: 'center',
        position: 'relative',
    },
    title: {
        fontSize: '1.4rem',
        fontWeight: '500',
        color: '#333',
        marginBottom: '8px',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '-0.01em',
    },
    titleAccent: {
        width: '30px',
        height: '3px',
        backgroundColor: '#6b46c1',
        margin: '0 auto',
        borderRadius: '2px',
    },
    errorContainer: {
        backgroundColor: '#fff5f5',
        color: '#c53030',
        padding: '10px 12px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '0.85rem',
        border: '1px solid #fed7d7',
    },
    errorText: {
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        fontSize: '0.9rem',
        color: '#2d3748',
        backgroundColor: '#fff',
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
    },
    button: {
        padding: '10px 12px',
        backgroundColor: '#6b46c1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginTop: '5px',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '0.01em',
    },
    buttonLoading: {
        backgroundColor: '#9f7aea',
        cursor: 'not-allowed',
    },
    registerLinkContainer: {
        textAlign: 'center',
        marginTop: '25px',
        padding: '15px 0 0',
        borderTop: '1px solid #f0f0f0',
    },
    registerText: {
        fontSize: '0.85rem',
        color: '#718096',
        margin: 0,
    },
    registerLink: {
        color: '#6b46c1',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s ease',
    }
};

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
    input:focus {
        border-color: #9f7aea;
        box-shadow: 0 0 0 1px #9f7aea;
    }
    
    button:hover {
        background-color: #805ad5;
    }
    
    a:hover {
        color: #805ad5;
    }
`;
document.head.appendChild(styleSheet);

export default Login;
