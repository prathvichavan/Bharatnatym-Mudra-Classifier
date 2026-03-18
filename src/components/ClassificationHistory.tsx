import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History,
  RefreshCcw,
  Loader2,
  Calendar,
  Tag,
  Percent,
  Hand,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { fetchHistory, ClassificationRecord } from "@/utils/historyApi";

// Flask backend base for images – proxied through Vite in dev
const IMAGE_BASE = "";

// ─── Main Component ─────────────────────────────────────────────

export default function ClassificationHistory({
  refreshTrigger,
}: {
  /** Increment this number to force a re-fetch (e.g. after a new classification). */
  refreshTrigger?: number;
}) {
  const [records, setRecords] = useState<ClassificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistory();
      setRecords(data);
    } catch {
      setError("Could not load classification history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTrigger]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="max-w-6xl mx-auto mt-12"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Recent Classifications
            </h2>
            <p className="text-sm text-muted-foreground">
              Latest {records.length} of max 20 results
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={load}
          disabled={loading}
          className="border-border hover:bg-muted"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Loading State */}
      {loading && records.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading history&hellip;</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
          <Button variant="ghost" size="sm" onClick={load} className="ml-auto">
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && records.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
          <ImageIcon className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium mb-1">No classifications yet</p>
          <p className="text-sm">
            Upload and classify a mudra above — results will appear here.
          </p>
        </div>
      )}

      {/* Grid of Cards */}
      {records.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {records.map((rec, index) => (
              <HistoryCard key={rec.image_id} record={rec} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// ─── Individual Card ────────────────────────────────────────────

function HistoryCard({
  record,
  index,
}: {
  record: ClassificationRecord;
  index: number;
}) {
  const confidence = record.confidence_score;
  const isHigh = confidence >= 80;
  const isMedium = confidence >= 50 && confidence < 80;

  const confidenceColor = isHigh
    ? "text-green-600 bg-green-500/15 border-green-500/30"
    : isMedium
    ? "text-amber-600 bg-amber-500/15 border-amber-500/30"
    : "text-red-500 bg-red-500/15 border-red-500/30";

  const typeColor =
    record.mudra_type === "one-hand"
      ? "bg-primary/15 text-primary border-primary/30"
      : "bg-secondary/15 text-secondary border-secondary/30";

  const formattedDate = formatDate(record.created_at);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Card className="group overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative aspect-square overflow-hidden bg-muted/40">
          <img
            src={`${IMAGE_BASE}${record.image_path}`}
            alt={record.predicted_label}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f1f5f9' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />

          {/* Type Badge (overlay) */}
          <Badge
            variant="outline"
            className={`absolute top-2 left-2 text-[10px] font-semibold backdrop-blur-md ${typeColor}`}
          >
            <Hand className="h-3 w-3 mr-1" />
            {record.mudra_type === "one-hand" ? "One Hand" : "Two Hand"}
          </Badge>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Predicted Label */}
          <div className="flex items-start gap-2">
            <Tag className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <p className="text-base font-bold leading-tight text-foreground line-clamp-2">
              {record.predicted_label}
            </p>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${confidenceColor}`}>
                  {confidence.toFixed(1)}%
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHigh
                      ? "bg-green-500"
                      : isMedium
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(confidence, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/40">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}
