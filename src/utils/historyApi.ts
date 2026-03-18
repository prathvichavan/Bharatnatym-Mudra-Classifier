/**
 * API helper for the Classification History backend (Flask).
 *
 * Base URL is proxied in vite.config.ts so that
 *   /api/*  →  http://localhost:5000/api/*
 */

// ─── Types ─────────────────────────────────────────────────────

export interface ClassificationRecord {
  id: number;
  image_id: string;
  image_path: string;
  mudra_type: "one-hand" | "two-hand";
  predicted_label: string;
  confidence_score: number;
  created_at: string;
}

interface ClassifySaveResponse {
  success: boolean;
  record?: ClassificationRecord;
  errors?: string[];
}

interface HistoryResponse {
  success: boolean;
  records: ClassificationRecord[];
  count: number;
}

// Use the Flask backend URL – proxied via Vite in dev, same-origin in prod.
const API_BASE = "/api";

// ─── POST /api/classify ────────────────────────────────────────

/**
 * Save a classification result to the backend, including the image.
 *
 * @param imageFile  The original File object the user uploaded
 * @param mudraType  "one-hand" | "two-hand"
 * @param predictedLabel  The predicted mudra name
 * @param confidenceScore  Confidence percentage (0–100)
 */
export async function saveClassification(
  imageFile: File,
  mudraType: "one-hand" | "two-hand",
  predictedLabel: string,
  confidenceScore: number
): Promise<ClassificationRecord | null> {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("mudra_type", mudraType);
    formData.append("predicted_label", predictedLabel);
    formData.append("confidence_score", confidenceScore.toString());

    const response = await fetch(`${API_BASE}/classify`, {
      method: "POST",
      body: formData,
    });

    const data: ClassifySaveResponse = await response.json();

    if (data.success && data.record) {
      console.log("✅ Classification saved:", data.record.image_id);
      return data.record;
    }

    console.warn("⚠️ Save classification failed:", data.errors);
    return null;
  } catch (error) {
    console.error("❌ Failed to save classification:", error);
    return null;
  }
}

// ─── GET /api/history ──────────────────────────────────────────

/**
 * Fetch the latest 20 classification records from the backend.
 */
export async function fetchHistory(): Promise<ClassificationRecord[]> {
  try {
    const response = await fetch(`${API_BASE}/history`);
    const data: HistoryResponse = await response.json();

    if (data.success) {
      return data.records;
    }

    console.warn("⚠️ Fetch history failed");
    return [];
  } catch (error) {
    console.error("❌ Failed to fetch history:", error);
    return [];
  }
}
