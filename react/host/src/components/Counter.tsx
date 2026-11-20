import { useState } from "react";
import { useTranslation } from "react-i18next";

export default () => {
  const [count, setCount] = useState<number>(0);
  const { t } = useTranslation("host");

  return (
    <button
      style={{
        border: "0 solid #e2e8f0",
        marginTop: "10px",
        backgroundColor: "rgb(246, 179, 82)",
        borderRadius: ".25rem",
        fontWeight: "700",
        padding: ".5rem 1rem .5rem 1rem",
        color: "rgb(24, 24, 24)",
      }}
      onClick={() => setCount(count + 1)}
    >
      {t("counter", { count })}
    </button>
  );
};
