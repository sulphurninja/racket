"use client";

import { useState } from "react";
import { z } from "zod";
import { ArrowGlyph } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const emailSchema = z.email("Enter a valid email address");

/**
 * Newsletter capture. The email provider is wired in Phase 2; until then the
 * form validates and tells the visitor plainly that signups open soon rather
 * than pretending to subscribe them.
 */
export function NewsletterForm({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "error" | "notice"; message?: string }>({ kind: "idle" });
  const dark = tone === "dark";

  return (
    <form
      noValidate
      className={cn("w-full max-w-md", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = emailSchema.safeParse(email.trim());
        if (!parsed.success) {
          setState({ kind: "error", message: parsed.error.issues[0]?.message });
          return;
        }
        setState({ kind: "notice", message: "You're early — alerts open soon. We haven't stored your email yet." });
      }}
    >
      <label htmlFor={`nl-${tone}`} className="sr-only">
        Email address
      </label>
      <div
        className={cn(
          "flex h-14 items-center rounded-full pr-1.5 pl-5 ring-1 ring-inset transition-shadow",
          dark ? "bg-paper/5 ring-paper/15 focus-within:ring-paper/50" : "bg-paper ring-line-strong focus-within:ring-ink",
        )}
      >
        <input
          id={`nl-${tone}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state.kind !== "idle") setState({ kind: "idle" });
          }}
          placeholder="you@email.com"
          aria-invalid={state.kind === "error"}
          aria-describedby={`nl-${tone}-msg`}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-[15px] focus:outline-none",
            dark ? "placeholder:text-paper/35" : "placeholder:text-ink/35",
          )}
        />
        <button
          type="submit"
          className={cn(
            "group/btn inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
            dark ? "bg-paper text-ink hover:bg-white" : "bg-ink text-paper hover:bg-graphite",
          )}
        >
          Notify me <ArrowGlyph />
        </button>
      </div>
      <p
        id={`nl-${tone}-msg`}
        aria-live="polite"
        className={cn(
          "type-meta mt-3 min-h-[1rem] px-5 text-[11px]",
          state.kind === "error" ? "text-[#E2614B]" : dark ? "text-paper/55" : "text-ink/55",
        )}
      >
        {state.message ?? ""}
      </p>
    </form>
  );
}
