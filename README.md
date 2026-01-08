# Antigravity – Smart Restaurant Table Availability & Queue Management App

A modern, agent-driven web application that autonomously manages restaurant table availability and customer waiting queues, reducing customer waiting time and improving restaurant operational efficiency.

## 🌟 Features

- **Real-time Table Management**: Live dashboard showing current table availability
- **Intelligent Queue System**: Automated queue management with dynamic ETA calculations
- **Agent-Based Architecture**: Autonomous agents handle table monitoring, queue management, and notifications
- **Multi-User Support**: Separate interfaces for customers, staff, and managers
- **WebSocket Integration**: Real-time updates without page refresh
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

The application follows an agent-based architecture with the following components:

### Autonomous Agents
- **Table Agent**: Monitors and updates table states
- **Queue Agent**: Manages customer queue and automatic reordering
- **ETA Agent**: Predicts waiting time based on historical data
- **Notification Agent**: Sends alerts to customers

### System Flow
```
Customer App / Staff App
         ↓
Agent Orchestration Layer
         ↓
Backend Services (FastAPI)
         ↓
SQLite / PostgreSQL Database
```

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.x
- **Database**: SQLite / PostgreSQL (SQLAlchemy ORM)
- **Real-time Communication**: WebSockets
- **Dependencies**:
  - fastapi
  - uvicorn
  - pydantic
  - sqlalchemy
  - psycopg2-binary (for PostgreSQL)
  - pydantic-settings
  - python-dotenv
  - websockets

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.11.0
- **Styling**: CSS3 with modern design patterns
- **Language**: JavaScript (ES6+)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Python**: 3.8 or higher
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **PowerShell**: For running the development script (Windows)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "restaurant app"
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python environment:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend

# Install npm packages
npm install
```

### 4. Run the Application

#### Option A: Using the PowerShell Script (Recommended for Windows)

From the root directory:

```powershell
.\run_dev.ps1
```

This script will automatically start both the backend and frontend servers in separate terminal windows.

#### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
.\venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173 (or the port shown in the Vite output)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)

## 📁 Project Structure

```
restaurant app/
├── backend/
│   ├── agents/              # Autonomous agent implementations
│   │   ├── base_agent.py    # Base agent class
│   │   ├── table_agent.py   # Table management agent
│   │   ├── queue_agent.py   # Queue management agent
│   │   ├── eta_agent.py     # ETA calculation agent
│   │   ├── notification_agent.py # Customer & Staff alerts
│   │   └── orchestrator.py  # Agent orchestration
│   ├── database/            # Database configuration and setup
│   │   └── db.py           # SQLAlchemy setup (Dynamic DB switching)
│   ├── models/              # Data models and schemas
│   │   ├── models.py       # SQLAlchemy models
│   │   └── schemas.py      # Pydantic schemas
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Environment configuration
│   └── restaurant.db       # SQLite database file (if used)
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # React entry point
│   ├── public/             # Static assets
│   ├── package.json        # npm dependencies
│   └── vite.config.js      # Vite configuration
├── docs/
│   ├── PRD.md             # Product Requirements Document
│   └── AGENT_WORKFLOW.md  # Detailed Agent documentation
└── run_dev.ps1            # Development startup script
```

## 🎯 User Roles

### Customer
- View real-time table availability
- Join waiting queue
- Check estimated waiting time
- Receive notifications when table is ready

### Staff
- Update table status (Available, Occupied, Reserved)
- View current queue
- Manage table assignments

### Manager
- Monitor performance metrics
- View analytics on peak hours
- Track average wait times and table turnover

## 🔧 Configuration

### Backend Configuration
The backend uses environment variables for configuration. Create a `.env` file in the `backend` directory (one has been created for you):

```env
# For SQLite (Default)
DATABASE_URL=sqlite:///./restaurant.db

# For PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/db_name
```

#### Switching to PostgreSQL:
1. Ensure you have a PostgreSQL server running.
2. Create a database (e.g., `restaurant_db`).
3. Update the `DATABASE_URL` in `backend/.env`.
4. The application will automatically create the required tables on the next startup.

### Frontend Configuration
Frontend configuration can be adjusted in `vite.config.js` for build settings and proxy configurations.

## 📊 API Endpoints

Key API endpoints (see http://localhost:8000/docs for full documentation):

- `GET /tables` - Get all tables
- `POST /tables` - Create a new table
- `PUT /tables/{id}` - Update table status
- `GET /queue` - Get current queue
- `POST /queue` - Add customer to queue
- `GET /queue/eta` - Get estimated waiting time
- `GET /api/agents/status` - View real-time agent analysis
- `POST /api/agents/run` - Manually trigger agent cycle

## 🧪 Development

### Backend Development
```bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Linting
```bash
cd frontend
npm run lint
```

### Build for Production
```bash
cd frontend
npm run build
```

## 📈 Success Metrics

- Reduction in average waiting time (target: ≥30%)
- Improved table turnover rate
- Increased customer satisfaction score
- Real-time updates with latency ≤ 2 seconds

## 🔮 Future Enhancements

- AI-based ETA prediction using machine learning
- Online table reservation system
- Multi-branch restaurant support
- Voice commands for staff
- SMS/Push notification integration
- Advanced analytics dashboard
- Mobile native apps (iOS/Android)

## 🐛 Troubleshooting

### Backend Issues
- **Database errors**: Ensure `restaurant.db` has proper permissions
- **Port conflicts**: Change the port in the uvicorn command if 8000 is occupied
- **Module not found**: Verify virtual environment is activated and dependencies are installed

### Frontend Issues
- **Build errors**: Delete `node_modules` and run `npm install` again
- **Port conflicts**: Vite will automatically suggest an alternative port
- **API connection issues**: Verify backend is running on port 8000

### PowerShell Script Issues
- **Execution policy error**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **Path issues**: Ensure you're running the script from the project root directory

## 📝 License

This project is part of an educational/demonstration application for restaurant management systems.

## 👥 Contributing

This is a learning project. For major changes, please open an issue first to discuss what you would like to change.

## 📧 Support

For questions or issues, please refer to the documentation in the `docs/` directory or create an issue in the repository.

---

**Built with ❤️ using FastAPI, React, and Agent-Based Architecture**
