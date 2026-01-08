# 🤖 How Agents Work in the Restaurant App

## Overview

Your restaurant application uses an **autonomous agent-based architecture** where intelligent agents continuously monitor and manage the restaurant's operations. Here's how they work together:

---

## 🏗️ Agent Architecture

### The Sense → Decide → Act Loop

Every agent follows this fundamental pattern:

```
┌─────────┐      ┌─────────┐      ┌─────────┐
│  SENSE  │ ───▶ │ DECIDE  │ ───▶ │   ACT   │
└─────────┘      └─────────┘      └─────────┘
     ▲                                   │
     │                                   │
     └───────────────────────────────────┘
              (Continuous Loop)
```

1. **SENSE**: Gather information from the environment (database)
2. **DECIDE**: Analyze the data and make intelligent decisions
3. **ACT**: Execute actions or return recommendations

---

## 🎯 The Three Core Agents

### 1️⃣ **Table Agent** (`table_agent.py`)

**Responsibilities:**
- Monitor all table states in real-time
- Detect stale occupancies (tables occupied > 60 minutes)
- Alert staff about long-occupied tables

**How it Works:**

```python
# SENSE Phase
- Queries all tables from database
- Categorizes: Available, Occupied, Reserved
- Calculates how long each table has been occupied
- Identifies "stale" tables (occupied > 60 min)

# DECIDE Phase
- Analyzes stale occupancies
- Generates alerts for staff
- Creates recommendations based on availability

# ACT Phase
- Returns alerts and recommendations
- Example: "Table T2 occupied for 75 minutes"
```

**Configuration:**
- Average dining time: **45 minutes**
- Warning threshold: **60 minutes**

---

### 2️⃣ **Queue Agent** (`queue_agent.py`)

**Responsibilities:**
- Manage customer waiting queue
- Match party sizes to available tables
- Auto-reorder queue when customers are seated

**How it Works:**

```python
# SENSE Phase
- Retrieves current queue (sorted by position)
- Gets list of available tables
- Notes table capacities

# DECIDE Phase
- Matches customers to tables using "best-fit" algorithm
  (smallest table that fits the party size)
- Generates notifications for matched customers
- Reorders remaining queue positions

# ACT Phase
- Returns table assignments
- Sends "table ready" notifications
- Updates queue positions
```

**Matching Algorithm:**
```
Party of 4 → Looks for smallest table ≥ 4 capacity
Example: Prefers Table(4) over Table(8) to optimize space
```

---

### 3️⃣ **ETA Agent** (`eta_agent.py`)

**Responsibilities:**
- Calculate estimated wait times for each customer
- Predict table turnover
- Dynamically update ETAs based on current conditions

**How it Works:**

```python
# SENSE Phase
- Gets current queue entries
- Checks available table count
- Analyzes occupied tables

# DECIDE Phase
- Calculates base ETA: position × 15 minutes
- Adjusts based on table availability:
  * If tables available → ETA = 5 min (immediate)
  * If no tables → ETA = position × 15 min
  * If tables turning over → ETA reduced by 5 min

# ACT Phase
- Returns updated wait times for each customer
- Updates database with new ETAs
```

**Configuration:**
- Base wait increment: **15 minutes per position**
- Average dining time: **45 minutes**

---

## 🎼 Agent Orchestrator

The **Orchestrator** (`orchestrator.py`) coordinates all agents to work together seamlessly.

### Orchestration Workflow

```
┌─────────────────────────────────────────────────┐
│         AGENT ORCHESTRATOR                      │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │ Table  │    │ Queue  │    │  ETA   │
   │ Agent  │    │ Agent  │    │ Agent  │
   └────────┘    └────────┘    └────────┘
        │             │             │
        └─────────────┼─────────────┘
                      ▼
              ┌───────────────┐
              │   Database    │
              │   Updates     │
              └───────────────┘
```

### Orchestration Steps:

1. **Prepare Environment**
   - Fetches all tables from database
   - Fetches queue entries
   - Categorizes tables by status

2. **Run Table Agent**
   - Monitors table states
   - Generates alerts for stale occupancies

