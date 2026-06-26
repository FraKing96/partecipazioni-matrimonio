import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import EventDetails from "@/components/EventDetails";
import RsvpForm from "@/components/RsvpForm";
import Footer from "@/components/Footer";
import BackgroundMusic from "@/components/BackgroundMusic";
import LetterSplash from "@/components/LetterSplash";

export default function Home() {
  return (
    <LetterSplash>
    <div className="relative overflow-hidden">
      <BackgroundMusic />

      <Hero />
      <Countdown />

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <EventDetails />

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <section id="rsvp" className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sage">
            Partecipazione
          </p>
          <h2 className="font-serif text-4xl font-light text-charcoal">
            Conferma la tua presenza
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-charcoal/60">
            Compila il modulo qui sotto per farci sapere se potrai unirti a noi
            in questo giorno speciale.
          </p>
          <div className="mt-12">
            <RsvpForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </LetterSplash>
  );
}
