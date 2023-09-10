from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    authors,
    chapters,
    follows,
    genres,
    genres_books,
    books,
    read_history,
)
from authenticator import authenticator
import os
from jose import jwt
from utils import connected_authors

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_HOST", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws")
async def chapter_update_followers(websocket: WebSocket, token: str):
    await websocket.accept()
    user_jwt = jwt.decode(
        token, os.environ["SIGNING_KEY"], algorithms=["HS256"]
    )
    account = user_jwt["account"]
    print(f"{account['username']} connected")
    connected_authors[account["id"]] = websocket
    try:
        while True:
            message = await websocket.receive_text()
            await websocket.send_json(message)
    except WebSocketDisconnect:
        del connected_authors[account["id"]]
        print("Client Disconnected.")


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "module": 3,
            "week": 17,
            "day": 5,
            "hour": 19,
            "min": "00",
        }
    }


app.include_router(authors.router)
app.include_router(chapters.router)
app.include_router(authenticator.router)
app.include_router(follows.router)
app.include_router(genres.router)
app.include_router(genres_books.router)
app.include_router(books.router)
app.include_router(read_history.router)
