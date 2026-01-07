# Testing the Antigravity Agent System

## Overview
The Antigravity Restaurant App uses **4 autonomous agents** that work together to manage tables and queues intelligently.

## The Agents

### 1. **Table Agent** 🪑
- **Purpose**: Monitors table states and detects stale occupancies
- **Triggers**: Runs automatically on every table update
- **What it does**:
  - Tracks how long tables have been occupied
  - Alerts when tables are occupied > 60 minutes
  - Provides recommendations for table management

### 2. **Queue Agent** 📋
- **Purpose**: Intelligently matches customers to tables
- **Triggers**: Runs when queue or tables change
- **What it does**:
  - Matches party sizes to available table capacities
  - Auto-reorders queue positions
  - Finds best-fit tables (smallest table that fits party size)

### 3. **ETA Agent** ⏱️
- **Purpose**: Calculates dynamic wait times
- **Triggers**: Runs on every orchestration cycle
- **What it does**:
  - Predicts wait times based on queue position
  - Adjusts ETAs based on table availability
  - Updates estimated wait times in real-time

### 4. **Agent Orchestrator** 🎯
- **Purpose**: Coordinates all agents
- **What it does**:
  - Prepares environment data for agents
  - Runs agents in sequence
  - Applies agent decisions to database

---

## How to Test the Agents

### Method 1: Using the Web Interface (Easiest)

1. **Start both servers**:
   ```powershell
   # Terminal 1 - Backend
   cd backend
   .\venv\Scripts\activate
   uvicorn main:app --reload
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Open the app**: Go to `http://localhost:5173`

3. **Test Table Agent**:
   - Click "Staff Login" → Login with any credentials
   - Change a table status (e.g., T1 from Available → Occupied)
   - **What happens**: Table Agent detects the change, Queue Agent checks for matches
   - Go to Dashboard to see the updated status immediately

4. **Test Queue Agent**:
   - Open browser console (F12)
   - Add a customer to queue:
     ```javascript
     fetch('http://localhost:8000/api/queue', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         name: 'Test Customer',
         party_size: 4,
         phone: '555-1234'
       })
     })
     ```
   - **What happens**: Queue Agent assigns position, ETA Agent calculates wait time
   - Refresh Dashboard to see the new queue entry

5. **Test ETA Agent**:
   - Watch the "Est. wait" times in the Dashboard queue
   - Change table availability in Staff Panel
   - **What happens**: ETA Agent recalculates wait times based on new availability

### Method 2: Using the API Directly

1. **View API Documentation**:
   - Go to `http://localhost:8000/docs`
   - Interactive Swagger UI with all endpoints

2. **Manually trigger agents**:
   ```powershell
   # Run agent orchestration cycle
   curl -X POST http://localhost:8000/api/agents/run
   ```

3. **Get agent status** (read-only analysis):
   ```powershell
   curl http://localhost:8000/api/agents/status
   ```

4. **View all tables**:
   ```powershell
   curl http://localhost:8000/api/tables
   ```

5. **Update a table**:
   ```powershell
   curl -X PUT http://localhost:8000/api/tables/1 \
     -H "Content-Type: application/json" \
     -d '{"status": "available"}'
   ```

### Method 3: Check Backend Logs

The agents log their activities. Watch the backend terminal for messages like:

```
INFO:     Agent 'TableAgent' starting execution cycle
INFO:     TableAgent sensed: 4 available, 4 occupied, 0 stale
INFO:     Agent 'QueueAgent' starting execution cycle
INFO:     QueueAgent sensed: 3 in queue, 4 tables available
INFO:     QueueAgent decided: 3 matches, 3 notifications
INFO:     ETAAgent calculated ETAs for 3 customers
INFO:     Orchestration cycle complete: {...}
```

---

## Expected Behavior

### When you change a table to "Available":
1. **Table Agent**: Detects the status change
2. **Queue Agent**: Checks if any customers in queue can be matched
3. **ETA Agent**: Recalculates wait times for remaining queue
4. **Frontend**: Updates within 5 seconds (auto-refresh)

### When you add a customer to queue:
1. **Queue Agent**: Assigns position in queue
2. **ETA Agent**: Calculates estimated wait time
3. **Queue Agent**: Checks for available tables matching party size
4. **Frontend**: Shows new queue entry with ETA

### When a table is occupied > 60 minutes:
1. **Table Agent**: Generates alert for stale occupancy
2. **Alert appears** in agent status endpoint

---

## Troubleshooting

### Dashboard not updating?
- Check browser console for errors
- Verify backend is running on port 8000
- Check CORS is enabled (should be automatic)

### Agents not running?
- Check backend logs for errors
- Verify database was created (`restaurant.db` in backend folder)
- Try manually triggering: `POST /api/agents/run`

### Data not persisting?
- Using SQLite database (`restaurant.db`)
- Database auto-creates on first run
- Check file exists in `backend/` folder

---

## Quick Test Script

Run this in your browser console while on `http://localhost:5173`:

```javascript
// Test the full agent workflow
async function testAgents() {
  const API = 'http://localhost:8000';
  
  // 1. Add customer to queue
  console.log('1. Adding customer to queue...');
  await fetch(`${API}/api/queue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Agent Test', party_size: 2 })
  });
  
  // 2. Check queue
  console.log('2. Checking queue...');
  const queue = await fetch(`${API}/api/queue`).then(r => r.json());
  console.log('Queue:', queue);
  
  // 3. Run agents manually
  console.log('3. Running agents...');
  const result = await fetch(`${API}/api/agents/run`, { method: 'POST' }).then(r => r.json());
  console.log('Agent Result:', result);
  
  // 4. Check updated queue
  console.log('4. Checking updated queue...');
  const updatedQueue = await fetch(`${API}/api/queue`).then(r => r.json());
  console.log('Updated Queue:', updatedQueue);
  
  console.log('✅ Test complete!');
}

testAgents();
```

---

## Success Indicators

✅ **Agents are working if**:
- Table status changes reflect in Dashboard within 5 seconds
- Queue ETAs update when tables become available
- Backend logs show agent execution cycles
- `/api/agents/status` returns analysis data

🎉 **You've successfully built an autonomous agent system!**
