import React, { PropsWithChildren } from "react";

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, rgba(59,130,246,0.25), transparent 45%), #020617",
  color: "#e2e8f0",
  padding: "1.5rem",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "1400px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 3rem)",
};

const heroStyle: React.CSSProperties = {
  padding: "1.5rem 0 1rem 0",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "1rem",
};

const heroTextStyle: React.CSSProperties = {
  flex: "1",
  minWidth: "260px",
};

const pillStyle: React.CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  fontSize: "0.7rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  backgroundColor: "rgba(148, 163, 184, 0.15)",
  color: "#cbd5f5",
  padding: "0.25rem 0.65rem",
  borderRadius: "999px",
};

const buttonStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #22d3ee, #6366f1)",
  color: "#020617",
  fontWeight: 600,
  border: "none",
  borderRadius: "999px",
  padding: "0.8rem 1.6rem",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(79,70,229,0.25)",
  textDecoration: "none",
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  paddingBottom: "1.5rem",
};

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div style={shellStyle}>
      <div style={containerStyle}>
        <header style={heroStyle}>
          <div style={heroTextStyle}>
            <div style={pillStyle}>Operational Control</div>
            <h1 style={{ marginTop: "0.8rem", marginBottom: "0.35rem", fontSize: "2.1rem" }}>
              Admin Command Center
            </h1>
            <p style={{ color: "#a5b4fc", maxWidth: "56ch", lineHeight: 1.5 }}>
              Launch and monitor your Django management commands without leaving the browser. View arguments,
              trigger jobs, and stream logs in real time.
            </p>
          </div>
          <a style={buttonStyle} href="/admin/">
            Open Django Admin
          </a>
        </header>
        <main style={mainStyle}>{children}</main>
      </div>
    </div>
  );
};
