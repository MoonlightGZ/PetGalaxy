"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Bell, CalendarClock, Camera, Cat, ChevronLeft, ClipboardList, DatabaseZap, Dog, Download,
  FileHeart, FileText, Menu, Moon, PawPrint, Plus, Search, Settings, ShieldCheck, Sparkles, Stethoscope,
  Sun, Syringe, UploadCloud, X
} from "lucide-react";
import { AuthPanel } from "@/components/auth-panel";
import { Badge, Button, Card, Field, inputClass } from "@/components/ui";
import { breedsForSpecies } from "@/lib/breeds";
import { extractionStages } from "@/lib/ai-providers";
import { speciesOptions } from "@/lib/schemas";

const timeline = [
  { date: "2026-05-12", pet: "Luna", type: "Vaccine", title: "Rabies 1-year", icon: Syringe, color: "text-emerald-500", meta: "Next due May 2027 · Batch RB-4421" },
  { date: "2026-04-02", pet: "Orion", type: "Diagnostic", title: "Comprehensive bloodwork", icon: ClipboardList, color: "text-blue-500", meta: "CBC normal · Vet notes attached" },
  { date: "2026-03-18", pet: "Luna", type: "Medication", title: "Parasite prevention", icon: Stethoscope, color: "text-violet-500", meta: "Monthly chewable · Clinic: North Star Vet" }
];

const gallery = ["Growth", "Healing", "Dental", "Post-op"];

function Sidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const nav = [
    ["Dashboard Home", PawPrint], ["Pet Profiles", Dog], ["Document AI Vault", FileHeart],
    ["Reminders & Trackers", Bell], ["Export Center", Download], ["Settings", Settings]
  ] as const;
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-80 border-r border-white/10 bg-slate-950/90 p-4 text-white shadow-2xl backdrop-blur-2xl transition lg:sticky lg:top-0 lg:h-screen ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-24"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500"><PawPrint /></div>{open ? <div><p className="text-lg font-black">PetGalaxy</p><p className="text-xs text-blue-200">Medical Hub</p></div> : null}</div>
        <button className="focus-ring rounded-xl p-2 hover:bg-white/10" onClick={() => setOpen(!open)} aria-label="Toggle sidebar"><ChevronLeft className={`transition ${open ? "" : "rotate-180"}`} /></button>
      </div>
      <nav className="mt-8 grid gap-2">
        {nav.map(([label, Icon], index) => <a key={label} href={`#${label.toLowerCase().replaceAll(" ", "-")}`} className={`focus-ring flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition hover:bg-white/10 ${index === 0 ? "bg-white/15" : ""}`}><Icon className="h-5 w-5 shrink-0" />{open ? label : null}</a>)}
      </nav>
      {open ? <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-4"><ShieldCheck className="mb-3 text-blue-200" /><p className="text-sm font-bold">RLS-ready by design</p><p className="mt-1 text-xs text-slate-300">Every table is scoped to the authenticated owner with policies in the Supabase schema.</p></div> : null}
    </aside>
  );
}

