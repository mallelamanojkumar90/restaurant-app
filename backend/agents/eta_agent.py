"""
ETA Agent - Predicts waiting times dynamically
"""
from agents.base_agent import BaseAgent
from typing import Dict, Any
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class ETAAgent(BaseAgent):
    """
    Autonomous agent responsible for:
    - Calculating estimated wait times
    - Predicting table turnover
    - Updating ETAs dynamically
    """
    
    def __init__(self):
        super().__init__("ETAAgent")
        self.avg_dining_time = 45  # minutes
        self.base_wait_increment = 15  # minutes per position

    def sense(self, environment: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sense: Gather queue and table information
        """
        queue = environment.get("queue", [])
        occupied_tables = environment.get("occupied_tables", [])
        available_tables = environment.get("available_tables", [])
        
        perception = {
            "queue_entries": sorted(queue, key=lambda x: x.position),
            "occupied_tables": occupied_tables,
            "available_count": len(available_tables),
            "current_time": datetime.utcnow()
        }
        
        return perception

    def decide(self, perception: Dict[str, Any]) -> Dict[str, Any]:
        """
        Decide: Calculate ETAs for each queue entry
        """
        decisions = {
            "eta_updates": []
        }
        
        queue_entries = perception["queue_entries"]
        available_count = perception["available_count"]
        occupied_tables = perception["occupied_tables"]
        
        # Calculate average remaining dining time for occupied tables
        avg_remaining_time = self.avg_dining_time / 2  # Simple heuristic
        
        for entry in queue_entries:
            # Base calculation: position * increment
            base_eta = entry.position * self.base_wait_increment
            
            # Adjust based on available tables
            if available_count > 0:
                # If tables are available, reduce wait time
                eta = min(5, base_eta)  # Immediate seating
            else:
                # If no tables available, factor in turnover
                eta = base_eta
                
                # If there are occupied tables, reduce ETA slightly
                if occupied_tables:
                    eta = max(10, eta - 5)
            
            decisions["eta_updates"].append({
                "queue_entry_id": entry.id,
                "estimated_wait_time": int(eta),
                "customer_name": entry.name
            })
        
        logger.info(f"ETAAgent calculated ETAs for {len(decisions['eta_updates'])} customers")
        
        return decisions

    def act(self, decision: Dict[str, Any]) -> Any:
        """
        Act: Return ETA updates
        """
        return {
            "agent": self.name,
            "eta_updates": decision["eta_updates"]
        }
