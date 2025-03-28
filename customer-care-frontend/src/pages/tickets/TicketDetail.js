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

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'open': return '#3498db';
            case 'in_progress': return '#f39c12';
            case 'resolved': return '#2ecc71';
            case 'closed': return '#7f8c8d';
            case 'cancelled': return '#e74c3c';
            default: return '#95a5a6';
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
        return <div style={styles.loadingContainer}>Chargement des données...</div>;
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <p>{error}</p>
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
            <div style={styles.errorContainer}>
                <p>Ticket non trouvé</p>
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
                <div style={styles.headerLeft}>
                    <button
                        onClick={() => navigate('/tickets')}
                        style={styles.backButton}
                    >
                        &larr; Retour
                    </button>
                    <h1 style={styles.title}>{ticket.title}</h1>
                </div>
                <span
                    style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusBadgeColor(ticket.status)
                    }}
                >
                    {translateStatus(ticket.status)}
                </span>
            </div>

            <div style={styles.ticketInfo}>
                <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Client:</span>
                    <span>{ticket.user?.name || 'Inconnu'}</span>
                </div>
                <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Agent:</span>
                    <span>{ticket.agent?.name || 'Non assigné'}</span>
                </div>
                <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Créé le:</span>
                    <span>{formatDate(ticket.created_at)}</span>
                </div>
                {ticket.resolved_at && (
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Résolu le:</span>
                        <span>{formatDate(ticket.resolved_at)}</span>
                    </div>
                )}
            </div>

            <div style={styles.descriptionContainer}>
                <h3 style={styles.sectionTitle}>Description</h3>
                <p style={styles.description}>{ticket.description}</p>
            </div>

            <div style={styles.actionsContainer}>
                {isAgent && !ticket.agent_id && ticket.status === 'open' && (
                    <button
                        onClick={handleAssignTicket}
                        style={styles.actionButton}
                    >
                        Prendre en charge
                    </button>
                )}

                {isAgent && ticket.agent_id === currentUser?.id && ticket.status !== 'cancelled' && (
                    <div style={styles.statusActions}>
                        <span style={styles.statusLabel}>Changer le statut:</span>
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
                        style={{ ...styles.actionButton, ...styles.cancelButton }}
                    >
                        Annuler le ticket
                    </button>
                )}
            </div>

            <div style={styles.responsesContainer}>
                <h3 style={styles.sectionTitle}>Réponses</h3>

                {responses.length === 0 ? (
                    <p style={styles.noResponses}>Aucune réponse pour le moment.</p>
                ) : (
                    <div style={styles.responsesList}>
                        {responses.map(response => (
                            <div key={response.id} style={styles.responseItem}>
                                <div style={styles.responseHeader}>
                                    <div style={styles.responseUser}>
                                        <strong>{response.user?.name || 'Utilisateur'}</strong>
                                        <span style={styles.responseRole}>
                                            {response.user?.role === 'agent' ? '(Agent)' : '(Client)'}
                                        </span>
                                    </div>
                                    <div style={styles.responseDate}>
                                        {formatDate(response.created_at)}
                                    </div>
                                </div>

                                <div style={styles.responseContent}>
                                    {response.content}
                                </div>

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
            </div>

            {ticket.status !== 'cancelled' && ticket.status !== 'closed' && (
                <div style={styles.replyContainer}>
                    <h3 style={styles.sectionTitle}>Ajouter une réponse</h3>

                    {responseError && (
                        <div style={styles.responseError}>{responseError}</div>
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
                            style={styles.replyButton}
                            disabled={submitting}
                        >
                            {submitting ? 'Envoi en cours...' : 'Envoyer la réponse'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
        color: '#7f8c8d',
    },
    errorContainer: {
        textAlign: 'center',
        padding: '50px',
        color: '#e74c3c',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    backButton: {
        padding: '8px 15px',
        backgroundColor: '#7f8c8d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    title: {
        margin: 0,
        color: '#2c3e50',
        fontSize: '1.8rem',
    },
    statusBadge: {
        padding: '5px 15px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.9rem',
        fontWeight: 'bold',
    },
    ticketInfo: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    infoItem: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '150px',
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#7f8c8d',
        fontSize: '0.9rem',
        marginBottom: '5px',
    },
    descriptionContainer: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
    },
    sectionTitle: {
        color: '#2c3e50',
        marginTop: 0,
        marginBottom: '15px',
        fontSize: '1.3rem',
    },
    description: {
        margin: 0,
        lineHeight: '1.6',
        color: '#34495e',
        whiteSpace: 'pre-wrap',
    },
    actionsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        marginBottom: '30px',
    },
    actionButton: {
        padding: '8px 15px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    statusActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    statusLabel: {
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    statusSelect: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    responsesContainer: {
        marginBottom: '30px',
    },
    noResponses: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#7f8c8d',
    },
    responsesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    responseItem: {
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    responseHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
    },
    responseUser: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    responseRole: {
        fontSize: '0.8rem',
        color: '#7f8c8d',
    },
    responseDate: {
        fontSize: '0.8rem',
        color: '#7f8c8d',
    },
    responseContent: {
        lineHeight: '1.5',
        color: '#34495e',
        whiteSpace: 'pre-wrap',
    },
    responseActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '10px',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    replyContainer: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
    },
    responseError: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
    },
    replyForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    replyTextarea: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px',
        resize: 'vertical',
    },
    replyButton: {
        padding: '10px',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        alignSelf: 'flex-end',
    }
};

export default TicketDetail;

