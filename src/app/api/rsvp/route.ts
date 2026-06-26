import { NextResponse } from "next/server";
import { saveRsvp } from "@/lib/rsvp-store";
import { sendRsvpNotification } from "@/lib/send-rsvp-email";
import type { RsvpPayload } from "@/types/rsvp";

const MAX_GUESTS = 4;

function validate(body: unknown): body is RsvpPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  if (
    typeof b.name !== "string" ||
    b.name.trim().length === 0 ||
    typeof b.attending !== "boolean" ||
    !Array.isArray(b.guestNames) ||
    typeof b.dietaryNotes !== "string"
  ) {
    return false;
  }

  if (b.guestNames.length > MAX_GUESTS) return false;
  if (!b.guestNames.every((n) => typeof n === "string")) return false;

  if (!b.attending) {
    return b.guestNames.length === 0;
  }

  if (b.guestNames.length === 0) return true;

  return b.guestNames.every((n) => (n as string).trim().length > 0);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!validate(body)) {
      return NextResponse.json(
        { error: "Dati non validi. Controlla i campi obbligatori." },
        { status: 400 },
      );
    }

    const record = await saveRsvp({
      name: body.name.trim(),
      attending: body.attending,
      guestNames: body.attending
        ? body.guestNames.map((n: string) => n.trim())
        : [],
      dietaryNotes: body.attending ? body.dietaryNotes.trim() : "",
    });

    try {
      await sendRsvpNotification(record);
    } catch (err) {
      console.error("Invio email RSVP fallito:", err);
    }

    return NextResponse.json({ success: true, id: record.id });
  } catch {
    return NextResponse.json(
      { error: "Errore nel salvataggio. Riprova più tardi." },
      { status: 500 },
    );
  }
}
