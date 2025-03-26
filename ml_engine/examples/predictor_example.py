import numpy as np
from models.resource_predictor import ResourcePredictor

# Create sample data (simulating CPU, Memory, Disk, Network metrics)
def generate_sample_data(n_samples=1000):
    data = []
    for i in range(n_samples):
        # Simulate metrics: CPU%, Memory%, Disk%, Network%
        metrics = np.array([
            np.random.uniform(0, 100),  # CPU usage
            np.random.uniform(0, 100),  # Memory usage
            np.random.uniform(0, 100),  # Disk usage
            np.random.uniform(0, 100)   # Network usage
        ])
        data.append(metrics)
    return np.array(data)

# Create and train the predictor
predictor = ResourcePredictor(sequence_length=10)
historical_data = generate_sample_data()
predictor.train(historical_data)

# Make a prediction
current_sequence = historical_data[-10:]  # Last 10 measurements
prediction = predictor.predict(current_sequence)

print("Current metrics:", current_sequence[-1])
print("Predicted next metrics:", prediction[0])