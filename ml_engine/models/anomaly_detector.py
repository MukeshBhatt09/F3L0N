import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.scaler = StandardScaler()
        
    def prepare_data(self, processes):
        features = []
        for process in processes:
            features.append([
                process['cpu_percent'],
                process['memory_percent'],
                process['io_counters']['read_bytes'] if process['io_counters'] else 0,
                process['io_counters']['write_bytes'] if process['io_counters'] else 0
            ])
        return np.array(features)

    def train(self, processes):
        X = self.prepare_data(processes)
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled)
        
    def detect_anomalies(self, processes):
        X = self.prepare_data(processes)
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        return predictions