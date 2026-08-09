"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { ButtonEl } from "@/components/ui/button";

type ScanResult = {
  ok: boolean;
  memberName?: string;
  message: string;
  membershipValid?: boolean;
  membershipLabel?: string;
};

type RecentCheckIn = {
  id: string;
  memberName: string;
  checkedInAt: string;
  staffName: string | null;
};

const RESULT_DISPLAY_MS = 3000;
const RESCAN_COOLDOWN_MS = 5000;

export function QrScanner({ initialRecent }: { initialRecent: RecentCheckIn[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const busyRef = useRef(false);
  const lastCodeRef = useRef<{ code: string; at: number } | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [recent, setRecent] = useState<RecentCheckIn[]>(initialRecent);

  const submitCode = useCallback(async (code: string) => {
    if (busyRef.current) return;
    const last = lastCodeRef.current;
    if (last && last.code === code && Date.now() - last.at < RESCAN_COOLDOWN_MS) {
      return;
    }
    busyRef.current = true;
    lastCodeRef.current = { code, at: Date.now() };

    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const body = await res.json();

      if (!res.ok) {
        setResult({ ok: false, message: body?.error ?? "Ismeretlen hiba." });
      } else {
        setResult({
          ok: true,
          memberName: body.member.name,
          message: `${body.member.name} sikeresen beléptetve.`,
          membershipValid: body.membership.valid,
          membershipLabel: body.membership.valid
            ? `Aktív bérlet: ${body.membership.name}`
            : "Nincs érvényes bérlete!",
        });
        setRecent((prev) => [
          {
            id: `${Date.now()}`,
            memberName: body.member.name,
            checkedInAt: body.checkedInAt,
            staffName: null,
          },
          ...prev,
        ].slice(0, 15));
      }
    } catch {
      setResult({ ok: false, message: "Hálózati hiba, próbáld újra." });
    } finally {
      setTimeout(() => {
        busyRef.current = false;
        setResult(null);
      }, RESULT_DISPLAY_MS);
    }
  }, []);

  useEffect(() => {
    if (!cameraOn) return;

    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        tick();
      } catch {
        setCameraError("Nem sikerült elérni a kamerát. Engedélyezd a böngészőben, vagy használd a kézi bevitelt.");
        setCameraOn(false);
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code?.data) {
            void submitCode(code.data);
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [cameraOn, submitCode]);

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setManualLoading(true);
    await submitCode(manualCode.trim());
    setManualLoading(false);
    setManualCode("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-lg border border-paper-border bg-paper p-6">
        <h2 className="font-heading text-lg font-semibold text-paper-fg">Kamerás beolvasás</h2>

        <div className="relative mt-4 aspect-square w-full max-w-md overflow-hidden rounded-lg bg-ink">
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />

          {!cameraOn && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-dark">
              A kamera még nincs bekapcsolva.
            </div>
          )}

          {result && (
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center ${
                result.ok ? "bg-paper/95" : "bg-accent/95"
              }`}
            >
              <p className={`font-heading text-xl font-bold ${result.ok ? "text-paper-fg" : "text-white"}`}>
                {result.message}
              </p>
              {result.ok && (
                <p
                  className={`font-heading text-sm font-semibold uppercase ${
                    result.membershipValid ? "text-accent" : "text-accent"
                  }`}
                >
                  {result.membershipLabel}
                </p>
              )}
            </div>
          )}
        </div>

        {cameraError && <p className="mt-3 text-sm text-accent">{cameraError}</p>}

        <div className="mt-4">
          {cameraOn ? (
            <ButtonEl variant="outline-dark" onClick={() => setCameraOn(false)}>
              Kamera leállítása
            </ButtonEl>
          ) : (
            <ButtonEl variant="primary" onClick={() => { setCameraError(null); setCameraOn(true); }}>
              Kamera indítása
            </ButtonEl>
          )}
        </div>

        <form onSubmit={handleManualSubmit} className="mt-8 border-t border-paper-border pt-6">
          <label htmlFor="manual-code" className="text-sm font-medium text-paper-fg">
            Kézi kódbevitel
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="manual-code"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="pl. 4f82a91b"
              className="flex-1 rounded-md border border-paper-border bg-paper px-3.5 py-2.5 text-sm text-paper-fg outline-none focus:border-accent"
            />
            <ButtonEl type="submit" variant="dark" disabled={manualLoading}>
              {manualLoading ? "..." : "Beléptet"}
            </ButtonEl>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-paper-border bg-paper p-6">
        <h2 className="font-heading text-lg font-semibold text-paper-fg">Legutóbbi beléptetések</h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-muted-light">Még nincs rögzített beléptetés.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {recent.map((c) => (
              <li key={c.id} className="flex items-center justify-between border-b border-paper-border pb-3 text-sm last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-paper-fg">{c.memberName}</p>
                  {c.staffName && <p className="text-xs text-muted-light">Beolvasta: {c.staffName}</p>}
                </div>
                <span className="text-xs text-muted-light">
                  {new Date(c.checkedInAt).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
