"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { TRAINER_CATEGORIES, TRAINERS, type TrainerCategory } from "@/lib/site-data";

export function TrainersGrid() {
  const [active, setActive] = useState<TrainerCategory>("erolet");
  const filtered = TRAINERS.filter((t) => t.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-paper-border">
        {TRAINER_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActive(cat.id)}
            className={clsx(
              "border-b-2 px-4 py-3 font-heading text-sm font-semibold tracking-wide uppercase transition-colors",
              active === cat.id
                ? "border-accent text-accent"
                : "border-transparent text-muted-light hover:text-paper-fg",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <p className="rounded-lg border border-paper-border bg-paper-2 p-6 text-sm text-muted-light">
            Ebben a kategóriában hamarosan bővül a csapat.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((trainer) => (
              <div
                key={trainer.name}
                className="group rounded-lg border border-paper-border bg-paper-2 p-6 transition-colors hover:border-accent"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent font-display text-2xl text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  {trainer.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-paper-fg">
                  {trainer.name}
                </h3>
                <p className="mt-1 text-sm text-muted-light">{trainer.specialty}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
