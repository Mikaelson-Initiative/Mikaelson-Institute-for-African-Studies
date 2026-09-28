"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./code-deck-input.module.css";

/**
 * The sign-in code field, with the "code deck" verify animation.
 *
 * Typing looks and behaves exactly like the plain input it replaces (same
 * classes, passed in by the page). Only when the code is submitted do the
 * digits lift out of the field as small cards, fan out, gather into one
 * card with a light running round its edge while the real check runs, then
 * either show a tick (verified) or shake and drop back into the field
 * (error). Typing itself never animates: it's keyboard input.
 */

export type DeckStatus = "idle" | "checking" | "verified" | "error";
type Stage = "cards" | "fan" | "stack";

const FAN_AT = 220;
const STACK_AT = 620;
// The verdict waits until the stack has formed, so a fast response never
// cuts the sequence off halfway.
const MIN_CHECK = 1150;
const VERIFIED_HOLD = 650;
const ERROR_HOLD = 700;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wraps a verify call with the deck's timing. Resolves true once the
 * verified moment has played (the page can move on), false after the error
 * shake (the page shows its error message).
 */
export function useCodeDeck() {
  const [status, setStatus] = useState<DeckStatus>("idle");
  const reduce = useReducedMotion() ?? false;

  const run = useCallback(
    async (verify: () => Promise<boolean>) => {
      setStatus("checking");
      const started = Date.now();
      let ok = false;
      try {
        ok = await verify();
      } catch {
        ok = false;
      }
      if (!reduce) await sleep(Math.max(0, MIN_CHECK - (Date.now() - started)));
      if (ok) {
        setStatus("verified");
        if (!reduce) await sleep(VERIFIED_HOLD);
        return true;
      }
      setStatus("error");
      await sleep(reduce ? 0 : ERROR_HOLD);
      setStatus("idle");
      return false;
    },
    [reduce],
  );

  return { status, run };
}

type CodeDeckInputProps = {
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  status: DeckStatus;
  className: string;
  placeholder?: string;
  maxLength?: number;
};

export function CodeDeckInput({
  id,
  value,
  onChange,
  status,
  className,
  placeholder = "000 000",
  // One more than the code, so a pasted "123 456" isn't cut short; the page
  // strips everything but digits.
  maxLength = 7,
}: CodeDeckInputProps) {
  const [stage, setStage] = useState<Stage>("cards");
  const inputRef = useRef<HTMLInputElement>(null);
  const previous = useRef<DeckStatus>(status);
  const deckRef = useRef<HTMLDivElement>(null);
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const busy = status !== "idle";

  // Measure how far each digit is from the centre, so the stack can gather
  // them exactly there. The digits sit where the input draws its own text,
  // so swapping the input's text for them is invisible.
  useLayoutEffect(() => {
    if (status !== "checking") return;
    const deck = deckRef.current;
    if (!deck) return;
    // offsetLeft is the layout position, unaffected by the transforms the
    // cards are already starting (getBoundingClientRect would include them).
    const centre = deck.clientWidth / 2;
    digitRefs.current.forEach((digit) => {
      if (!digit) return;
      digit.style.setProperty("--dx", `${digit.offsetLeft + digit.offsetWidth / 2 - centre}px`);
    });
  }, [status]);

  // Stages within "checking": cards appear, fan out, then gather.
  useEffect(() => {
    if (status !== "checking") return;
    const fan = setTimeout(() => setStage("fan"), FAN_AT);
    const stack = setTimeout(() => setStage("stack"), STACK_AT);
    return () => {
      clearTimeout(fan);
      clearTimeout(stack);
      setStage("cards");
    };
  }, [status]);

  // After a wrong code, select it so the next attempt simply replaces it.
  useEffect(() => {
    if (previous.current === "error" && status === "idle") inputRef.current?.select();
    previous.current = status;
  }, [status]);

  const digits = value.split("");
  const middle = (digits.length - 1) / 2;

  return (
    <div className={styles.wrap} data-status={status} data-stage={stage}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d*"
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        readOnly={busy}
        aria-busy={status === "checking"}
        className={`${className} ${busy ? styles.inputHidden : ""}`}
      />

      <div ref={deckRef} className={styles.deck} aria-hidden="true">
        {digits.map((digit, i) => (
          <span
            key={i}
            ref={(el) => {
              digitRefs.current[i] = el;
            }}
            className={styles.digit}
            data-top={i === digits.length - 1 || undefined}
            style={{ "--i": i, "--o": i - middle } as CSSProperties}
          >
            {digit}
          </span>
        ))}
        <span className={styles.burst}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} style={{ "--a": `${i * 36}deg` } as CSSProperties} />
          ))}
        </span>
        <svg className={styles.tick} viewBox="0 0 24 24">
          <path d="M6 12.5 L10.2 16.5 L18 8" pathLength={1} />
        </svg>
      </div>

      <span className="sr-only" aria-live="polite">
        {status === "checking" ? "Checking your code" : status === "verified" ? "Code verified" : ""}
      </span>
    </div>
  );
}
