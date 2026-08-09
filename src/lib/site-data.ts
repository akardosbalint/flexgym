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

export const CONTACT = {
  address: "1012 Budapest, Márvány utca 17.",
  phone: "+36 1 202 0070",
  email: "info@flexgym.hu",
};

export const PRICING = [
  { name: "1 alkalom", adult: 5000, student: null, validity: "—" },
  { name: "2 alkalom", adult: 8000, student: 7000, validity: "2 hét" },
  { name: "10 alkalom", adult: 29500, student: 25000, validity: "7 hét" },
  { name: "20 alkalom", adult: 45500, student: 39500, validity: "10 hét" },
  { name: "1 havi bérlet", adult: 31500, student: 26000, validity: "30 nap" },
  { name: "1 éves bérlet", adult: 315000, student: 260000, validity: "365 nap" },
];

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
