import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000'

function Home() {
    const [stats, setStats] = useState({
        availableTables: 0,
        totalTables: 0,
        queueLength: 0,
        avgWaitTime: 0
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [tablesRes, queueRes] = await Promise.all([
                    fetch(`${API_BASE}/api/tables`),
                    fetch(`${API_BASE}/api/queue`)
                ])

                const tables = await tablesRes.json()
                const queue = await queueRes.json()

                const available = tables.filter(t => t.status === 'available').length
                const avgWait = queue.length > 0
                    ? Math.round(queue.reduce((sum, q) => sum + q.estimated_wait_time, 0) / queue.length)
                    : 0

                setStats({
                    availableTables: available,
                    totalTables: tables.length,
                    queueLength: queue.length,
                    avgWaitTime: avgWait
                })
            } catch (err) {
                console.error('Error fetching stats:', err)
            }
        }

        fetchStats()
        const interval = setInterval(fetchStats, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="app-container">
            <main className="container" style={{ padding: '2rem 1rem' }}>
                <section className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Smart Table Management</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Autonomous agent-driven queue and table tracking system.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/dashboard" className="btn">View Dashboard</Link>
                        <Link to="/staff" className="btn btn-outline">Staff Login</Link>
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {/* Live Stats */}
                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>Available Tables</h3>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>
                            {stats.availableTables}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/{stats.totalTables}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>Updated live</p>
                    </div>

                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>Current Wait Time</h3>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                            {stats.avgWaitTime}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>min</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>Queue: {stats.queueLength} groups</p>
                    </div>

                    <div className="card">
                        <h3 style={{ marginTop: 0 }}>System Status</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <span className="status-badge status-available">🤖 Agents Active</span>
                            <span className="status-badge status-reserved">📡 Live Sync</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home
