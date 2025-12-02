import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { Command, CommandArgument } from "../types";

interface CommandDetailProps {
  command: Command | null;
  onExecutionStarted: (executionId: number) => void;
}

const cardStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: "rgba(15,23,42,0.65)",
  borderRadius: "1.25rem",
  border: "1px solid rgba(148,163,184,0.2)",
  padding: "1.75rem",
  boxShadow: "0 25px 45px rgba(2,6,23,0.35)",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  fontSize: "0.9rem",
  marginBottom: "0.35rem",
  color: "#e2e8f0",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  borderRadius: "0.85rem",
  border: "1px solid rgba(148,163,184,0.25)",
  backgroundColor: "#0b1220",
  color: "#f8fafc",
  fontSize: "0.95rem",
};

export const CommandDetail: React.FC<CommandDetailProps> = ({ command, onExecutionStarted }) => {
  const [args, setArgs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!command) {
      setArgs({});
      return;
    }
    const defaults: Record<string, any> = {};
    command.arguments.forEach((arg) => {
      if (arg.default !== undefined && arg.default !== null) {
        defaults[arg.dest] = arg.default;
      }
    });
    setArgs(defaults);
    setError(null);
    setSuccessMessage(null);
  }, [command?.name]);

  const handleChange = (dest: string, value: any) => {
    setArgs((prev) => ({ ...prev, [dest]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const payload = {
        command_name: command.name,
        args,
      };
      const res = await api.post("executions/", payload);
      onExecutionStarted(res.data.id);
      setSuccessMessage("Execution started — streaming logs on the right.");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to start execution");
    } finally {
      setLoading(false);
    }
  };

  const heroStats = useMemo(() => {
    if (!command) return null;
    const requiredCount = command.arguments.filter((arg) => arg.required).length;
    return {
      total: command.arguments.length,
      required: requiredCount,
    };
  }, [command]);

  if (!command) {
    return (
      <div style={cardStyle}>
        <p style={{ color: "#94a3b8" }}>Select a command on the left to inspect its arguments and trigger an execution.</p>
      </div>
    );
  }

  return (
    <section style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.6rem" }}>{command.name}</h2>
          {command.help_text && (
            <p style={{ marginTop: "0.35rem", color: "#a5b4fc", maxWidth: "60ch" }}>{command.help_text}</p>
          )}
        </div>
        {heroStats && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Arguments</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
              {heroStats.total}
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}> total</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#34d399" }}>{heroStats.required} required</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem", maxWidth: "640px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {command.arguments.length === 0 && (
            <div style={{ color: "#94a3b8" }}>This command takes no arguments.</div>
          )}
          {command.arguments.map((arg: CommandArgument) => {
            const isBool = arg.type === "boolean";
            return (
              <div key={arg.dest}>
                <div style={labelStyle}>
                  <span>
                    {arg.dest}
                    {arg.required && <span style={{ color: "#fbbf24" }}> *</span>}
                  </span>
                  {arg.type && (
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase" }}>
                      {arg.type}
                    </span>
                  )}
                </div>
                {isBool ? (
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span
                      style={{
                        width: "48px",
                        height: "26px",
                        borderRadius: "999px",
                        background: args[arg.dest] ? "linear-gradient(135deg,#34d399,#10b981)" : "#1e293b",
                        position: "relative",
                        transition: "background 150ms ease",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "3px",
                          left: args[arg.dest] ? "26px" : "4px",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: "#fff",
                          transition: "left 150ms ease",
                        }}
                      />
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(args[arg.dest])}
                      onChange={(e) => handleChange(arg.dest, e.target.checked)}
                      style={{ display: "none" }}
                    />
                    <span>{args[arg.dest] ? "Enabled" : "Disabled"}</span>
                  </label>
                ) : (
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder={arg.help || arg.dest}
                    value={args[arg.dest] ?? ""}
                    onChange={(e) => handleChange(arg.dest, e.target.value)}
                  />
                )}
                {arg.help && (
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.3rem" }}>{arg.help}</div>
                )}
              </div>
            );
          })}
        </div>

        {(error || successMessage) && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.85rem 1rem",
              borderRadius: "0.75rem",
              backgroundColor: error ? "rgba(248,113,113,0.1)" : "rgba(34,197,94,0.15)",
              color: error ? "#fecaca" : "#86efac",
              border: `1px solid ${error ? "rgba(248,113,113,0.3)" : "rgba(34,197,94,0.3)"}`,
            }}
          >
            {error || successMessage}
          </div>
        )}

        <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.85rem 1.7rem",
              borderRadius: "999px",
              border: "none",
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              background: "linear-gradient(135deg,#34d399,#10b981)",
              color: "#022c22",
              fontSize: "0.95rem",
              boxShadow: "0 15px 35px rgba(16,185,129,0.3)",
            }}
          >
            {loading ? "Starting..." : "Run Command"}
          </button>
          <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Runs as the Django server process.</span>
        </div>
      </form>
    </section>
  );
};
