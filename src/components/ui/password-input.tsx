"use client";

import { useId, useState } from "react";

export function PasswordInput({
  id,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={inputId}
        type={visible ? "text" : "password"}
        className={
          className ??
          "mt-1.5 w-full border-b border-paper-border bg-transparent px-1 py-2.5 pr-9 text-sm text-paper-fg outline-none focus:border-accent"
        }
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
        aria-pressed={visible}
        className="absolute top-1/2 right-1 -translate-y-1/2 rounded-sm p-1.5 text-muted-light hover:text-paper-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2.5 2.5l15 15M8.3 8.4a2.5 2.5 0 0 0 3.4 3.4M5.6 5.7C3.3 7.1 1.5 10 1.5 10s3 6 8.5 6c1.5 0 2.8-.4 3.9-1M15.1 14.1c1.9-1.4 3.4-4.1 3.4-4.1s-3-6-8.5-6c-.9 0-1.7.1-2.5.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
