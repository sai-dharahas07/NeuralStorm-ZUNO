import { useEffect, useState } from "react";
import { checkBackendHealth } from "../services/backendApi";

export default function BackendStatus() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;
    checkBackendHealth()
      .then(() => { if (active) setStatus("connected"); })
      .catch(() => { if (active) setStatus("offline"); });
    return () => { active = false; };
  }, []);

  const styles = {
    checking: { color: "#725b22", background: "#fff6d9" },
    connected: { color: "#17633c", background: "#e8f7ef" },
    offline: { color: "#8b3030", background: "#fff0f0" },
  };

  const labels = {
    checking: "Backend: checking…",
    connected: "Backend: connected",
    offline: "Backend: offline",
  };

  return (
    <span role="status" aria-live="polite" style={{
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "999px",
      padding: "6px 10px",
      fontSize: "12px",
      fontWeight: 600,
      ...styles[status],
    }}>
      {labels[status]}
    </span>
  );
}
