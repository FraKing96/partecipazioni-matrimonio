import { promises as fs } from "fs";
import path from "path";
import * as XLSX from "xlsx";
import type { RsvpRecord } from "@/types/rsvp";

const DATA_DIR = path.join(process.cwd(), "data");
export const EXCEL_FILE = path.join(DATA_DIR, "rsvps.xlsx");

function recordToRow(record: RsvpRecord) {
  const guestNames = Array.isArray(record.guestNames) ? record.guestNames : [];

  return {
    Data: new Date(record.createdAt).toLocaleString("it-IT"),
    Nome: record.name,
    Partecipa: record.attending ? "Sì" : "No",
    "N. accompagnatori": record.attending ? guestNames.length : 0,
    Accompagnatori: guestNames.join(", "),
    "Allergie / intolleranze": record.dietaryNotes || "",
    ID: record.id,
  };
}

const HEADERS = [
  "Data",
  "Nome",
  "Partecipa",
  "N. accompagnatori",
  "Accompagnatori",
  "Allergie / intoleranze",
  "ID",
] as const;

export async function syncRsvpsToExcel(rsvps: RsvpRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const rows = rsvps.map(recordToRow);
  const worksheet =
    rows.length > 0
      ? XLSX.utils.json_to_sheet(rows)
      : XLSX.utils.aoa_to_sheet([Array.from(HEADERS)]);
  worksheet["!cols"] = [
    { wch: 20 },
    { wch: 28 },
    { wch: 10 },
    { wch: 16 },
    { wch: 36 },
    { wch: 28 },
    { wch: 38 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Partecipazioni");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  await fs.writeFile(EXCEL_FILE, buffer);
}

export async function readRsvpsExcelBuffer(): Promise<Buffer> {
  try {
    return await fs.readFile(EXCEL_FILE);
  } catch {
    return Buffer.alloc(0);
  }
}
