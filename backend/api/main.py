from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from data_collector.process_monitor import ProcessMonitor
import json

app = FastAPI()
monitor = ProcessMonitor()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/metrics")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            metrics = monitor.get_system_metrics()
            processes = monitor.get_process_info()
            await websocket.send_json({
                'metrics': metrics,
                'processes': processes
            })
            await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()

@app.get("/system/summary")
async def get_system_summary():
    return monitor.get_system_metrics()

@app.get("/processes")
async def get_processes():
    return monitor.get_process_info()