3. **Run Queue Agent**
   - Matches customers to available tables
   - Generates notifications
   - Reorders queue

4. **Run ETA Agent**
   - Calculates wait times for all customers
   - Updates ETAs in database

5. **Apply Updates**
   - Commits all changes to database
   - Returns comprehensive results

---

## 🔄 When Do Agents Run?

Agents are triggered automatically in these scenarios:

### 1. **Table Status Update**
```python
# When staff updates a table (e.g., marks as available)
PUT /api/tables/{table_id}
  ↓
orchestrator.run_cycle(db)  # Agents run automatically
```

### 2. **Customer Joins Queue**
```python
# When a customer joins the waiting queue
POST /api/queue
  ↓
orchestrator.run_cycle(db)  # Agents recalculate everything
```

### 3. **Customer Removed from Queue**
```python
# When a customer is seated or cancels
DELETE /api/queue/{entry_id}
  ↓
orchestrator.run_cycle(db)  # Queue reordered, ETAs updated
```

### 4. **Manual Trigger**
```python
# Staff can manually trigger agents
POST /api/agents/run
  ↓
orchestrator.run_cycle(db)  # Full cycle runs
```

---

## 📊 Real-World Example

Let's see the agents in action with a real scenario:

### Initial State:
- **Tables**: 8 total (4 available, 3 occupied, 1 reserved)
- **Queue**: 3 groups waiting
  - John (party of 4) - Position 1
  - Jane (party of 2) - Position 2
  - Bob (party of 6) - Position 3

### Event: Table T2 (capacity 4) becomes available

```
1. TABLE AGENT SENSES:
   - T2 is now available
   - 4 tables total available
   - No stale occupancies

2. QUEUE AGENT DECIDES:
   - Match John (party of 4) to T2 (capacity 4) ✓
   - Generate notification: "John, Table T2 is ready!"
   - Reorder queue:
     * Jane → Position 1
     * Bob → Position 2

3. ETA AGENT CALCULATES:
   - Jane (Position 1): 15 minutes
   - Bob (Position 2): 30 minutes

4. DATABASE UPDATED:
   - John removed from queue
   - Jane and Bob positions updated
   - ETAs updated
```

---

## 🎯 Agent Benefits

### 1. **Autonomous Operation**
- Agents work independently without manual intervention
- Continuous monitoring and optimization

### 2. **Real-Time Responsiveness**
- Instant reactions to table status changes
- Dynamic ETA updates

### 3. **Intelligent Decision Making**
- Best-fit table matching
- Predictive wait time calculations
- Proactive alerts

### 4. **Scalability**
- Easy to add new agents (e.g., Notification Agent)
- Modular architecture

---

## 🔍 Monitoring Agent Activity

### Check Agent Status (Read-Only)
```bash
GET /api/agents/status
```

Returns current agent analysis without making changes:
```json
{
  "table_analysis": {
    "agent": "TableAgent",
    "recommendations": [...],
    "alerts": [...]
  },
  "queue_analysis": {
    "agent": "QueueAgent",
    "matches": [...],
    "notifications": [...]
  },
  "environment_summary": {
    "total_tables": 8,
    "available_tables": 4,
    "queue_length": 3
  }
}
```

### Trigger Agent Cycle Manually
```bash
POST /api/agents/run
```

---

## 🚀 Future Agent Enhancements

### Planned Agents:

1. **Notification Agent**
   - Send SMS/Email to customers
   - Push notifications
   - Staff alerts

2. **Analytics Agent**
   - Track peak hours
   - Calculate average wait times
   - Generate performance reports

3. **Prediction Agent**
   - Machine learning-based ETA predictions
   - Demand forecasting
   - Optimal table allocation

---

## 💡 Key Takeaways

✅ **Agents are autonomous** - They run automatically when events occur  
✅ **Agents are intelligent** - They make decisions based on current state  
✅ **Agents are coordinated** - The orchestrator ensures they work together  
✅ **Agents are reactive** - They respond immediately to changes  
✅ **Agents are observable** - You can monitor their activity via API  

---

**Your agents are working 24/7 to optimize restaurant operations!** 🎉
