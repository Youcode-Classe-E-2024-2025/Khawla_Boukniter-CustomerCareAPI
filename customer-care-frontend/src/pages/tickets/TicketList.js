import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import authService from '../../services/authService';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        search: ''
    });

    const [isAgent, setIsAgent] = useState(false);

    const [showAssignedOnly, setShowAssignedOnly] = useState(false);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setIsAgent(currentUser?.role === 'agent');

        loadTickets();
    }, []);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const updatedFilters = { ...filters };
            if (isAgent && showAssignedOnly) {
                updatedFilters.assigned_to_me = true;
            }

            const response = await ticketService.getAllTickets(filters);
            setTickets(response.tickets.data || []);
        } catch (err) {
            setError('Erreur lors du chargement des tickets');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const applyFilters = (e) => {
        e.preventDefault();
        loadTickets();
    };

    const handleAssignTicket = async (id) => {
        try {
            await ticketService.assignTicket(id);
            loadTickets();
        } catch (err) {
            console.error('Erreur lors de l\'assignation du ticket:', err);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await ticketService.changeTicketStatus(id, newStatus);
            loadTickets();
        } catch (err) {
            console.error('Erreur lors du changement de statut:', err);
        }
    };

    const handleCancelTicket = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler ce ticket?')) {
            try {
                await ticketService.cancelTicket(id);
                loadTickets();
            } catch (err) {
                console.error('Erreur lors de l\'annulation du ticket:', err);
            }
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

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Mes tickets</h1>
                {!isAgent && (
                    <Link to="/tickets/new" style={styles.createButton}>
                        Créer un ticket
                    </Link>
                )}
            </div>

            <div style={styles.filtersContainer}>
                <form onSubmit={applyFilters} style={styles.filtersForm}>
                    <div style={styles.filterGroup}>
                        <label htmlFor="status" style={styles.filterLabel}>Statut:</label>
                        <select
                            id="status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            style={styles.filterSelect}
                        >
                            <option value="">Tous</option>
                            <option value="open">Ouvert</option>
                            <option value="in_progress">En cours</option>
                            <option value="resolved">Résolu</option>
                            <option value="closed">Fermé</option>
                            <option value="cancelled">Annulé</option>
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <label htmlFor="search" style={styles.filterLabel}>Recherche:</label>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            style={styles.filterInput}
                            placeholder="Rechercher..."
                        />
                    </div>

                    <button type="submit" style={styles.filterButton}>
                        Filtrer
                    </button>
                </form>
            </div>

            <div>
                {isAgent && (
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>
                            <input
                                type="checkbox"
                                checked={showAssignedOnly}
                                onChange={() => setShowAssignedOnly(!showAssignedOnly)}
                                style={styles.checkbox}
                            />
                            Afficher uniquement mes tickets assignés
                        </label>
                    </div>
                )}
            </div>

            {loading && <p style={styles.message}>Chargement des tickets...</p>}
            {error && <p style={styles.errorMessage}>{error}</p>}

            {!loading && !error && tickets.length === 0 && (
                <p style={styles.message}>Aucun ticket trouvé.</p>
            )}

            {!loading && !error && tickets.length > 0 && (
                <div style={styles.ticketList}>
                    {tickets.map(ticket => (
                        <div key={ticket.id} style={styles.ticketCard}>
                            <div style={styles.ticketHeader}>
                                <h3 style={styles.ticketTitle}>
                                    <Link to={`/tickets/${ticket.id}`} style={styles.ticketLink}>
                                        {ticket.title}
                                    </Link>
                                </h3>
                                <span
                                    style={{
                                        ...styles.statusBadge,
                                        backgroundColor: getStatusBadgeColor(ticket.status)
                                    }}
                                >
                                    {translateStatus(ticket.status)}
                                </span>
                            </div>

                            <p style={styles.ticketDescription}>
                                {ticket.description.length > 100
                                    ? `${ticket.description.substring(0, 100)}...`
                                    : ticket.description}
                            </p>

                            <div style={styles.ticketFooter}>
                                <div style={styles.ticketInfo}>
                                    <p style={styles.ticketInfoText}>
                                        Client: {ticket.user?.name || 'Inconnu'}
                                    </p>
                                    <p style={styles.ticketInfoText}>
                                        Agent: {ticket.agent?.name || 'Non assigné'}
                                    </p>
                                </div>

                                <div style={styles.ticketActions}>
                                    {isAgent && !ticket.agent_id && ticket.status === 'open' && (
                                        <button
                                            onClick={() => handleAssignTicket(ticket.id)}
                                            style={styles.actionButton}
                                        >
                                            Prendre en charge
                                        </button>
                                    )}

                                    {isAgent && ticket.agent_id === authService.getCurrentUser()?.id && (
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                            style={styles.statusSelect}
                                        >
                                            <option value="in_progress">En cours</option>
                                            <option value="resolved">Résolu</option>
                                            <option value="closed">Fermé</option>
                                        </select>
                                    )}

                                    {!isAgent && ticket.status === 'open' && (
                                        <button
                                            onClick={() => handleCancelTicket(ticket.id)}
                                            style={{ ...styles.actionButton, ...styles.cancelButton }}
                                        >
                                            Annuler
                                        </button>
                                    )}

                                    <Link
                                        to={`/tickets/${ticket.id}`}
                                        style={{ ...styles.actionButton, ...styles.viewButton }}
                                    >
                                        Voir détails
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        color: '#2c3e50',
        margin: 0,
    },
    createButton: {
        padding: '10px 20px',
        backgroundColor: '#2ecc71',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
    },
    filtersContainer: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    filtersForm: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'flex-end',
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '200px',
    },
    filterLabel: {
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    filterSelect: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    filterInput: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    filterButton: {
        padding: '8px 16px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        height: '35px',
    },
    message: {
        textAlign: 'center',
        padding: '20px',
        color: '#7f8c8d',
    },
    errorMessage: {
        textAlign: 'center',
        padding: '20px',
        color: '#e74c3c',
        backgroundColor: '#fadbd8',
        borderRadius: '4px',
    },
    ticketList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    ticketCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    ticketHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    ticketTitle: {
        margin: 0,
        fontSize: '1.2rem',
    },
    ticketLink: {
        color: '#2c3e50',
        textDecoration: 'none',
    },
    statusBadge: {
        padding: '5px 10px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    ticketDescription: {
        color: '#7f8c8d',
        margin: '10px 0',
    },
    ticketFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px',
        flexWrap: 'wrap',
        gap: '10px',
    },
    ticketInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    ticketInfoText: {
        margin: 0,
        fontSize: '0.9rem',
        color: '#34495e',
    },
    ticketActions: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
    },
    actionButton: {
        padding: '8px 12px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        textDecoration: 'none',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    viewButton: {
        backgroundColor: '#7f8c8d',
    },
    statusSelect: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    }
};

export default TicketList;
