"""
Flask backend for the Bharatanatyam Mudra Classification History system.

Endpoints
─────────
POST /api/classify   – Save a classification result (with uploaded image)
GET  /api/history    – Retrieve the latest 20 classification records

Static files (uploaded images) are served from /static/uploads/.
"""

import os
import uuid

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from models import init_db, save_classification, get_history

# ─── App setup ───────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)  # Allow requests from Vite dev server

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "static", "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}
MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50 MB

app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ─── Routes ──────────────────────────────────────────────────────


@app.route("/api/health", methods=["GET"])
def health():
    """Simple health-check endpoint."""
    return jsonify({"status": "ok"}), 200


@app.route("/api/classify", methods=["POST"])
def classify():
    """
    Save a classification result.

    Expected multipart/form-data:
        image            – the uploaded image file
        mudra_type       – "one-hand" or "two-hand"
        predicted_label  – model's predicted label string
        confidence_score – float between 0 and 100 (percentage)
    """
    # ── Validate fields ──────────────────────────────────────────
    mudra_type = request.form.get("mudra_type")
    predicted_label = request.form.get("predicted_label")
    confidence_score = request.form.get("confidence_score")

    errors = []
    if mudra_type not in ("one-hand", "two-hand"):
        errors.append("mudra_type must be 'one-hand' or 'two-hand'")
    if not predicted_label:
        errors.append("predicted_label is required")
    if confidence_score is None:
        errors.append("confidence_score is required")
    else:
        try:
            confidence_score = float(confidence_score)
        except ValueError:
            errors.append("confidence_score must be a number")

    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    # ── Handle image upload ──────────────────────────────────────
    image = request.files.get("image")
    if not image or image.filename == "":
        return (
            jsonify({"success": False, "errors": ["image file is required"]}),
            400,
        )

    if not allowed_file(image.filename):
        return (
            jsonify(
                {
                    "success": False,
                    "errors": [
                        f"File type not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}"
                    ],
                }
            ),
            400,
        )

    # Save with UUID filename to avoid collisions
    ext = image.filename.rsplit(".", 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    save_path = os.path.join(UPLOAD_FOLDER, unique_name)
    image.save(save_path)

    # Relative path stored in DB (served by Flask's static route)
    relative_path = f"/static/uploads/{unique_name}"

    # ── Persist to database ──────────────────────────────────────
    record = save_classification(
        image_path=relative_path,
        mudra_type=mudra_type,
        predicted_label=predicted_label,
        confidence_score=confidence_score,
    )

    return jsonify({"success": True, "record": record}), 201


@app.route("/api/history", methods=["GET"])
def history():
    """
    Return the latest 20 classification records sorted newest first.
    """
    records = get_history()
    return jsonify({"success": True, "records": records, "count": len(records)}), 200


# ─── Serve uploaded images ───────────────────────────────────────
@app.route("/static/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ─── Entrypoint ──────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    print("🚀 Flask backend running on http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
