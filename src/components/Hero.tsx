import { weddingConfig } from "@/lib/wedding-config";

export default function Hero() {
  return (
    <section className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/2.jpg')" }}
      />
      <div aria-hidden className="absolute inset-0 bg-black/55" />

      <p className="relative mb-6 text-sm uppercase tracking-[0.4em] text-cream/80">
        Ci sposiamo
      </p>

      <h1 className="relative font-serif text-6xl font-light leading-tight text-cream sm:text-8xl">
        {weddingConfig.bride}
        <span className="mx-4 inline-block font-normal text-gold">&</span>
        {weddingConfig.groom}
      </h1>

      <div className="relative my-10 flex items-center gap-4">
        <span className="h-px w-16 bg-gold/60" />
        <span className="font-serif text-xl italic text-cream/90 sm:text-2xl">
          {weddingConfig.dateLabel}
        </span>
        <span className="h-px w-16 bg-gold/60" />
      </div>

      <p className="relative max-w-md text-base leading-relaxed text-cream/75 sm:text-lg">
        {weddingConfig.message}
      </p>
    </section>
  );
}
