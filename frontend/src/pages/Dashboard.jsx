import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000'

function Dashboard() {
    const [tables, setTables] = useState([])
    const [queue, setQueue] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            const [tablesRes, queueRes] = await Promise.all([
                fetch(`${API_BASE}/api/tables`),
                fetch(`${API_BASE}/api/queue`)
            ])

            if (!tablesRes.ok || !queueRes.ok) {
                throw new Error('Failed to fetch data')
            }

            const tablesData = await tablesRes.json()
            const queueData = await queueRes.json()

            setTables(tablesData)
            setQueue(queueData)
            setError(null)
        } catch (err) {
            setError(err.message)
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        // Refresh data every 5 seconds
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, [])

    if (loading && tables.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: 'var(--danger)' }}>Error: {error}</div>
                <button className="btn" onClick={fetchData}>Retry</button>
            </div>
        )
    }

    return (
        <div className="app-container">
            <header style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 className="title-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>Antigravity Restaurant</h1>
                    </Link>
                    <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn btn-outline" onClick={fetchData} style={{ padding: '0.5rem 1rem' }}>
                            🔄 Refresh
                        </button>
                        <Link to="/dashboard" className="btn">Dashboard</Link>
                        <Link to="/staff" className="btn btn-outline">Staff Login</Link>
                    </nav>
                </div>
            </header>

            <main className="container" style={{ padding: '2rem 1rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Customer Dashboard</h2>

                {/* Table Grid */}
                <section style={{ marginBottom: '3rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Table Availability (Live)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                        {tables.map(table => (
                            <div key={table.id} className="card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{table.number}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    Seats: {table.capacity}
                                </div>
                                <span className={`status-badge status-${table.status}`}>
                                    {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Queue */}
                <section>
                    <h3 style={{ marginBottom: '1rem' }}>Current Queue ({queue.length} waiting)</h3>
                    {queue.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No customers in queue
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {queue.map(customer => (
                                <div key={customer.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>#{customer.position} - {customer.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Party of {customer.party_size}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{customer.estimated_wait_time} min</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. wait (by ETA Agent)</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default Dashboard
