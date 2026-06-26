"use client";

import { useEffect, useState } from "react";
import { weddingConfig } from "@/lib/wedding-config";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const EMPTY: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return EMPTY;
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-serif text-4xl font-light tabular-nums text-charcoal sm:text-5xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs uppercase tracking-[0.2em] text-sage">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(EMPTY);

  useEffect(() => {
    const target = new Date(`${weddingConfig.date}T16:00:00`);
    setTimeLeft(getTimeLeft(target));
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 text-center">
      <p className="mb-8 text-sm uppercase tracking-[0.3em] text-sage">
        Mancano
      </p>
      <div className="flex justify-center gap-6 sm:gap-10">
        <Unit value={timeLeft.days} label="Giorni" />
        <span className="font-serif text-3xl text-pink/50">:</span>
        <Unit value={timeLeft.hours} label="Ore" />
        <span className="font-serif text-3xl text-pink/50">:</span>
        <Unit value={timeLeft.minutes} label="Min" />
        <span className="font-serif text-3xl text-pink/50 inline">:</span>
        <div className="block">
          <Unit value={timeLeft.seconds} label="Sec" />
        </div>
      </div>
    </section>
  );
}
