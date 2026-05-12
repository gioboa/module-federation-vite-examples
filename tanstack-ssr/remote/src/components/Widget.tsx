import { useState, useEffect } from "react";
import { useTheme } from "tanstack-ssr-shared";

export default function Widget() {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div
      style={{
        border: `2px solid ${theme.primaryColour}`,
        borderRadius: 8,
        padding: 24,
        maxWidth: 320,
      }}
    >
      <h2 style={{ margin: "0 0 8px", color: theme.primaryColour }}>I'm the remote app</h2>
      <p style={{ margin: "0 0 4px", fontSize: 14, color: "#555" }}>
        Loaded via Module Federation and server-rendered by the host.
      </p>
      <p style={{ margin: "0 0 16px", fontSize: 12, color: "#999" }}>
        Theme from host context: <strong>{theme.label}</strong> ({theme.primaryColour})
      </p>
      {hydrated && (
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{ padding: "8px 16px", cursor: "pointer", display: "block", marginBottom: 8 }}
        >
          Remote counter: {count}
        </button>
      )}
      <span
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 600,
          background: hydrated ? "#e6f4ea" : "#f5f5f5",
          color: hydrated ? "#1e7e34" : "#999",
          border: `1px solid ${hydrated ? "#a8d5b5" : "#ddd"}`,
        }}
      >
        {hydrated ? "hydrated" : "ssr"}
      </span>
    </div>
  );
}
