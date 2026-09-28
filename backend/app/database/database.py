import sqlite3
from pathlib import Path


DATABASE_PATH = Path(__file__).resolve().parent / "history.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def create_history_table():
    connection = get_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tool TEXT NOT NULL,
            user_input TEXT NOT NULL,
            response TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    connection.commit()
    connection.close()


def save_history(tool: str, user_input: str, response: str):
    connection = get_connection()

    connection.execute(
        """
        INSERT INTO history (tool, user_input, response)
        VALUES (?, ?, ?)
        """,
        (tool, user_input, response)
    )

    connection.commit()
    connection.close()


def get_history():
    connection = get_connection()

    rows = connection.execute(
        """
        SELECT id, tool, user_input, response, created_at
        FROM history
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    return [dict(row) for row in rows]
