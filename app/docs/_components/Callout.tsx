import type { ReactNode } from "react";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

/** Notes carry context; warnings flag a step that can lose work or mislead. */
export default function Callout({
  title,
  tone = "note",
  children,
}: {
  title: string;
  tone?: "note" | "warning";
  children: ReactNode;
}) {
  const Icon = tone === "warning" ? FiAlertTriangle : FiInfo;
  return <aside className={`docs-callout docs-callout-${tone}`}>
    <Icon className="docs-callout-icon" aria-hidden="true" />
    <strong>{title}</strong>
    <span>{children}</span>
  </aside>;
}
