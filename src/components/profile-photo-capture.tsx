"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ButtonEl } from "@/components/ui/button";
import { saveProfilePhoto } from "@/app/profilkep-keszites/actions";

const MAX_DIMENSION = 480;

export function ProfilePhotoCapture({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!cameraOn) return;

    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
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
      } catch {
        setCameraError(
          "Nem sikerült elérni a kamerát. Engedélyezd a böngészőben a kamera használatát a folytatáshoz.",
        );
        setCameraOn(false);
      }
    }

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [cameraOn]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setCapturedPhoto(canvas.toDataURL("image/jpeg", 0.8));
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  function retake() {
    setCapturedPhoto(null);
    setSaveError(null);
    setCameraError(null);
    setCameraOn(true);
  }

  function save() {
    if (!capturedPhoto) return;
    setSaveError(null);
    startTransition(async () => {
      const result = await saveProfilePhoto(capturedPhoto);
      if (result?.error) {
        setSaveError(result.error);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-ink">
        {capturedPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element -- small data: URI, no need for next/image optimization
          <img src={capturedPhoto} alt="Elkészített profilkép" className="h-full w-full object-cover" />
        ) : (
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
        )}

        {!cameraOn && !capturedPhoto && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-dark">
            A kamera még nincs bekapcsolva.
          </div>
        )}
      </div>

      {cameraError && <p className="mt-3 text-sm text-accent">{cameraError}</p>}
      {saveError && <p className="mt-3 text-sm text-accent">{saveError}</p>}

      <div className="mt-4 flex gap-3">
        {capturedPhoto ? (
          <>
            <ButtonEl variant="outline-light" onClick={retake} disabled={isPending}>
              Újra
            </ButtonEl>
            <ButtonEl variant="primary" onClick={save} disabled={isPending} className="flex-1">
              {isPending ? "Mentés..." : "Mentés"}
            </ButtonEl>
          </>
        ) : cameraOn ? (
          <ButtonEl variant="primary" onClick={capture} className="flex-1">
            Fénykép készítése
          </ButtonEl>
        ) : (
          <ButtonEl
            variant="primary"
            onClick={() => {
              setCameraError(null);
              setCameraOn(true);
            }}
            className="flex-1"
          >
            Kamera indítása
          </ButtonEl>
        )}
      </div>
    </div>
  );
}
