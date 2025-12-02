import React, { useMemo, useState } from "react";
import { Command } from "../types";

interface CommandListProps {
  commands: Command[];
  selectedName?: string;
  onSelect: (name: string) => void;
}

const wrapperStyle: React.CSSProperties = {
  width: "320px",
  backgroundColor: "rgba(15,23,42,0.8)",
  borderRadius: "1rem",
  padding: "1.25rem",
  border: "1px solid rgba(99,102,241,0.2)",
  boxShadow: "0 20px 40px rgba(2,6,23,0.45)",
  display: "flex",
  flexDirection: "column",
};

const listStyle: React.CSSProperties = {
  marginTop: "1rem",
  overflowY: "auto",
  maxHeight: "70vh",
  paddingRight: "0.25rem",
};

export const CommandList: React.FC<CommandListProps> = ({ commands, selectedName, onSelect }) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return commands;
    return commands.filter((cmd) => {
      const search = `${cmd.name} ${cmd.help_text ?? ""}`.toLowerCase();
      return search.includes(query.toLowerCase());
    });
  }, [commands, query]);

  return (
    <section style={wrapperStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Available Commands</h2>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>
            {commands.length} command{commands.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "0.8rem" }}>
        <input
          placeholder="Search by name or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 0.9rem",
            borderRadius: "0.75rem",
            border: "1px solid rgba(148,163,184,0.2)",
            backgroundColor: "rgba(15,23,42,0.8)",
            color: "#e2e8f0",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div style={listStyle}>
        {filtered.length === 0 && (
          <div style={{ color: "#94a3b8", fontSize: "0.85rem", paddingTop: "1.5rem" }}>
            No commands found. Clear your search to see everything.
          </div>
        )}
        {filtered.map((cmd) => {
          const isSelected = cmd.name === selectedName;
          return (
            <button
              key={cmd.name}
              onClick={() => onSelect(cmd.name)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.85rem 1rem",
                marginBottom: "0.7rem",
                borderRadius: "0.85rem",
                border: "1px solid rgba(99,102,241,0.25)",
                cursor: "pointer",
                background: isSelected
                  ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(56,189,248,0.2))"
                  : "rgba(15,23,42,0.6)",
                color: "#e2e8f0",
                transition: "transform 120ms ease, border 120ms ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{cmd.name}</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: cmd.is_enabled ? "#4ade80" : "#fb7185",
                  }}
                >
                  {cmd.is_enabled ? "Active" : "Disabled"}
                </span>
              </div>
              {cmd.help_text && (
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.35rem" }}>{cmd.help_text}</div>
              )}
              <div style={{ fontSize: "0.75rem", color: "#6366f1", marginTop: "0.4rem" }}>
                {cmd.arguments.length} argument{cmd.arguments.length === 1 ? "" : "s"}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
