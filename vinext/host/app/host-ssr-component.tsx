"use client";

import { useEffect, useState } from "react";

export default function HostSsrComponent() {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div
      style={{
        background: "#3178c6",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
        borderRadius: "10px",
        color: "white",
        padding: "20px",
        textAlign: "center",
        width: "225px",
      }}
    >
      <div style={{ marginTop: "10px", fontSize: "21px" }}>Host SSR component</div>
      <p style={{ margin: "10px 0 16px", fontSize: "12px", color: "rgba(255, 255, 255, 0.82)" }}>
        Rendered by host before client hydration.
      </p>
      {hydrated && (
        <button
          style={{
            backgroundColor: "rgb(246, 179, 82)",
            border: "0 solid #e2e8f0",
            borderRadius: "4px",
            color: "rgb(24, 24, 24)",
            cursor: "pointer",
            display: "block",
            fontWeight: "700",
            margin: "0 auto 12px",
            padding: "8px 16px",
          }}
          onClick={() => setCount((currentCount) => currentCount + 1)}
        >
          SSR counter: {count}
        </button>
      )}
      <span
        style={{
          alignItems: "center",
          background: hydrated
            ? "linear-gradient(135deg, rgba(156, 224, 170, 0.2), rgba(246, 179, 82, 0.12))"
            : "rgba(255, 255, 255, 0.14)",
          borderRadius: "999px",
          boxShadow: hydrated ? "inset 0 0 0 1px rgba(156, 224, 170, 0.18)" : "none",
          color: hydrated ? "#9ce0aa" : "rgba(255, 255, 255, 0.8)",
          display: "inline-flex",
          fontSize: "12px",
          fontWeight: 700,
          gap: "7px",
          lineHeight: 1,
          padding: "7px 11px",
        }}
      >
        <span
          style={{
            background: hydrated ? "#9ce0aa" : "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            boxShadow: hydrated ? "0 0 8px rgba(156, 224, 170, 0.75)" : "none",
            display: "inline-block",
            height: "7px",
            width: "7px",
          }}
        />
        {hydrated ? "Hydrated" : "SSR"}
      </span>
    </div>
  );
}
