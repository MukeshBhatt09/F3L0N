from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import psutil
import asyncio
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Collect system metrics
            metrics = {
                'timestamp': datetime.now().strftime('%H:%M:%S'),
                'cpu': psutil.cpu_percent(),
                'memory': psutil.virtual_memory().percent,
                'disk': psutil.disk_usage('/').percent
            }
            
            # Collect process information
            processes = []
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
                try:
                    processes.append(proc.info)
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
            
            await websocket.send_json({
                'metrics': metrics,
                'processes': processes
            })
            await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket error: {e}")