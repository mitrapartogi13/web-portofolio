"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { buttonClasses } from "./ui/Button";

export default function CopyEmailButton({
  email,
  tone = "paper",
}: {
  email: string;
  tone?: "paper" | "field";
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; the address is still selectable as text.
    }
  };

  const Icon = copied ? Check : Copy;

  return (
    <button
      type="button"
      onClick={copy}
      className={buttonClasses(tone === "field" ? "inverse" : "secondary", "self-start")}
    >
      <Icon aria-hidden className="size-4" strokeWidth={1.75} />
      <span aria-live="polite">{copied ? "Tersalin" : "Salin email"}</span>
    </button>
  );
}
