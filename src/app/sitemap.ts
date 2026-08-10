import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/arak", priority: 0.9, changeFrequency: "weekly" },
  { path: "/edzoink", priority: 0.7, changeFrequency: "monthly" },
  { path: "/galeria", priority: 0.5, changeFrequency: "monthly" },
  { path: "/kapcsolat", priority: 0.6, changeFrequency: "monthly" },
  { path: "/regisztracio", priority: 0.8, changeFrequency: "monthly" },
  { path: "/bejelentkezes", priority: 0.4, changeFrequency: "monthly" },
  { path: "/aszf", priority: 0.2, changeFrequency: "yearly" },
  { path: "/adatkezelesi-tajekoztato", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
