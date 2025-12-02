import React, { useEffect, useRef, useState } from "react";
import api from "../api";

interface ExecutionLogsProps {
  executionId: number | null;
}

interface LogItem {
  id: number;
  timestamp: string;
  message: string;
}

const cardStyle: React.CSSProperties = {
  width: "360px",
  backgroundColor: "rgba(15,23,42,0.7)",
  borderRadius: "1.25rem",
  border: "1px solid rgba(99,102,241,0.2)",
  padding: "1.5rem",
  boxShadow: "0 25px 45px rgba(2,6,23,0.45)",
  display: "flex",
  flexDirection: "column",
};

const logWindowStyle: React.CSSProperties = {
  marginTop: "1.25rem",
  maxHeight: "64vh",
  overflowY: "auto",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  fontSize: "0.85rem",
  background: "rgba(2,6,23,0.75)",
  borderRadius: "1rem",
  padding: "1rem",
  border: "1px solid rgba(15,118,255,0.25)",
  color: "#e2e8f0",
};

const statusColors: Record<string, string> = {
  pending: "#eab308",
  started: "#38bdf8",
  running: "#38bdf8",
  success: "#34d399",
  failed: "#f87171",
  error: "#f87171",
  idle: "#94a3b8",
};

export const ExecutionLogs: React.FC<ExecutionLogsProps> = ({ executionId }) => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [status, setStatus] = useState<string>("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!executionId) {
      setLogs([]);
      setStatus("idle");
      return;
    }

    const fetchInitial = async () => {
      const [logsRes, statusRes] = await Promise.all([
        api.get<LogItem[]>(`executions/${executionId}/logs/`),
        api.get<{ status: string }>(`executions/${executionId}/status/`),
      ]);
      setLogs(logsRes.data);
      setStatus(statusRes.data.status);
    };

    fetchInitial();

    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${proto}://${window.location.host}/ws/command-center/logs/${executionId}/`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const timestamp = new Date().toISOString();
      try {
        const payload = JSON.parse(event.data);
        if (payload.status) {
          setStatus(payload.status);
        }
        const message = typeof payload === "string" ? payload : payload.message;
        if (!message) return;
        setLogs((prev) => [
          ...prev,
          { id: prev.length ? prev[prev.length - 1].id + 1 : 1, timestamp, message },
        ]);
      } catch {
        setLogs((prev) => [
          ...prev,
          { id: prev.length ? prev[prev.length - 1].id + 1 : 1, timestamp, message: event.data },
        ]);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      ws.close();
    };
  }, [executionId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs.length]);

  const statusColor = statusColors[status?.toLowerCase()] ?? "#94a3b8";

  if (!executionId) {
    return (
      <section style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Execution Logs</h2>
        <p style={{ marginTop: "0.6rem", color: "#94a3b8" }}>
          Select a command and launch it to stream live output here.
        </p>
      </section>
    );
  }

  return (
    <section style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Execution Logs</h2>
          <p style={{ marginTop: "0.35rem", color: "#94a3b8" }}>Execution #{executionId}</p>
        </div>
        <span
          style={{
            padding: "0.35rem 0.9rem",
            borderRadius: "999px",
            border: `1px solid ${statusColor}`,
            color: statusColor,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
          }}
        >
          {status}
        </span>
      </div>

      <div style={logWindowStyle}>
        {logs.length === 0 && (
          <div style={{ color: "#64748b" }}>Waiting for output...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} style={{ whiteSpace: "pre-wrap", marginBottom: "0.65rem" }}>
            <span style={{ color: "#475569", marginRight: "0.5rem" }}>
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            {log.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </section>
  );
};
