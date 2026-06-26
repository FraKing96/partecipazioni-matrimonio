import { weddingConfig } from "@/lib/wedding-config";

type EventCardProps = {
  time: string;
  label: string;
  venue: string;
  address: string;
  mapsUrl: string;
};

function EventCard({ time, label, venue, address, mapsUrl }: EventCardProps) {
  return (
    <div className="flex flex-col items-center rounded-sm border border-pink/25 bg-white/75 p-8 text-center shadow-sm backdrop-blur-sm">
      <span className="font-serif text-3xl font-medium text-charcoal">{time}</span>
      <h3 className="mt-2 font-serif text-xl text-charcoal">{label}</h3>
      <p className="mt-4 font-medium text-charcoal">{venue}</p>
      <p className="mt-1 text-sm text-charcoal/60">{address}</p>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 text-xs uppercase tracking-[0.2em] text-sage underline-offset-4 transition-colors hover:text-pink hover:underline"
      >
        Apri mappa
      </a>
    </div>
  );
}

export default function EventDetails() {
  return (
    <section className="relative px-6 py-20">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/1.jpg')" }}
      />
      <div aria-hidden className="absolute inset-0 bg-cream/82" />

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sage">
          Il programma
        </p>
        <h2 className="font-serif text-4xl font-light text-charcoal">
          Dove e quando
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <EventCard {...weddingConfig.ceremony} />
          <EventCard {...weddingConfig.reception} />
        </div>
      </div>
    </section>
  );
}
