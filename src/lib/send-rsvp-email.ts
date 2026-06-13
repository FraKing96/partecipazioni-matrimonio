import nodemailer from "nodemailer";
import type { RsvpRecord } from "@/types/rsvp";
import { weddingConfig } from "@/lib/wedding-config";

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_USER e SMTP_PASS non configurati");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_PORT === "465",
    auth: { user, pass },
  });
}

function getGuestNames(record: RsvpRecord): string[] {
  return Array.isArray(record.guestNames) ? record.guestNames : [];
}

function buildGuestNamesHtml(names: string[]): string {
  if (names.length === 0) {
    return "<p><strong>Accompagnatori:</strong> Nessuno</p>";
  }

  const items = names.map((name) => `<li>${name}</li>`).join("");
  return `
    <p><strong>Accompagnatori (${names.length}):</strong></p>
    <ul style="margin:4px 0 0;padding-left:20px">${items}</ul>
  `;
}

function buildGuestNamesText(names: string[]): string {
  if (names.length === 0) return "Accompagnatori: Nessuno";
  return [
    `Accompagnatori (${names.length}):`,
    ...names.map((name, i) => `  ${i + 1}. ${name}`),
  ].join("\n");
}

function buildEmailHtml(record: RsvpRecord): string {
  const status = record.attending ? "Parteciperà" : "Non parteciperà";
  const guestNames = getGuestNames(record);
  const guests = record.attending ? buildGuestNamesHtml(guestNames) : "";
  const dietary = record.dietaryNotes
    ? `<p><strong>Allergie / intoleranze:</strong> ${record.dietaryNotes}</p>`
    : "";

  return `
    <h2>Nuova conferma — ${weddingConfig.bride} & ${weddingConfig.groom}</h2>
    <p><strong>Nome:</strong> ${record.name}</p>
    <p><strong>Stato:</strong> ${status}</p>
    ${guests}
    ${dietary}
    <p style="color:#888;font-size:12px;margin-top:24px">
      Ricevuto il ${new Date(record.createdAt).toLocaleString("it-IT")}
    </p>
  `;
}

export async function sendRsvpNotification(record: RsvpRecord): Promise<void> {
  const to = process.env.RSVP_NOTIFY_EMAIL ?? "palmeri.ravines@gmail.com";
  const from = process.env.SMTP_USER;

  if (!from) {
    throw new Error("SMTP_USER non configurato");
  }

  const transporter = getTransporter();
  const name = record.name;
  const guestNames = getGuestNames(record);
  const subject = record.attending
    ? guestNames.length > 0
      ? `✓ ${name} conferma (+${guestNames.length} accompagnator${guestNames.length === 1 ? "e" : "i"})`
      : `✓ ${name} conferma la partecipazione`
    : `✗ ${name} non potrà partecipare`;

  await transporter.sendMail({
    from: `"Partecipazioni Matrimonio" <${from}>`,
    to,
    subject,
    html: buildEmailHtml(record),
    text: [
      `Nuova conferma — ${weddingConfig.bride} & ${weddingConfig.groom}`,
      `Nome: ${name}`,
      `Stato: ${record.attending ? "Parteciperà" : "Non parteciperà"}`,
      record.attending ? buildGuestNamesText(guestNames) : null,
      record.dietaryNotes
        ? `Allergie / intolleranze: ${record.dietaryNotes}`
        : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
