import psutil
import time
import pandas as pd
from datetime import datetime

class ProcessMonitor:
    def __init__(self):
        self.process_history = []

    def get_process_info(self):
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 
                                       'memory_percent', 'status']):
            try:
                proc_info = proc.info
                proc_info['timestamp'] = datetime.now()
                proc_info['io_counters'] = proc.io_counters()._asdict() if proc.io_counters() else None
                proc_info['network'] = psutil.net_io_counters()._asdict()
                processes.append(proc_info)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        return processes

    def start_monitoring(self, interval=1):
        while True:
            processes = self.get_process_info()
            self.process_history.append(processes)
            time.sleep(interval)

    def get_system_metrics(self):
        return {
            'cpu': psutil.cpu_percent(interval=1, percpu=True),
            'memory': psutil.virtual_memory()._asdict(),
            'disk': psutil.disk_usage('/')._asdict(),
            'network': psutil.net_io_counters()._asdict()
        }