export const NAV_LINKS = [
  { href: "/", label: "Kezdőlap" },
  { href: "/arak", label: "Árak" },
  { href: "/galeria", label: "Galéria" },
  { href: "/edzoink", label: "Edzőink" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

export const OPENING_HOURS = [
  { day: "Hétfő", hours: "06:00 – 22:00" },
  { day: "Kedd", hours: "06:00 – 22:00" },
  { day: "Szerda", hours: "06:00 – 22:00" },
  { day: "Csütörtök", hours: "06:00 – 22:00" },
  { day: "Péntek", hours: "06:00 – 22:00" },
  { day: "Szombat", hours: "08:00 – 22:00" },
  { day: "Vasárnap", hours: "08:00 – 20:00" },
];

export const BRAND = {
  name: "Forge Gym",
  short: "Forge",
  tagline: "Ahol az erő formát ölt.",
};

export const CONTACT = {
  address: "1134 Budapest, Váci út 47.",
  phone: "+36 1 789 4521",
  email: "info@forgegym.hu",
};

export const FREE_PERKS = [
  { label: "Finn szauna", icon: "sauna" },
  { label: "Értékmegőrző", icon: "lock" },
  { label: "Zuhanyzó", icon: "shower" },
  { label: "Privát parkoló", icon: "parking" },
];

export type TrainerCategory = "erolet" | "kuzdosport" | "masszazs";

export const TRAINER_CATEGORIES: { id: TrainerCategory; label: string }[] = [
  { id: "erolet", label: "Erőnléti" },
  { id: "kuzdosport", label: "Küzdősport" },
  { id: "masszazs", label: "Masszázs" },
];

export const TRAINERS: {
  name: string;
  category: TrainerCategory;
  specialty: string;
}[] = [
  { name: "Kántor Kristóf", category: "erolet", specialty: "Testépítés, erőnlét" },
  { name: "Székely Ivett", category: "erolet", specialty: "Alakformálás, funkcionális edzés" },
  { name: "Illés Titanilla", category: "erolet", specialty: "Fitnesz, személyi edzés" },
  { name: "Marton Eni", category: "erolet", specialty: "TRX, core edzés" },
  { name: "Mészáros Patrik", category: "erolet", specialty: "Testépítés, erőnlét" },
  { name: "Komáromi Anna", category: "erolet", specialty: "Fogyókúra, kardió" },
  { name: "Fekete Tamás", category: "erolet", specialty: "Erőnléti edzés" },
  { name: "Lajsz Gergely", category: "kuzdosport", specialty: "Box, kickbox" },
  { name: "Balatoni Alexa", category: "masszazs", specialty: "Sportmasszázs" },
  { name: "Kádas Gergő", category: "erolet", specialty: "Testépítés" },
];
