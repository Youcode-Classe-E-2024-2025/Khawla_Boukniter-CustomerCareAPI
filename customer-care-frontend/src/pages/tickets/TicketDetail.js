import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import responseService from '../../services/responseService';
import authService from '../../services/authService';

function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [responses, setResponses] = useState([]);
    const [newResponse, setNewResponse] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [responseError, setResponseError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [isAgent, setIsAgent] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = authService.getCurrentUser();
        setIsAgent(user?.role === 'agent');
        setCurrentUser(user);

        loadTicketData();
    }, [id]);

    const loadTicketData = async () => {
        setLoading(true);
        setError('');

        try {
            const ticketResponse = await ticketService.getTicket(id);
            setTicket(ticketResponse.ticket);

            const responsesResponse = await responseService.getTicketResponses(id);
            setResponses(responsesResponse.responses || []);
        } catch (err) {
            setError('Erreur lors du chargement des données du ticket');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResponseChange = (e) => {
        setNewResponse(e.target.value);
    };

    const handleSubmitResponse = async (e) => {
        e.preventDefault();

        if (!newResponse.trim()) {
            setResponseError('La réponse ne peut pas être vide');
            return;
        }

        setResponseError('');
        setSubmitting(true);

        try {
            await responseService.createResponse(id, newResponse);
            setNewResponse('');
            loadTicketData();
        } catch (err) {
            setResponseError('Erreur lors de l\'envoi de la réponse');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAssignTicket = async () => {
        try {
            await ticketService.assignTicket(id);
            loadTicketData();
        } catch (err) {
            console.error('Erreur lors de l\'assignation du ticket:', err);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await ticketService.changeTicketStatus(id, newStatus);
            loadTicketData();
        } catch (err) {
            console.error('Erreur lors du changement de statut:', err);
        }
    };

    const handleCancelTicket = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler ce ticket?')) {
            try {
                await ticketService.cancelTicket(id);
                loadTicketData();
            } catch (err) {
                console.error('Erreur lors de l\'annulation du ticket:', err);
            }
        }
    };

    const handleDeleteResponse = async (responseId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réponse?')) {
            try {
                await responseService.deleteResponse(responseId);
                loadTicketData();
            } catch (err) {
                console.error('Erreur lors de la suppression de la réponse:', err);
            }
        }
    };

    const translateStatus = (status) => {
        switch (status) {
            case 'open': return 'Ouvert';
            case 'in_progress': return 'En cours';
            case 'resolved': return 'Résolu';
            case 'closed': return 'Fermé';
            case 'cancelled': return 'Annulé';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return '#3182ce';
            case 'in_progress': return '#dd6b20';
            case 'resolved': return '#38a169';
            case 'closed': return '#718096';
            case 'cancelled': return '#e53e3e';
            default: return '#718096';
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Chargement du ticket...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorPage}>
                <div style={styles.errorIcon}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 style={styles.errorTitle}>{error}</h3>
                <button
                    onClick={() => navigate('/tickets')}
                    style={styles.backButton}
                >
                    Retour à la liste des tickets
                </button>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div style={styles.errorPage}>
                <div style={styles.errorIcon}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 style={styles.errorTitle}>Ticket non trouvé</h3>
                <button
                    onClick={() => navigate('/tickets')}
                    style={styles.backButton}
                >
                    Retour à la liste des tickets
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button
                    onClick={() => navigate('/tickets')}
                    style={styles.backLink}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Retour
                </button>

                <div style={styles.ticketStatus}>
                    <span
                        style={{
                            ...styles.statusBadge,
                            backgroundColor: getStatusColor(ticket.status)
                        }}
                    >
                        {translateStatus(ticket.status)}
                    </span>
                </div>
            </div>

            <div style={styles.ticketCard}>
                <h1 style={styles.ticketTitle}>{ticket.title}</h1>

                <div style={styles.ticketMeta}>
                    <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Client</span>
                        <span style={styles.metaValue}>{ticket.user?.name || 'Inconnu'}</span>
                    </div>

                    <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Agent</span>
                        <span style={styles.metaValue}>{ticket.agent?.name || 'Non assigné'}</span>
                    </div>

                    <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Créé le</span>
                        <span style={styles.metaValue}>{formatDate(ticket.created_at)}</span>
                    </div>

                    {ticket.resolved_at && (
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Résolu le</span>
                            <span style={styles.metaValue}>{formatDate(ticket.resolved_at)}</span>
                        </div>
                    )}
                </div>

                <div style={styles.ticketDescription}>
                    <h3 style={styles.sectionTitle}>Description</h3>
                    <p style={styles.descriptionText}>{ticket.description}</p>
                </div>

                <div style={styles.ticketActions}>
                    {isAgent && !ticket.agent_id && ticket.status === 'open' && (
                        <button
                            onClick={handleAssignTicket}
                            style={styles.assignButton}
                        >
                            Prendre en charge
                        </button>
                    )}

                    {isAgent && ticket.agent_id === currentUser?.id && ticket.status !== 'cancelled' && (
                        <div style={styles.statusActions}>
                            <span style={styles.statusLabel}>Statut:</span>
                            <select
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                style={styles.statusSelect}
                            >
                                <option value="in_progress">En cours</option>
                                <option value="resolved">Résolu</option>
                                <option value="closed">Fermé</option>
                            </select>
                        </div>
                    )}

                    {!isAgent && ticket.status === 'open' && (
                        <button
                            onClick={handleCancelTicket}
                            style={styles.cancelButton}
                        >
                            Annuler le ticket
                        </button>
                    )}
                </div>
            </div>

            <div style={styles.responsesSection}>
                <h3 style={styles.sectionTitle}>Réponses</h3>

                {responses.length === 0 ? (
                    <div style={styles.noResponses}>
                        <p style={styles.noResponsesText}>Aucune réponse pour le moment</p>
                    </div>
                ) : (
                    <div style={styles.responsesList}>
                        {responses.map(response => (
                            <div key={response.id} style={styles.responseCard}>
                                <div style={styles.responseHeader}>
                                    <div style={styles.responseUser}>
                                        <span style={styles.userName}>{response.user?.name || 'Utilisateur'}</span>
                                        <span style={styles.userRole}>
                                            {response.user?.role === 'agent' ? 'Agent' : 'Client'}
                                        </span>
                                    </div>
                                    <span style={styles.responseDate}>{formatDate(response.created_at)}</span>
                                </div>

                                <p style={styles.responseContent}>{response.content}</p>

                                {(currentUser?.id === response.user_id || isAgent) && (
                                    <div style={styles.responseActions}>
                                        <button
                                            onClick={() => handleDeleteResponse(response.id)}
                                            style={styles.deleteButton}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {ticket.status !== 'cancelled' && ticket.status !== 'closed' && (
                    <div style={styles.replySection}>
                        <h3 style={styles.replyTitle}>Ajouter une réponse</h3>

                        {responseError && (
                            <div style={styles.responseError}>
                                <p style={styles.responseErrorText}>{responseError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmitResponse} style={styles.replyForm}>
                            <textarea
                                value={newResponse}
                                onChange={handleResponseChange}
                                style={styles.replyTextarea}
                                placeholder="Écrivez votre réponse ici..."
                                rows="4"
                                required
                            />

                            <button
                                type="submit"
                                style={submitting ? { ...styles.replyButton, ...styles.buttonLoading } : styles.replyButton}
                                disabled={submitting}
                            >
                                {submitting ? 'Envoi...' : 'Envoyer'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '30px 20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    backLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#4a5568',
        backgroundColor: 'transparent',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', sans-serif",
    },
    ticketStatus: {
        display: 'flex',
        alignItems: 'center',
    },
    statusBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '500',
        color: 'white',
    },
    ticketCard: {
        backgroundColor: 'white',
        borderRadius: '6px',
        padding: '25px',
        marginBottom: '25px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
    },
    ticketTitle: {
        fontSize: '1.5rem',
        fontWeight: '500',
        color: '#2d3748',
        marginBottom: '20px',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '-0.01em',
    },
    ticketMeta: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '4px',
        marginBottom: '25px',
    },
    metaItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minWidth: '120px',
    },
    metaLabel: {
        fontSize: '0.8rem',
        color: '#718096',
        fontWeight: '500',
    },
    metaValue: {
        fontSize: '0.9rem',
        color: '#2d3748',
        fontWeight: '500',
    },
    ticketDescription: {
        marginBottom: '25px',
    },
    sectionTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '12px',
        fontFamily: "'Inter', sans-serif",
    },
    descriptionText: {
        fontSize: '0.95rem',
        color: '#4a5568',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
    },
    ticketActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        borderTop: '1px solid #edf2f7',
        paddingTop: '20px',
    },
    assignButton: {
        padding: '8px 16px',
        backgroundColor: '#6b46c1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.85rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    statusActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    statusLabel: {
        fontSize: '0.85rem',
        color: '#4a5568',
        fontWeight: '500',
    },
    statusSelect: {
        padding: '8px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        fontSize: '0.85rem',
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
    cancelButton: {
        padding: '8px 16px',
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.85rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    responsesSection: {
        backgroundColor: 'white',
        borderRadius: '6px',
        padding: '25px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
    },
    noResponses: {
        padding: '30px 0',
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '4px',
    },
    noResponsesText: {
        fontSize: '0.95rem',
        color: '#718096',
        margin: 0,
    },
    responsesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '30px',
    },
    responseCard: {
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '4px',
        border: '1px solid #edf2f7',
    },
    responseHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    responseUser: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    userName: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#2d3748',
    },
    userRole: {
        fontSize: '0.75rem',
        color: '#718096',
        backgroundColor: '#edf2f7',
        padding: '2px 6px',
        borderRadius: '10px',
    },
    responseDate: {
        fontSize: '0.75rem',
        color: '#718096',
    },
    responseContent: {
        fontSize: '0.95rem',
        color: '#4a5568',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        margin: '0 0 10px 0',
    },
    responseActions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    deleteButton: {
        padding: '4px 8px',
        backgroundColor: 'transparent',
        color: '#e53e3e',
        border: '1px solid #e53e3e',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    replySection: {
        marginTop: '30px',
        borderTop: '1px solid #edf2f7',
        paddingTop: '20px',
    },
    replyTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '15px',
        fontFamily: "'Inter', sans-serif",
    },
    responseError: {
        backgroundColor: '#fff5f5',
        color: '#c53030',
        padding: '10px 12px',
        borderRadius: '4px',
        marginBottom: '15px',
        fontSize: '0.85rem',
        border: '1px solid #fed7d7',
    },
    responseErrorText: {
        margin: 0,
    },
    replyForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    replyTextarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        fontSize: '0.95rem',
        color: '#2d3748',
        backgroundColor: '#fff',
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
        resize: 'vertical',
        minHeight: '100px',
    },
    replyButton: {
        padding: '10px 20px',
        backgroundColor: '#6b46c1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        alignSelf: 'flex-end',
    },
    buttonLoading: {
        backgroundColor: '#9f7aea',
        cursor: 'not-allowed',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
    },
    loadingSpinner: {
        width: '40px',
        height: '40px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #6b46c1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '15px',
    },
    loadingText: {
        fontSize: '0.95rem',
        color: '#718096',
    },
    errorPage: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        padding: '20px',
        textAlign: 'center',
    },
    errorIcon: {
        color: '#e53e3e',
        marginBottom: '15px',
    },
    errorTitle: {
        fontSize: '1.1rem',
        color: '#2d3748',
        marginBottom: '20px',
        fontWeight: '500',
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#6b46c1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    }
};

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    ${styles.backLink}:hover {
        background-color: #edf2f7;
    }
    
    ${styles.assignButton}:hover {
        background-color: #805ad5;
    }
    
    ${styles.cancelButton}:hover {
        background-color: #c53030;
    }
    
    ${styles.deleteButton}:hover {
        background-color: #fff5f5;
    }
    
    ${styles.replyButton}:hover {
        background-color: #805ad5;
    }
    
    ${styles.backButton}:hover {
        background-color: #805ad5;
    }
    
    textarea:focus, select:focus {
        border-color: #9f7aea;
        box-shadow: 0 0 0 1px #9f7aea;
    }
`;
document.head.appendChild(styleSheet);

export default TicketDetail;