function PetForm() {
  const [species, setSpecies] = useState("Dog");
  const breeds = useMemo(() => breedsForSpecies(species), [species]);
  return (
    <Card id="pet-profiles">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><Badge><Plus className="mr-1 h-3 w-3" /> Dynamic Add Pet</Badge><h2 className="mt-3 text-2xl font-bold">Species-aware pet profile builder</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Fields adapt for cats, dogs, birds, reptiles, amphibians, small mammals, and exotics.</p></div><Button variant="outline"><Camera className="h-4 w-4" /> Add avatar</Button></div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Field label="Pet type"><select value={species} onChange={(event) => setSpecies(event.target.value)} className={inputClass}>{speciesOptions.map((option) => <option key={option}>{option}</option>)}</select></Field>
        <Field label="Name"><input className={inputClass} placeholder="Luna" /></Field>
        {breeds.length ? <Field label="Breed"><select className={inputClass}>{breeds.map((breed) => <option key={breed}>{breed}</option>)}</select></Field> : <Field label="Species"><input className={inputClass} placeholder="African Grey, Ball Python, Rabbit..." /></Field>}
        {(species === "Dog" || species === "Cat") ? <><Field label="Color / Markings"><input className={inputClass} /></Field><Field label="Date of Birth"><input className={inputClass} type="date" /></Field><Field label="Microchip Number" hint="15 digits"><input className={inputClass} inputMode="numeric" maxLength={15} /></Field><Field label="Weight Tracking"><input className={inputClass} placeholder="12.4 lb" /></Field><Field label="Sex"><select className={inputClass}><option>Female</option><option>Male</option><option>Unknown</option></select></Field><Field label="Spayed / Neutered"><select className={inputClass}><option>Yes</option><option>No</option><option>Unknown</option></select></Field></> : null}
        {species === "Bird" ? <><Field label="Band Number / ID"><input className={inputClass} /></Field><Field label="Plumage Colors"><input className={inputClass} /></Field><Field label="Cage Requirements"><input className={inputClass} /></Field><Field label="Dietary Requirements"><input className={inputClass} /></Field></> : null}
        {(species === "Reptile" || species === "Amphibian") ? <><Field label="Morph / Variety"><input className={inputClass} /></Field><Field label="Temperature Target"><input className={inputClass} placeholder="88°F basking" /></Field><Field label="Humidity Target"><input className={inputClass} placeholder="60%" /></Field><Field label="Feeding Schedule"><input className={inputClass} /></Field></> : null}
        {(species === "Small Mammal" || species === "Exotic") ? <><Field label="Care Notes"><input className={inputClass} /></Field><Field label="Feeding Requirements"><input className={inputClass} /></Field><Field label="Weight"><input className={inputClass} /></Field></> : null}
      </div>
      <Field label="Notes"><textarea className={`${inputClass} mt-4 min-h-28`} placeholder="Temperament, allergies, care instructions..." /></Field>
    </Card>
  );
}

function DocumentVault() {
  return (
    <Card id="document-ai-vault" className="overflow-hidden">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div><Badge><DatabaseZap className="mr-1 h-3 w-3" /> AI Document Vault</Badge><h2 className="mt-3 text-2xl font-bold">Upload PDFs, images, HEIC, or mobile camera captures</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Drag-and-drop storage is prepared for Supabase buckets and an AI adapter that can connect to OpenAI, Anthropic, or Gemini.</p><div className="mt-6 rounded-[2rem] border-2 border-dashed border-blue-400/40 bg-blue-500/5 p-8 text-center"><UploadCloud className="mx-auto h-12 w-12 text-blue-500" /><p className="mt-3 font-bold">Drop medical documents here</p><p className="text-sm text-slate-500">PDF, JPG, PNG, HEIC · camera capture supported on mobile</p><div className="mt-5 flex flex-wrap justify-center gap-3"><Button><UploadCloud className="h-4 w-4" /> Upload file</Button><Button variant="outline"><Camera className="h-4 w-4" /> Use camera</Button></div></div></div>
        <div className="rounded-[2rem] bg-slate-950 p-5 text-white"><p className="font-bold">Extraction engine</p><div className="mt-5 space-y-4">{extractionStages.map((stage, index) => <motion.div key={stage} initial={{ opacity: 0.45 }} animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.18 }} className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-black">{index + 1}</span><div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-400 to-violet-400" /></div><span className="w-40 text-xs text-slate-300">{stage}</span></motion.div>)}</div></div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-5"><Field label="Date"><input className={inputClass} type="date" /></Field><Field label="Category"><select className={inputClass}><option>Vaccine</option><option>Surgery</option><option>Diagnostic</option><option>Medication</option><option>Visit</option></select></Field><Field label="Item Name"><input className={inputClass} /></Field><Field label="Provider / Clinic"><input className={inputClass} /></Field><Field label="Notes"><input className={inputClass} /></Field></div>
    </Card>
  );
}

