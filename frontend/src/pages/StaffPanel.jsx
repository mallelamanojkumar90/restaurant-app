import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000'

function StaffPanel() {
    const [tables, setTables] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)

    const fetchTables = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/tables`)
            const data = await res.json()
            setTables(data)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching tables:', err)
        }
    }

    useEffect(() => {
        fetchTables()
        // Refresh every 3 seconds
        const interval = setInterval(fetchTables, 3000)
        return () => clearInterval(interval)
    }, [])

    const updateTableStatus = async (tableId, newStatus) => {
        setUpdating(tableId)
        try {
            const res = await fetch(`${API_BASE}/api/tables/${tableId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (res.ok) {
                // Fetch updated data
                await fetchTables()

                // Trigger agent orchestration
                await fetch(`${API_BASE}/api/agents/run`, { method: 'POST' })
            }
        } catch (err) {
            console.error('Error updating table:', err)
        } finally {
            setUpdating(null)
        }
    }

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
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
                        <h1 className="title-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>Antigravity Restaurant - Staff Panel</h1>
                    </Link>
                    <Link to="/staff" className="btn btn-outline">Logout</Link>
                </div>
            </header>

            <main className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', margin: 0 }}>Table Management (Live)</h2>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        🤖 Agents auto-run on every update
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {tables.map(table => (
                        <div key={table.id} className="card" style={{ opacity: updating === table.id ? 0.6 : 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{table.number}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Capacity: {table.capacity}</div>
                                </div>
                                <span className={`status-badge status-${table.status}`}>
                                    {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button
                                    onClick={() => updateTableStatus(table.id, 'available')}
                                    disabled={updating === table.id}
                                    className="btn"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        fontSize: '0.875rem',
                                        background: table.status === 'available' ? 'var(--success)' : 'transparent',
                                        border: '1px solid var(--success)',
                                        color: table.status === 'available' ? 'white' : 'var(--success)',
                                        cursor: updating === table.id ? 'wait' : 'pointer'
                                    }}
                                >
                                    {table.status === 'available' ? '✓ Available' : 'Set Available'}
                                </button>
                                <button
                                    onClick={() => updateTableStatus(table.id, 'occupied')}
                                    disabled={updating === table.id}
                                    className="btn"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        fontSize: '0.875rem',
                                        background: table.status === 'occupied' ? 'var(--danger)' : 'transparent',
                                        border: '1px solid var(--danger)',
                                        color: table.status === 'occupied' ? 'white' : 'var(--danger)',
                                        cursor: updating === table.id ? 'wait' : 'pointer'
                                    }}
                                >
                                    {table.status === 'occupied' ? '✓ Occupied' : 'Set Occupied'}
                                </button>
                                <button
                                    onClick={() => updateTableStatus(table.id, 'reserved')}
                                    disabled={updating === table.id}
                                    className="btn"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        fontSize: '0.875rem',
                                        background: table.status === 'reserved' ? 'var(--warning)' : 'transparent',
                                        border: '1px solid var(--warning)',
                                        color: table.status === 'reserved' ? 'white' : 'var(--warning)',
                                        cursor: updating === table.id ? 'wait' : 'pointer'
                                    }}
                                >
                                    {table.status === 'reserved' ? '✓ Reserved' : 'Set Reserved'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default StaffPanel
