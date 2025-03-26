import psutil
import time
import numpy as np
from datetime import datetime

class ProcessMonitor:
    def __init__(self):
        self.history = []

    def get_system_metrics(self):
        return {
            'cpu': psutil.cpu_percent(interval=1),
            'memory': psutil.virtual_memory().percent,
            'disk': psutil.disk_usage('/').percent,
            'network': sum(psutil.net_io_counters()[:2]) / 1024 / 1024  # MB
        }

    def get_process_info(self):
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                processes.append(proc.info)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        return processes

    def collect_metrics(self):
        metrics = self.get_system_metrics()
        metrics['timestamp'] = datetime.now()
        self.history.append(metrics)
        return metrics