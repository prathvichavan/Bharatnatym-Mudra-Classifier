"""
Database model and helper functions for the Classification History system.
Uses SQLite for lightweight persistent storage.
"""

import sqlite3
import uuid
import os
from datetime import datetime

# ─── Configuration ───────────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "classification_history.db")
MAX_RECORDS = 20


def get_connection() -> sqlite3.Connection:
    """Return a new SQLite connection with Row factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


# ─── Schema ──────────────────────────────────────────────────────
def init_db() -> None:
    """Create the classifications table if it does not exist."""
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS classifications (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id        TEXT    NOT NULL UNIQUE,
            image_path      TEXT    NOT NULL,
            mudra_type      TEXT    NOT NULL CHECK(mudra_type IN ('one-hand', 'two-hand')),
            predicted_label TEXT    NOT NULL,
            confidence_score REAL   NOT NULL,
            created_at      TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
        )
        """
    )
    conn.commit()
    conn.close()
    print("✅ Database initialized at", DB_PATH)


# ─── Auto-delete logic ──────────────────────────────────────────
def _enforce_limit(conn: sqlite3.Connection) -> list[str]:
    """
    If total records exceed MAX_RECORDS, delete oldest ones.
    Returns list of image_path values that were deleted (so caller can
    remove the files from disk too).
    """
    row = conn.execute("SELECT COUNT(*) AS cnt FROM classifications").fetchone()
    total = row["cnt"]

    deleted_paths: list[str] = []
    if total > MAX_RECORDS:
        overflow = total - MAX_RECORDS
        rows = conn.execute(
            "SELECT id, image_path FROM classifications ORDER BY id ASC LIMIT ?",
            (overflow,),
        ).fetchall()

        for r in rows:
            deleted_paths.append(r["image_path"])

        ids_to_delete = [r["id"] for r in rows]
        placeholders = ",".join("?" * len(ids_to_delete))
        conn.execute(
            f"DELETE FROM classifications WHERE id IN ({placeholders})",
            ids_to_delete,
        )
    return deleted_paths


# ─── CRUD helpers ────────────────────────────────────────────────
def save_classification(
    image_path: str,
    mudra_type: str,
    predicted_label: str,
    confidence_score: float,
) -> dict:
    """
    Insert a new classification record.

    * Generates a UUID for image_id.
    * Automatically deletes the oldest record if total > 20.
    * Returns the newly created record as a dict.
    """
    image_id = str(uuid.uuid4())
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_connection()
    try:
        conn.execute(
            """
            INSERT INTO classifications
                (image_id, image_path, mudra_type, predicted_label, confidence_score, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (image_id, image_path, mudra_type, predicted_label, confidence_score, created_at),
        )
        conn.commit()

        # Enforce the 20-record cap
        deleted_paths = _enforce_limit(conn)
        conn.commit()

        # Fetch the record we just inserted
        record = conn.execute(
            "SELECT * FROM classifications WHERE image_id = ?", (image_id,)
        ).fetchone()

        result = dict(record)

        # Clean up orphaned images from disk
        upload_dir = os.path.join(os.path.dirname(__file__), "static", "uploads")
        for path in deleted_paths:
            full = os.path.join(os.path.dirname(__file__), path.lstrip("/"))
            if os.path.exists(full):
                try:
                    os.remove(full)
                    print(f"🗑️  Deleted old image: {full}")
                except OSError:
                    pass

        return result
    finally:
        conn.close()


def get_history(limit: int = MAX_RECORDS) -> list[dict]:
    """Return the latest *limit* classification records, newest first."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM classifications ORDER BY id DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
