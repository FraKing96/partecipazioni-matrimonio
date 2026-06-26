"use client";

import { FormEvent, useState } from "react";
import { weddingConfig } from "@/lib/wedding-config";

const MAX_GUESTS = 4;

type FormState = {
  name: string;
  attending: "yes" | "no" | "";
  guests: number;
  guestNames: string[];
  dietaryNotes: string;
};

const initialState: FormState = {
  name: "",
  attending: "",
  guests: 0,
  guestNames: [],
  dietaryNotes: "",
};

function resizeGuestNames(count: number, current: string[]): string[] {
  if (count <= current.length) return current.slice(0, count);
  return [...current, ...Array(count - current.length).fill("")];
}

export default function RsvpForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "attending" && value === "no") {
        next.guests = 0;
        next.guestNames = [];
      }
      if (key === "guests" && typeof value === "number") {
        next.guestNames = resizeGuestNames(value, prev.guestNames);
      }
      return next;
    });
  }

  function updateGuestName(index: number, name: string) {
    setForm((prev) => {
      const guestNames = [...prev.guestNames];
      guestNames[index] = name;
      return { ...prev, guestNames };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const attending = form.attending === "yes";
    const guestNames = attending
      ? form.guestNames.map((n) => n.trim()).filter(Boolean)
      : [];

    if (attending && form.guests > 0 && guestNames.length !== form.guests) {
      setStatus("error");
      setErrorMessage("Inserisci il nome di ogni accompagnatore.");
      return;
    }

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          attending,
          guestNames,
          dietaryNotes: attending ? form.dietaryNotes : "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Errore durante l'invio");
      }

      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Errore imprevisto");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-sm border border-gold/30 bg-white/70 p-10 text-center backdrop-blur-sm">
        <span className="font-serif text-5xl text-gold">✦</span>
        <h3 className="mt-4 font-serif text-2xl text-charcoal">Grazie!</h3>
        <p className="mt-3 text-charcoal/70">
          La tua risposta è stata registrata. Non vediamo l&apos;ora di festeggiare
          insieme a te!
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm uppercase tracking-[0.2em] text-sage underline-offset-4 hover:underline"
        >
          Invia un&apos;altra risposta
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-6 rounded-sm border border-gold/20 bg-white/70 p-8 backdrop-blur-sm sm:p-10"
    >
      <Field label="Nome e cognome" required>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className={inputClass}
          placeholder="Mario Rossi"
        />
      </Field>

      <Field label="Parteciperai?" required>
        <div className="flex gap-4">
          {(["yes", "no"] as const).map((value) => (
            <label
              key={value}
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-sm border px-4 py-3 text-sm transition-colors ${
                form.attending === value
                  ? "border-gold bg-gold/10 text-charcoal"
                  : "border-gold/20 text-charcoal/60 hover:border-gold/40"
              }`}
            >
              <input
                type="radio"
                name="attending"
                value={value}
                required
                checked={form.attending === value}
                onChange={() => updateField("attending", value)}
                className="sr-only"
              />
              {value === "yes" ? "Sì, ci sarò!" : "Purtroppo no"}
            </label>
          ))}
        </div>
      </Field>

      {form.attending === "yes" && (
        <Field label="Accompagnatori (oltre a te)">
          <select
            value={form.guests}
            onChange={(e) => updateField("guests", Number(e.target.value))}
            className={inputClass}
          >
            {Array.from({ length: MAX_GUESTS + 1 }, (_, n) => (
              <option key={n} value={n}>
                {n === 0 ? "Nessuno" : n}
              </option>
            ))}
          </select>
        </Field>
      )}

      {form.attending === "yes" &&
        form.guestNames.map((name, index) => (
          <Field key={index} label={`Nome accompagnatore ${index + 1}`} required>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => updateGuestName(index, e.target.value)}
              className={inputClass}
              placeholder="Nome e cognome"
            />
          </Field>
        ))}

      {form.attending === "yes" && (
        <Field label="Allergie o intolleranze alimentari">
          <textarea
            value={form.dietaryNotes}
            onChange={(e) => updateField("dietaryNotes", e.target.value)}
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="Es. celiachia, vegetariano..."
          />
        </Field>
      )}

      {status === "error" && (
        <p className="text-center text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-sm bg-sage px-6 py-4 text-sm uppercase tracking-[0.25em] text-cream transition-colors hover:bg-sage/90 disabled:opacity-50"
      >
        {status === "loading" ? "Invio in corso..." : "Conferma partecipazione"}
      </button>

      <p className="text-center text-xs text-charcoal/50">
        Conferma entro il {weddingConfig.rsvpDeadlineLabel}
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-sage">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-sm border border-gold/20 bg-cream/50 px-4 py-3 text-charcoal placeholder:text-charcoal/30 outline-none transition-colors focus:border-gold/50 focus:bg-white";
