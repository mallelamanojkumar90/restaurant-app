import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function StaffLogin() {
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({ username: '', password: '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        // For now, just navigate to staff panel (we'll add real auth later)
        if (credentials.username && credentials.password) {
            navigate('/staff/panel')
        }
    }

    return (
        <div className="app-container">
            <header style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 className="title-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>Antigravity Restaurant</h1>
                    </Link>
                    <Link to="/" className="btn btn-outline">Back to Home</Link>
                </div>
            </header>

            <main className="container" style={{ padding: '2rem 1rem', maxWidth: '500px' }}>
                <div className="card animate-fade-in" style={{ marginTop: '3rem' }}>
                    <h2 style={{ marginTop: 0, textAlign: 'center' }}>Staff Login</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                Username
                            </label>
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                                placeholder="Enter your password"
                            />
                        </div>

                        <button type="submit" className="btn" style={{ width: '100%' }}>
                            Login
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Demo: Use any username/password to login
                    </p>
                </div>
            </main>
        </div>
    )
}

export default StaffLogin
