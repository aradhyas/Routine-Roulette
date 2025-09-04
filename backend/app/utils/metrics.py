import time
import statistics
from typing import List, Dict
from threading import Lock

class LatencyTracker:
    """Simple in-memory latency tracker for API metrics"""
    
    def __init__(self):
        self._measurements: Dict[str, List[float]] = {}
        self._lock = Lock()
    
    def record(self, operation: str, latency_ms: float):
        """Record a latency measurement for an operation"""
        with self._lock:
            if operation not in self._measurements:
                self._measurements[operation] = []
            self._measurements[operation].append(latency_ms)
            
            # Keep only last 1000 measurements to prevent memory growth
            if len(self._measurements[operation]) > 1000:
                self._measurements[operation] = self._measurements[operation][-1000:]
    
    def get_stats(self, operation: str) -> Dict[str, float]:
        """Get statistics for an operation"""
        with self._lock:
            measurements = self._measurements.get(operation, [])
            
            if not measurements:
                return {
                    "count": 0,
                    "mean": 0.0,
                    "p50": 0.0,
                    "p95": 0.0,
                    "p99": 0.0
                }
            
            sorted_measurements = sorted(measurements)
            count = len(sorted_measurements)
            
            return {
                "count": count,
                "mean": statistics.mean(sorted_measurements),
                "p50": self._percentile(sorted_measurements, 50),
                "p95": self._percentile(sorted_measurements, 95),
                "p99": self._percentile(sorted_measurements, 99)
            }
    
    def _percentile(self, sorted_data: List[float], percentile: float) -> float:
        """Calculate percentile from sorted data"""
        if not sorted_data:
            return 0.0
        
        index = (percentile / 100.0) * (len(sorted_data) - 1)
        lower_index = int(index)
        upper_index = min(lower_index + 1, len(sorted_data) - 1)
        
        if lower_index == upper_index:
            return sorted_data[lower_index]
        
        # Linear interpolation
        weight = index - lower_index
        return sorted_data[lower_index] * (1 - weight) + sorted_data[upper_index] * weight

# Global instance
latency_tracker = LatencyTracker()

def time_operation(operation_name: str):
    """Decorator to time an operation and record its latency"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                end_time = time.time()
                latency_ms = (end_time - start_time) * 1000
                latency_tracker.record(operation_name, latency_ms)
        return wrapper
    return decorator
