import { weddingConfig } from "@/lib/wedding-config";

export default function Footer() {
  return (
    <footer className="relative px-6 py-16 text-center">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/3.jpg')" }}
      />
      <div aria-hidden className="absolute inset-0 bg-black/50" />

      <div className="relative">
        <p className="font-serif text-2xl text-cream">
          {weddingConfig.bride} & {weddingConfig.groom}
        </p>
        <p className="mt-2 text-sm text-cream/75">{weddingConfig.dateLabel}</p>
        <p className="mt-6 text-xs text-cream/60">
          Con amore, per il nostro giorno speciale
        </p>
      </div>
    </footer>
  );
}
