import type { ReactNode } from "react";

type FactStatus = "verified" | "not-yet-verified" | "partially-verified" | "historical";

const statusLabel: Record<FactStatus, string> = {
  verified: "Verificato",
  "not-yet-verified": "Non ancora verificato",
  "partially-verified": "Parzialmente verificato",
  historical: "Fatto storico",
};

const statusClass: Record<FactStatus, string> = {
  verified: "text-signal-current",
  "not-yet-verified": "text-signal-unverified",
  "partially-verified": "text-signal-unverified",
  historical: "text-foreground/50",
};

/**
 * A single practical fact paired with its verification status. Status is a provenance label,
 * never a lifecycle value — "not yet verified" describes what we know, not whether the place is open.
 */
export const Fact = ({
  label,
  status,
  children,
}: {
  label: string;
  status: FactStatus;
  children: ReactNode;
}) => (
  <div className="border-t border-border py-4 first:border-t-0">
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className={`stamp ${statusClass[status]}`}>{statusLabel[status]}</p>
    </div>
    <div className="mt-1.5 text-sm text-foreground/75">{children}</div>
  </div>
);
