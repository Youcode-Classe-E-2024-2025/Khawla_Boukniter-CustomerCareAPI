import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import authService from '../../services/authService';

function CreateTicket() {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser?.role === 'agent') {
            setError('Seuls les clients peuvent créer des tickets.');
        }
    }, []);

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
            await ticketService.createTicket(formData);
            navigate('/tickets');
        } catch (err) {
            setError(err.message || 'Erreur lors de la création du ticket. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <div style={styles.formHeader}>
                    <h2 style={styles.title}>Nouveau ticket</h2>
                    <div style={styles.titleAccent}></div>
                </div>

                {error && (
                    <div style={styles.errorContainer}>
                        <p style={styles.errorText}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="title" style={styles.label}>Titre</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Résumez votre problème en quelques mots"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="description" style={styles.label}>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            style={styles.textarea}
                            placeholder="Décrivez votre problème en détail"
                            rows="6"
                        />
                    </div>

                    <div style={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={() => navigate('/tickets')}
                            style={styles.cancelButton}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            style={loading ? { ...styles.submitButton, ...styles.buttonLoading } : styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Création...' : 'Créer le ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#fafafa',
        padding: '40px 20px',
    },
    formContainer: {
        width: '100%',
        maxWidth: '600px',
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
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '500',
        color: '#4a5568',
        fontFamily: "'Inter', sans-serif",
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
    textarea: {
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
        resize: 'vertical',
        minHeight: '120px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '15px',
        marginTop: '10px',
    },
    cancelButton: {
        padding: '10px 15px',
        backgroundColor: '#f7fafc',
        color: '#4a5568',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', sans-serif",
        flex: '1',
    },
    submitButton: {
        padding: '10px 15px',
        backgroundColor: '#6b46c1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', sans-serif",
        flex: '1',
    },
    buttonLoading: {
        backgroundColor: '#9f7aea',
        cursor: 'not-allowed',
    }
};

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
    input:focus, textarea:focus {
        border-color: #9f7aea;
        box-shadow: 0 0 0 1px #9f7aea;
    }
    
    ${styles.submitButton}:hover {
        background-color: #805ad5;
    }
    
    ${styles.cancelButton}:hover {
        background-color: #edf2f7;
        border-color: #cbd5e0;
    }
`;
document.head.appendChild(styleSheet);

export default CreateTicket;
