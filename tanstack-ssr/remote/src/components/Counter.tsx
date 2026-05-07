import { useRef, useState, useEffect } from "react";
import { useTheme } from "tanstack-ssr-shared";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
      <h2 style={{ margin: "0 0 8px", color: theme.primaryColour }}>Remote counter</h2>
      <p style={{ margin: "0 0 16px", fontSize: 12, color: "#999" }}>
        Theme from host context: <strong>{theme.label}</strong> ({theme.primaryColour})
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          ref={inputRef}
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{ width: 80, padding: "4px 8px" }}
        />
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{ padding: "4px 12px", cursor: "pointer" }}
        >
          +1
        </button>
        <button
          onClick={() => inputRef.current?.focus()}
          style={{ padding: "4px 12px", cursor: "pointer" }}
        >
          Focus
        </button>
      </div>
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
