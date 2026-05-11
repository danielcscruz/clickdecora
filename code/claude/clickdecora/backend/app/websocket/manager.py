import asyncio
from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # protocol -> list of active websocket connections
        self._rooms: dict[str, list[WebSocket]] = defaultdict(list)
        self._lock = asyncio.Lock()

    async def connect(self, protocol: str, ws: WebSocket) -> None:
        await ws.accept()
        async with self._lock:
            self._rooms[protocol].append(ws)

    async def disconnect(self, protocol: str, ws: WebSocket) -> None:
        async with self._lock:
            room = self._rooms.get(protocol, [])
            if ws in room:
                room.remove(ws)

    async def broadcast(self, protocol: str, data: dict, exclude: WebSocket | None = None) -> None:
        connections = list(self._rooms.get(protocol, []))
        dead = []
        for ws in connections:
            if ws is exclude:
                continue
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            await self.disconnect(protocol, ws)


manager = ConnectionManager()
