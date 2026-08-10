"use client";

import { useState } from "react";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load QR image"));
    img.src = src;
  });
}

export function QrSaveButton({
  qrDataUrl,
  memberName,
  memberEmail,
  siteHost,
}: {
  qrDataUrl: string;
  memberName: string;
  memberEmail: string;
  siteHost: string;
}) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const width = 480;
      const height = 680;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#e0121f";
      ctx.font = "600 18px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(siteHost, width / 2, 52);

      const qrImage = await loadImage(qrDataUrl);
      const qrSize = 340;
      const qrX = (width - qrSize) / 2;
      const qrY = 84;
      ctx.strokeStyle = "#e6e6e9";
      ctx.lineWidth = 1;
      ctx.strokeRect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2);
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      ctx.fillStyle = "#18181b";
      ctx.font = "700 24px Arial, sans-serif";
      ctx.fillText(memberName, width / 2, qrY + qrSize + 52);

      ctx.fillStyle = "#6b6b72";
      ctx.font = "16px Arial, sans-serif";
      ctx.fillText(memberEmail, width / 2, qrY + qrSize + 80);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "forge-gym-belepokod.jpg";
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-ink-2 disabled:opacity-60"
    >
      <DownloadIcon /> {saving ? "Mentés..." : "QR kód lementése fotóként"}
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