function Timeline() {
  return (
    <Card><div className="flex flex-wrap items-center justify-between gap-4"><div><Badge><CalendarClock className="mr-1 h-3 w-3" /> Chronological Timeline</Badge><h2 className="mt-3 text-2xl font-bold">Medical history, ordered for clinics</h2></div><Button><Download className="h-4 w-4" /> Export Comprehensive Medical History</Button></div><div className="mt-6 space-y-4">{timeline.length ? timeline.map((item) => <div key={`${item.date}-${item.title}`} className="flex gap-4 rounded-3xl border border-slate-200/70 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950"><item.icon className={`h-5 w-5 ${item.color}`} /></div><div><div className="flex flex-wrap items-center gap-2"><p className="font-bold">{item.title}</p><Badge>{item.type}</Badge></div><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.pet} · {item.date} · {item.meta}</p></div></div>) : <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No medical history recorded yet. Upload a document or add an entry to build your timeline.</div>}</div></Card>
  );
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  return (
    <main className="min-h-screen lg:flex">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex items-center justify-between gap-4"><button className="focus-ring rounded-2xl bg-slate-950 p-3 text-white lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu /></button><div><Badge><Sparkles className="mr-1 h-3 w-3" /> Premium SaaS portal</Badge><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">PetGalaxy medical command center</h1><p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">Welcome to PetGalaxy. Add your first pet or upload your first medical document to begin building your pet&apos;s medical history.</p></div><div className="flex gap-2"><Button variant="outline"><Search className="h-4 w-4" /></Button><Button variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button></div></header>
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><Card className="relative overflow-hidden"><div className="absolute right-4 top-4 hidden text-blue-500/20 sm:block"><Cat className="h-40 w-40" /></div><div className="relative max-w-2xl"><h2 className="text-3xl font-black">Blank canvas onboarding</h2><p className="mt-3 text-slate-600 dark:text-slate-300">First-time users see guided steps with progress, skip controls, and friendly prompts to create a first pet profile or upload a first medical document.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{["Create pet profile", "Upload document", "Review timeline"].map((step, index) => <div key={step} className="rounded-3xl border border-slate-200/80 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"><p className="text-2xl font-black text-blue-600">0{index + 1}</p><p className="mt-2 text-sm font-bold">{step}</p></div>)}</div><div className="mt-6 flex gap-3"><Button><Plus className="h-4 w-4" /> Add first pet</Button><Button variant="ghost">Skip for now</Button></div></div></Card><AuthPanel /></section>
          <section className="grid gap-6 md:grid-cols-3"><Card><Dog className="text-blue-500" /><p className="mt-4 text-3xl font-black">3</p><p className="text-sm text-slate-500">Active pet profiles</p></Card><Card><FileText className="text-violet-500" /><p className="mt-4 text-3xl font-black">18</p><p className="text-sm text-slate-500">Documents indexed</p></Card><Card><Bell className="text-emerald-500" /><p className="mt-4 text-3xl font-black">5</p><p className="text-sm text-slate-500">Upcoming reminders</p></Card></section>
          <PetForm />
          <Timeline />
          <DocumentVault />
          <Card><div className="flex flex-wrap items-center justify-between gap-4"><div><Badge><Camera className="mr-1 h-3 w-3" /> Media Hub</Badge><h2 className="mt-3 text-2xl font-bold">Gallery, growth, healing, and progress photos</h2></div><Button variant="outline"><UploadCloud className="h-4 w-4" /> Drag & drop upload</Button></div><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{gallery.map((item, index) => <div key={item} className="aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-blue-500/30 via-violet-500/30 to-slate-950/20 p-4"><div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/30 bg-white/30 p-4 backdrop-blur dark:bg-slate-950/30"><Camera /><p className="font-bold">{item} set {index + 1}</p></div></div>)}</div></Card>
          <Card id="export-center"><div className="grid gap-6 lg:grid-cols-[1fr_auto]"><div><Badge><Download className="mr-1 h-3 w-3" /> Export Center</Badge><h2 className="mt-3 text-2xl font-bold">Clinic-grade PDF reports</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Reports include pet photos, microchips, chronological vaccines, medications, procedures, diagnostics, notes, attachments, branded headers, footers, page numbers, and print-ready multipage formatting.</p></div><Button className="self-center"><Download className="h-4 w-4" /> Export Comprehensive Medical History</Button></div></Card>
        </div>
      </div>
      {!sidebarOpen ? null : <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close overlay"><X className="sr-only" /></button>}
    </main>
  );
}
