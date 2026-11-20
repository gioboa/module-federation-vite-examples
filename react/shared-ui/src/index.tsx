import { useTranslation } from "react-i18next";

export { registerTranslations, translationsBackend } from "./i18n";

export function SharedBadge({ label }: { label: string }) {
  const { t } = useTranslation("ds");
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px 11px",
        borderRadius: "999px",
        marginTop: "12px",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        background: "rgba(255, 255, 255, 0.08)",
        color: "rgba(255, 255, 255, 0.78)",
        backdropFilter: "blur(8px)",
      }}
    >
      {t("badge", { label })}
    </span>
  );
}
