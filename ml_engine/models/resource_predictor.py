import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

class ResourcePredictor:
    def __init__(self, sequence_length=10):
        self.sequence_length = sequence_length
        self.model = RandomForestRegressor(n_estimators=100)
        self.scaler = StandardScaler()
        
    def prepare_sequences(self, data):
        X, y = [], []
        for i in range(len(data) - self.sequence_length):
            X.append(data[i:i + self.sequence_length].flatten())  # Flatten the sequence
            y.append(data[i + self.sequence_length])
        return np.array(X), np.array(y)
        
    def train(self, historical_data, epochs=None):  # epochs parameter kept for compatibility
        X, y = self.prepare_sequences(historical_data)
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        
    def predict(self, current_sequence):
        X = current_sequence.flatten().reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)