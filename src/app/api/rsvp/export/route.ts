import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { readRsvpsExcelBuffer, syncRsvpsToExcel } from "@/lib/rsvp-excel";
import { getRsvps } from "@/lib/rsvp-store";

function isValidExportSecret(provided: string | null): boolean {
  const expected = process.env.RSVP_EXPORT_SECRET;
  if (!expected || !provided) return false;

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!isValidExportSecret(key)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const rsvps = await getRsvps();
    await syncRsvpsToExcel(rsvps);
    const buffer = await readRsvpsExcelBuffer();

    const filename = `partecipazioni-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Errore durante l'esportazione." },
      { status: 500 },
    );
  }
}
