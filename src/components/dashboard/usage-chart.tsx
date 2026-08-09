"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function UsageChart({ data }: { data: { label: string; alkalom: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--paper-border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--muted-light)", fontSize: 12 }}
            axisLine={{ stroke: "var(--paper-border)" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--muted-light)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ fill: "var(--paper-2)" }}
            contentStyle={{
              background: "var(--paper)",
              border: "1px solid var(--paper-border)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--paper-fg)",
            }}
            labelStyle={{ color: "var(--muted-light)" }}
          />
          <Bar dataKey="alkalom" name="Alkalmak" fill="var(--accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
