import { promises as fs } from "fs";
import path from "path";
import type { RsvpRecord, RsvpPayload } from "@/types/rsvp";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "rsvps.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    if (raw.trim()) return;
  } catch {
    // file missing — create below
  }
  await fs.writeFile(DATA_FILE, "[]", "utf-8");
}

export async function getRsvps(): Promise<RsvpRecord[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const trimmed = raw.trim();
  if (!trimmed) return [];

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      await fs.writeFile(DATA_FILE, "[]", "utf-8");
      return [];
    }
    return parsed as RsvpRecord[];
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
    return [];
  }
}

export async function saveRsvp(payload: RsvpPayload): Promise<RsvpRecord> {
  const rsvps = await getRsvps();
  const record: RsvpRecord = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  rsvps.push(record);
  await fs.writeFile(DATA_FILE, JSON.stringify(rsvps, null, 2), "utf-8");
  return record;
}
