import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client'
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
            await authService.register(formData);
            navigate('/login');
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <div style={styles.formHeader}>
                    <h2 style={styles.title}>Inscription</h2>
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
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Nom complet"
                        />
                    </div>

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
                            minLength="8"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={styles.select}
                        >
                            <option value="client">Client</option>
                            <option value="agent">Agent</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        style={loading ? { ...styles.button, ...styles.buttonLoading } : styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Inscription...' : 'S\'inscrire'}
                    </button>
                </form>

                <div style={styles.loginLinkContainer}>
                    <p style={styles.loginText}>
                        Déjà inscrit ? <Link to="/login" style={styles.loginLink}>Se connecter</Link>
                    </p>
                </div>
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
    select: {
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
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '30px',
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
    loginLinkContainer: {
        textAlign: 'center',
        marginTop: '25px',
        padding: '15px 0 0',
        borderTop: '1px solid #f0f0f0',
    },
    loginText: {
        fontSize: '0.85rem',
        color: '#718096',
        margin: 0,
    },
    loginLink: {
        color: '#6b46c1',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s ease',
    }
};

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
    input:focus, select:focus {
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

export default Register;
