import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import authService from '../../services/authService';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ status: '', search: '' });
    const [isAgent, setIsAgent] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        const user = authService.getCurrentUser();
        setIsAgent(user?.role === 'agent');
        setCurrentUser(user);
        loadTickets();
    }, [currentPage, perPage]);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const response = await ticketService.getAllTickets({ ...filters, page: currentPage, perpage: perPage });
            setTickets(response.tickets.data || []);

            setTotalPages(response.tickets.last_page || 1);
            setCurrentPage(response.tickets.current_page || 1);
        } catch (err) {
            setError('Erreur lors du chargement des tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const applyFilters = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        loadTickets();
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }

    const handleAssignTicket = async (id) => {
        try {
            await ticketService.assignTicket(id);
            loadTickets();
        } catch (err) {
            console.error('Erreur lors de l\'assignation:', err);
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
                console.error('Erreur lors de l\'annulation:', err);
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            open: '#3182ce',
            in_progress: '#dd6b20',
            resolved: '#38a169',
            closed: '#718096',
            cancelled: '#e53e3e'
        };
        return colors[status] || '#718096';
    };

    const translateStatus = (status) => {
        const translations = {
            open: 'Ouvert',
            in_progress: 'En cours',
            resolved: 'Résolu',
            closed: 'Fermé',
            cancelled: 'Annulé'
        };
        return translations[status] || status;
    };

    const renderTicketCard = (ticket) => (
        <div key={ticket.id} style={styles.ticketCard}>
            <div style={styles.ticketHeader}>
                <div style={styles.titleContainer}>
                    <Link to={`/tickets/${ticket.id}`} style={styles.ticketTitle}>
                        {ticket.title}
                    </Link>
                    <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(ticket.status)
                    }}>
                        {translateStatus(ticket.status)}
                    </span>
                </div>
            </div>

            <p style={styles.ticketDescription}>
                {ticket.description.length > 120
                    ? `${ticket.description.substring(0, 120)}...`
                    : ticket.description}
            </p>

            <div style={styles.ticketFooter}>
                <div style={styles.ticketInfo}>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Client:</span>
                        <span style={styles.infoValue}>{ticket.user?.name || 'Inconnu'}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Agent:</span>
                        <span style={styles.infoValue}>{ticket.agent?.name || 'Non assigné'}</span>
                    </div>
                </div>

                <div style={styles.ticketActions}>
                    {isAgent && !ticket.agent_id && ticket.status === 'open' && (
                        <button
                            onClick={() => handleAssignTicket(ticket.id)}
                            style={styles.assignButton}
                        >
                            Prendre en charge
                        </button>
                    )}

                    {isAgent && ticket.agent_id === currentUser?.id && (
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
                            style={styles.cancelButton}
                        >
                            Annuler
                        </button>
                    )}

                    <Link to={`/tickets/${ticket.id}`} style={styles.viewButton}>
                        Détails
                    </Link>
                </div>
            </div>
        </div>
    );

    const renderPagination = () => {
        const pages = [];

        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    style={{
                        ...styles.pageButton,
                        ...(i === currentPage ? styles.currentPageButton : {})
                    }}
                >
                    {i}
                </button>
            );
        }

        return (
            <div style={styles.pagination}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        ...styles.pageButton,
                        opacity: currentPage === 1 ? 0.5 : 1
                    }}
                >
                    &laquo; Précédent
                </button>

                {pages}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        ...styles.pageButton,
                        opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                >
                    Suivant &raquo;
                </button>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.pageTitle}>Mes tickets</h1>
                {!isAgent && (
                    <Link to="/tickets/new" style={styles.createButton}>
                        Nouveau ticket
                    </Link>
                )}
            </div>

            <div style={styles.filtersContainer}>
                <form onSubmit={applyFilters} style={styles.filtersForm}>
                    <div style={styles.filterGroup}>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            style={styles.filterSelect}
                        >
                            <option value="">Tous les statuts</option>
                            <option value="open">Ouvert</option>
                            <option value="in_progress">En cours</option>
                            <option value="resolved">Résolu</option>
                            <option value="closed">Fermé</option>
                            <option value="cancelled">Annulé</option>
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            style={styles.filterInput}
                            placeholder="Rechercher..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    applyFilters(e);
                                }
                            }}
                        />
                    </div>

                    <button type="submit" style={styles.filterButton}>
                        Filtrer
                    </button>
                </form>
            </div>

            {loading ? (
                <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                    <p style={styles.loadingText}>Chargement des tickets...</p>
                </div>
            ) : error ? (
                <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error}</p>
                </div>
            ) : tickets.length === 0 ? (
                <div style={styles.emptyContainer}>
                    <p style={styles.emptyText}>Aucun ticket trouvé</p>
                </div>
            ) : (
                <div style={styles.ticketsList}>
                    {tickets.map(ticket => renderTicketCard(ticket))}
                </div>
            )}

            {!loading && !error && tickets.length > 0 && renderPagination()}
        </div>
    );
}

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '30px 20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    pageTitle: { fontSize: '1.5rem', fontWeight: '500', color: '#2d3748', margin: 0 },
    createButton: {
        padding: '8px 16px', backgroundColor: '#6b46c1', color: 'white', borderRadius: '4px',
        fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s ease'
    },
    filtersContainer: {
        backgroundColor: 'white', borderRadius: '6px', padding: '15px',
        marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    filtersForm: { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' },
    filterGroup: { flex: '1', minWidth: '150px' },
    filterSelect: {
        width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '4px',
        fontSize: '0.9rem', color: '#4a5568', backgroundColor: '#fff', outline: 'none'
    },
    filterInput: {
        width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '4px',
        fontSize: '0.9rem', color: '#4a5568', backgroundColor: '#fff', outline: 'none'
    },
    filterButton: {
        padding: '8px 16px', backgroundColor: '#6b46c1', color: 'white', border: 'none',
        borderRadius: '4px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer'
    },
    loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 0' },
    loadingSpinner: {
        width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #6b46c1',
        borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '15px'
    },
    loadingText: { fontSize: '0.95rem', color: '#718096' },
    errorContainer: {
        backgroundColor: '#fff5f5', color: '#c53030', padding: '15px',
        borderRadius: '4px', marginBottom: '20px', textAlign: 'center'
    },
    errorText: { margin: 0, fontSize: '0.95rem' },
    emptyContainer: { backgroundColor: '#f8fafc', padding: '40px 0', textAlign: 'center', borderRadius: '6px' },
    emptyText: { color: '#718096', fontSize: '0.95rem', margin: 0 },
    ticketsList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    ticketCard: {
        backgroundColor: 'white', borderRadius: '6px', padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #edf2f7'
    },
    ticketHeader: { marginBottom: '15px' },
    titleContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    ticketTitle: { fontSize: '1.1rem', fontWeight: '500', color: '#2d3748', textDecoration: 'none' },
    statusBadge: {
        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem',
        fontWeight: '500', color: 'white'
    },
    ticketDescription: { fontSize: '0.9rem', color: '#718096', marginBottom: '15px', lineHeight: '1.5' },
    ticketFooter: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '15px', borderTop: '1px solid #edf2f7', paddingTop: '15px'
    },
    ticketInfo: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
    infoItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
    infoLabel: { fontSize: '0.75rem', color: '#718096' },
    infoValue: { fontSize: '0.85rem', color: '#4a5568', fontWeight: '500' },
    ticketActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    assignButton: {
        padding: '6px 12px', backgroundColor: '#6b46c1', color: 'white', border: 'none',
        borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer'
    },
    statusSelect: {
        padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '4px',
        fontSize: '0.8rem', color: '#4a5568', backgroundColor: '#fff', outline: 'none'
    },
    cancelButton: {
        padding: '6px 12px', backgroundColor: '#e53e3e', color: 'white', border: 'none',
        borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer'
    },
    viewButton: {
        padding: '6px 12px', backgroundColor: '#4a5568', color: 'white', border: 'none',
        borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500', textDecoration: 'none'
    },
    pagination: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px',
    },
    pageButton: {
        padding: '8px 12px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem',
    },
    currentPageButton: {
        backgroundColor: '#3498db', color: 'white', border: '1px solid #3498db',
    }
};

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    ${styles.createButton}:hover, ${styles.filterButton}:hover, ${styles.assignButton}:hover {
        background-color: #805ad5;
    }
    
    ${styles.cancelButton}:hover {
        background-color: #c53030;
    }
    
    ${styles.viewButton}:hover {
        background-color: #2d3748;
    }
    
    input:focus, select:focus {
        border-color: #9f7aea;
        box-shadow: 0 0 0 1px #9f7aea;
    }
`;
document.head.appendChild(styleSheet);

export default TicketList;
