"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { weddingConfig } from "@/lib/wedding-config";

type Phase = "idle" | "opening" | "revealing" | "done";

const REVEAL_AFTER_OPEN_MS = 3400;
const DONE_AFTER_OPEN_MS = 4600;

function BotanicalCorner({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 95C28 72 42 48 38 18M38 18C52 34 68 42 88 36M38 18C24 38 18 62 22 88"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <ellipse cx="38" cy="18" rx="5" ry="8" fill="currentColor" opacity="0.35" />
      <ellipse cx="88" cy="36" rx="4" ry="7" fill="currentColor" opacity="0.25" />
      <ellipse cx="22" cy="88" rx="4" ry="7" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

const ENVELOPE_WIDTH = 400;
const ENVELOPE_HEIGHT = 320;
const ENVELOPE_HINGE = 105;
const ENVELOPE_ROOF = 12;
const ENVELOPE_CENTER = 190;
const ENVELOPE_FLOOR = 306;

function EnvelopeDefs({ idPrefix }: { idPrefix: string }) {
  return (
    <defs>
      <linearGradient id={`${idPrefix}-satin-green-back`} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#7c9275" />
        <stop offset="55%" stopColor="#657b5e" />
        <stop offset="100%" stopColor="#53644d" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-satin-green-dark`} x1="0%" y1="20%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5c7156" />
        <stop offset="55%" stopColor="#53664e" />
        <stop offset="100%" stopColor="#4a5a46" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-satin-green-light`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7a9173" />
        <stop offset="72%" stopColor="#6b8264" />
        <stop offset="100%" stopColor="#647c5e" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-satin-green-front`} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#708866" />
        <stop offset="60%" stopColor="#5f7358" />
        <stop offset="100%" stopColor="#52624d" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-satin-sheen`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.06" />
        <stop offset="38%" stopColor="white" stopOpacity="0.1" />
        <stop offset="62%" stopColor="white" stopOpacity="0.03" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <filter id={`${idPrefix}-satin-texture`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.75"
          numOctaves="3"
          seed="4"
          result="noise"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.45  0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 0.035 0"
          in="noise"
          result="grain"
        />
        <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
      </filter>
      <filter id={`${idPrefix}-envelope-crease-shadow`} x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#233227" floodOpacity="0.22" />
      </filter>
    </defs>
  );
}

function EnvelopeShapeBack({ isOpening }: { isOpening: boolean }) {
  const idPrefix = "env-back";

  return (
    <svg
      className="envelope__shape envelope__shape--back"
      viewBox={`0 0 ${ENVELOPE_WIDTH} ${ENVELOPE_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <EnvelopeDefs idPrefix={idPrefix} />

      <g filter={`url(#${idPrefix}-satin-texture)`}>
        {!isOpening ? (
          <>
            <path
              className="envelope__svg-shell"
              d={`M0 ${ENVELOPE_HINGE} H${ENVELOPE_WIDTH} V${ENVELOPE_FLOOR} H0 Z`}
              fill={`url(#${idPrefix}-satin-green-back)`}
            />
            <path
              className="envelope__svg-flap-closed"
              d={`M0 ${ENVELOPE_HINGE} L200 ${ENVELOPE_CENTER} L${ENVELOPE_WIDTH} ${ENVELOPE_HINGE} Z`}
              fill={`url(#${idPrefix}-satin-green-light)`}
              filter={`url(#${idPrefix}-envelope-crease-shadow)`}
            />
            <path
              className="envelope__svg-fold-left"
              d={`M0 ${ENVELOPE_HINGE} L200 ${ENVELOPE_CENTER} L0 ${ENVELOPE_FLOOR} Z`}
              fill={`url(#${idPrefix}-satin-green-dark)`}
              opacity="0.86"
            />
            <path
              className="envelope__svg-fold-right"
              d={`M${ENVELOPE_WIDTH} ${ENVELOPE_HINGE} L200 ${ENVELOPE_CENTER} L${ENVELOPE_WIDTH} ${ENVELOPE_FLOOR} Z`}
              fill={`url(#${idPrefix}-satin-green-light)`}
              opacity="0.86"
            />
            <path
              d={`M0 ${ENVELOPE_HINGE} L200 ${ENVELOPE_CENTER} L${ENVELOPE_WIDTH} ${ENVELOPE_HINGE}`}
              fill="none"
              stroke="rgba(255,255,255,0.13)"
              strokeWidth="1"
            />
          </>
        ) : (
          <>
            <path
              className="envelope__svg-body"
              d={`M0 ${ENVELOPE_HINGE} H${ENVELOPE_WIDTH} V${ENVELOPE_FLOOR} H0 Z`}
              fill={`url(#${idPrefix}-satin-green-back)`}
            />
            <path
              className="envelope__svg-fold-left"
              d={`M0 ${ENVELOPE_HINGE} L200 ${ENVELOPE_CENTER} L0 ${ENVELOPE_FLOOR} Z`}
              fill={`url(#${idPrefix}-satin-green-dark)`}
            />
            <path
              className="envelope__svg-fold-right"
              d={`M${ENVELOPE_WIDTH} ${ENVELOPE_HINGE} L200 ${ENVELOPE_CENTER} L${ENVELOPE_WIDTH} ${ENVELOPE_FLOOR} Z`}
              fill={`url(#${idPrefix}-satin-green-light)`}
            />
            <path
              className="envelope__svg-flap-open"
              d={`M0 ${ENVELOPE_HINGE} L200 ${ENVELOPE_ROOF} L${ENVELOPE_WIDTH} ${ENVELOPE_HINGE} Z`}
              fill={`url(#${idPrefix}-satin-green-light)`}
              filter={`url(#${idPrefix}-envelope-crease-shadow)`}
            />
            <path
              d={`M0 ${ENVELOPE_HINGE} L200 ${ENVELOPE_CENTER} L${ENVELOPE_WIDTH} ${ENVELOPE_HINGE}`}
              fill="none"
              stroke="rgba(255,255,255,0.13)"
              strokeWidth="1"
            />
          </>
        )}
      </g>
      {isOpening && (
        <path
          className="envelope__svg-flap-closed"
          filter={`url(#${idPrefix}-satin-texture)`}
          d={`M0 ${ENVELOPE_HINGE} L200 ${ENVELOPE_CENTER} L${ENVELOPE_WIDTH} ${ENVELOPE_HINGE} Z`}
          fill={`url(#${idPrefix}-satin-green-light)`}
        />
      )}
      <path
        d={
          isOpening
            ? `M0 ${ENVELOPE_HINGE} L200 ${ENVELOPE_ROOF} L${ENVELOPE_WIDTH} ${ENVELOPE_HINGE} V${ENVELOPE_FLOOR} H0 Z`
            : `M0 ${ENVELOPE_HINGE} H${ENVELOPE_WIDTH} V${ENVELOPE_FLOOR} H0 Z`
        }
        fill={`url(#${idPrefix}-satin-sheen)`}
        opacity="0.55"
        pointerEvents="none"
      />
    </svg>
  );
}

function EnvelopeShapeFront() {
  const idPrefix = "env-front";

  return (
    <svg
      className="envelope__shape envelope__shape--front"
      viewBox={`0 0 ${ENVELOPE_WIDTH} ${ENVELOPE_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <EnvelopeDefs idPrefix={idPrefix} />

      <g filter={`url(#${idPrefix}-satin-texture)`}>
        <path
          className="envelope__svg-front-pocket"
          d={`M0 ${ENVELOPE_FLOOR} L200 ${ENVELOPE_CENTER} L${ENVELOPE_WIDTH} ${ENVELOPE_FLOOR} Z`}
          fill={`url(#${idPrefix}-satin-green-front)`}
          filter={`url(#${idPrefix}-envelope-crease-shadow)`}
        />
        <path
          d={`M0 ${ENVELOPE_FLOOR} L200 ${ENVELOPE_CENTER} L${ENVELOPE_WIDTH} ${ENVELOPE_FLOOR}`}
          fill="none"
          stroke="rgba(35,50,39,0.16)"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

function shouldSkipSplash() {
  if (typeof window === "undefined") return false;
  return window.location.hash === "#rsvp";
}

export default function LetterSplash({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [skip, setSkip] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setPhase("done");
    setSkip(true);
  }, [clearTimers]);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
  }, []);

  const startOpening = useCallback(() => {
    setPhase((current) => {
      if (current !== "idle") return current;

      schedule(() => setPhase("revealing"), REVEAL_AFTER_OPEN_MS);
      schedule(finish, DONE_AFTER_OPEN_MS);
      return "opening";
    });
  }, [schedule, finish]);

  const handleActivate = useCallback(() => {
    if (phase === "idle") {
      startOpening();
      return;
    }

    if (phase === "opening" || phase === "revealing") {
      finish();
    }
  }, [phase, startOpening, finish]);

  useEffect(() => {
    if (shouldSkipSplash()) {
      finish();
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      finish();
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      clearTimers();
      document.body.style.overflow = "";
    };
  }, [finish, clearTimers]);

  useEffect(() => {
    if (phase === "done") {
      document.body.style.overflow = "";
    }
  }, [phase]);

  if (skip) {
    return <div className="content-reveal">{children}</div>;
  }

  return (
    <>
      <div
        className="pointer-events-none opacity-0"
        aria-hidden={phase !== "done"}
      >
        {children}
      </div>

      <button
        type="button"
        className={`letter-splash fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-400 ${
          phase === "opening" || phase === "revealing"
            ? "letter-splash--glowing"
            : ""
        } ${phase === "revealing" ? "letter-splash--exit" : ""}`}
        aria-label="Apri l'invito"
        onClick={handleActivate}
      >
        <BotanicalCorner className="letter-splash__botanical letter-splash__botanical--tl" />
        <BotanicalCorner className="letter-splash__botanical letter-splash__botanical--tr" />
        <BotanicalCorner className="letter-splash__botanical letter-splash__botanical--bl" />
        <BotanicalCorner className="letter-splash__botanical letter-splash__botanical--br" />

        <div
          className={`letter-splash__glow ${
            phase === "opening" || phase === "revealing"
              ? "letter-splash__glow--active"
              : ""
          } ${phase === "revealing" ? "letter-splash__glow--full" : ""}`}
          aria-hidden
        />

        <div className="letter-splash__content">
          <div
            className={`envelope ${phase === "opening" || phase === "revealing" ? "envelope--opening" : ""} ${
              phase === "revealing" ? "envelope--revealing" : ""
            }`}
          >
            <EnvelopeShapeBack
              isOpening={phase === "opening" || phase === "revealing"}
            />

            <div className="envelope__card">
              <p className="envelope__reserved">Benvenuti al matrimonio di</p>
              <p className="envelope__card-names">
                {weddingConfig.bride}
                <span className="envelope__amp">&</span>
                {weddingConfig.groom}
              </p>
              <p className="envelope__card-date">{weddingConfig.dateLabel}</p>
            </div>

            <EnvelopeShapeFront />

            <div className="envelope__closed-label">
              {/* <p className="envelope__reserved">Invito riservato a</p> */}
              <p className="envelope__closed-names">
                {weddingConfig.bride} & {weddingConfig.groom}
              </p>
            </div>
          </div>

          {phase === "idle" && (
            <p className="letter-splash__hint">Tocca per aprire</p>
          )}
        </div>
      </button>
    </>
  );
}
