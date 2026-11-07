"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

const field =
  "h-11 w-full rounded-[2px] border border-rule bg-paper px-3 text-ink transition-colors duration-[var(--dur-1)] hover:border-ink-3 focus:border-signal focus-visible:outline-offset-0";

/** No backend: the message is handed to the visitor's own mail client. */
export default function ContactForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const from = String(data.get("email") ?? "");
    const subject = String(data.get("subject") ?? "") || `Pesan dari ${name}`;
    const message = String(data.get("message") ?? "");
    const body = `${message}\n\n—\n${name}\n${from}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-label text-ink-3">
            Nama lengkap
          </label>
          <input id="name" name="name" required autoComplete="name" className={`mt-2 ${field}`} />
        </div>
        <div>
          <label htmlFor="email" className="text-label text-ink-3">
            Alamat email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`mt-2 ${field}`}
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="text-label text-ink-3">
          Subjek / topik <span className="normal-case">(opsional)</span>
        </label>
        <input id="subject" name="subject" className={`mt-2 ${field}`} />
      </div>
      <div>
        <label htmlFor="message" className="text-label text-ink-3">
          Pesan
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={`mt-2 ${field} h-auto resize-y py-3`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className={buttonClasses("primary")}>
          Kirim lewat email
          <Send aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
        <p aria-live="polite" className="text-sm text-ink-2">
          {sent ? "Aplikasi email Anda sedang dibuka…" : ""}
        </p>
      </div>
    </form>
  );
}
