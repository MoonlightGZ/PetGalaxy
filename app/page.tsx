"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import {
  Bell,
  CalendarClock,
  Cat,
  ClipboardList,
  DatabaseZap,
  Dog,
  Download,
  FileHeart,
  FileText,
  LogOut,
  Menu,
  Moon,
  PawPrint,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Syringe,
  UploadCloud,
  X
} from "lucide-react";
import { AuthPanel } from "@/components/auth-panel";
import { Badge, Button, Card, Field, inputClass } from "@/components/ui";
import { breedsForSpecies } from "@/lib/breeds";
import type { Database } from "@/lib/database.types";
import { generateMedicalHistoryPdf } from "@/lib/pdf-export";
import { speciesOptions } from "@/lib/schemas";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Supabase = NonNullable<ReturnType<typeof createSupabaseBrowserClient>>;
type Pet = Database["public"]["Tables"]["pets"]["Row"];
type PetInsert = Database["public"]["Tables"]["pets"]["Insert"];
type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
type TimelineRecord = Database["public"]["Tables"]["timeline_records"]["Row"];
type TimelineCategory = Database["public"]["Enums"]["timeline_category"];

const documentBucket = "pet-documents";

const categoryOptions: Array<{ value: TimelineCategory; label: string }> = [
  { value: "vaccine", label: "Vaccine" },
  { value: "surgery", label: "Surgery" },
  { value: "diagnostic", label: "Diagnostic" },
  { value: "medication", label: "Medication" },
  { value: "visit", label: "Visit" },
  { value: "note", label: "Note" }
];

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function numericOrNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDate(value: string | null) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function categoryLabel(value: TimelineCategory) {
  return categoryOptions.find((category) => category.value === value)?.label ?? value;
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

function Sidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const nav = [
    ["Dashboard", PawPrint, "#dashboard"],
    ["Pet Profiles", Dog, "#pet-profiles"],
    ["Document Vault", FileHeart, "#document-vault"],
    ["Timeline", Bell, "#timeline"],
    ["Export Center", Download, "#export-center"],
    ["Settings", Settings, "#settings"]
  ] as const;

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-80 border-r border-white/10 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-2xl transition lg:sticky lg:top-0 lg:h-screen ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-24"}`}>
      <div className="flex items-center justify-between">
        <a className="flex items-center gap-3" href="#dashboard" onClick={() => setOpen(false)}>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500"><PawPrint /></span>
          {open ? <span><strong className="block text-lg">PetGalaxy</strong><small className="text-blue-200">Medical Hub</small></span> : null}
        </a>
        <button className="focus-ring rounded-xl p-2 hover:bg-white/10" onClick={() => setOpen(!open)} aria-label="Toggle sidebar">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <nav className="mt-8 grid gap-2">
        {nav.map(([label, Icon, href], index) => (
          <a key={label} href={href} onClick={() => setOpen(false)} className={`focus-ring flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition hover:bg-white/10 ${index === 0 ? "bg-white/15" : ""}`}>
            <Icon className="h-5 w-5 shrink-0" />
            {open ? label : null}
          </a>
        ))}
      </nav>
      {open ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-4">
          <ShieldCheck className="mb-3 text-blue-200" />
          <p className="text-sm font-bold">Private by default</p>
          <p className="mt-1 text-xs text-slate-300">Supabase RLS and private Storage policies scope every record to the signed-in owner.</p>
        </div>
      ) : null}
    </aside>
  );
}

function PetForm({ onSubmit, saving }: { onSubmit: (formData: FormData) => Promise<void>; saving: boolean }) {
  const [species, setSpecies] = useState<(typeof speciesOptions)[number]>("Dog");
  const breeds = useMemo(() => breedsForSpecies(species), [species]);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await onSubmit(formData);
    formRef.current?.reset();
    setSpecies("Dog");
  }

  return (
    <Card id="pet-profiles">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge><Plus className="mr-1 h-3 w-3" /> Add Pet</Badge>
          <h2 className="mt-3 text-2xl font-bold">Species-aware pet profile</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Save the core facts a clinic, sitter, or emergency contact will need first.</p>
        </div>
      </div>
      <form ref={formRef} action={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-3">
        <Field label="Pet type">
          <select name="species" value={species} onChange={(event) => setSpecies(event.target.value as (typeof speciesOptions)[number])} className={inputClass}>
            {speciesOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </Field>
        <Field label="Name"><input className={inputClass} name="name" required placeholder="Luna" /></Field>
        {breeds.length ? (
          <Field label="Breed">
            <select className={inputClass} name="breed">
              <option value="">Unknown / mixed</option>
              {breeds.map((breed) => <option key={breed}>{breed}</option>)}
            </select>
          </Field>
        ) : (
          <Field label="Species detail"><input className={inputClass} name="speciesDetail" placeholder="African Grey, Ball Python, Rabbit..." /></Field>
        )}
        <Field label="Color / markings"><input className={inputClass} name="colorMarkings" /></Field>
        <Field label="Date of birth"><input className={inputClass} name="dateOfBirth" type="date" /></Field>
        <Field label="Microchip / band ID"><input className={inputClass} name="microchipNumber" maxLength={32} /></Field>
        <Field label="Weight"><input className={inputClass} name="weight" inputMode="decimal" placeholder="12.4" /></Field>
        <Field label="Sex">
          <select className={inputClass} name="sex">
            <option>Unknown</option>
            <option>Female</option>
            <option>Male</option>
          </select>
        </Field>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/50 px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-white/5">
          <input name="spayedNeutered" type="checkbox" className="h-4 w-4" />
          Spayed / neutered
        </label>
        <Field label="Care notes">
          <textarea className={`${inputClass} min-h-28 md:col-span-3`} name="careNotes" placeholder="Allergies, temperament, medications, handling notes..." />
        </Field>
        <Button className="md:col-span-3" disabled={saving}><Plus className="h-4 w-4" /> {saving ? "Saving pet..." : "Save Pet Profile"}</Button>
      </form>
    </Card>
  );
}

function DocumentVault({
  pets,
  documents,
  selectedPetId,
  setSelectedPetId,
  onUpload,
  onDownload,
  saving
}: {
  pets: Pet[];
  documents: DocumentRow[];
  selectedPetId: string;
  setSelectedPetId: (petId: string) => void;
  onUpload: (formData: FormData) => Promise<void>;
  onDownload: (document: DocumentRow) => Promise<void>;
  saving: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleUpload(formData: FormData) {
    await onUpload(formData);
    formRef.current?.reset();
  }

  return (
    <Card id="document-vault" className="overflow-hidden">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div>
          <Badge><DatabaseZap className="mr-1 h-3 w-3" /> Document Vault</Badge>
          <h2 className="mt-3 text-2xl font-bold">Private medical document storage</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Upload records to owner-scoped Supabase Storage and keep metadata in the timeline-ready vault.</p>
          <form ref={formRef} action={handleUpload} className="mt-6 rounded-[2rem] border-2 border-dashed border-blue-400/40 bg-blue-500/5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Pet">
                <select className={inputClass} name="petId" value={selectedPetId} onChange={(event) => setSelectedPetId(event.target.value)} required>
                  <option value="">Select a pet</option>
                  {pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
                </select>
              </Field>
              <Field label="Files">
                <input className={inputClass} name="files" type="file" multiple accept=".pdf,image/*,.heic" required />
              </Field>
            </div>
            <Button className="mt-5 w-full" disabled={saving || pets.length === 0}><UploadCloud className="h-4 w-4" /> {saving ? "Uploading..." : "Upload Documents"}</Button>
          </form>
        </div>
        <div className="rounded-[2rem] bg-slate-950 p-5 text-white">
          <p className="font-bold">Recent documents</p>
          <div className="mt-5 grid gap-3">
            {documents.length ? documents.slice(0, 6).map((document) => (
              <button key={document.id} className="focus-ring flex items-start gap-3 rounded-2xl bg-white/10 p-3 text-left transition hover:bg-white/15" onClick={() => onDownload(document)}>
                <FileText className="mt-1 h-4 w-4 text-blue-200" />
                <span>
                  <span className="block text-sm font-bold">{document.file_name}</span>
                  <span className="text-xs text-slate-300">{formatDate(document.created_at.slice(0, 10))} · {document.status}</span>
                </span>
              </button>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/15 p-5 text-sm text-slate-300">No documents yet. Upload a vaccination certificate, lab result, or visit summary.</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function TimelineForm({
  pets,
  documents,
  selectedPetId,
  setSelectedPetId,
  onSubmit,
  saving
}: {
  pets: Pet[];
  documents: DocumentRow[];
  selectedPetId: string;
  setSelectedPetId: (petId: string) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  saving: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await onSubmit(formData);
    formRef.current?.reset();
  }

  const petDocuments = documents.filter((document) => !selectedPetId || document.pet_id === selectedPetId);

  return (
    <Card>
      <Badge><CalendarClock className="mr-1 h-3 w-3" /> Manual Entry</Badge>
      <h2 className="mt-3 text-2xl font-bold">Add a medical timeline record</h2>
      <form ref={formRef} action={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-3">
        <Field label="Pet">
          <select className={inputClass} name="petId" value={selectedPetId} onChange={(event) => setSelectedPetId(event.target.value)} required>
            <option value="">Select a pet</option>
            {pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
          </select>
        </Field>
        <Field label="Date"><input className={inputClass} name="occurredOn" type="date" required /></Field>
        <Field label="Category">
          <select className={inputClass} name="category">
            {categoryOptions.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
          </select>
        </Field>
        <Field label="Item name"><input className={inputClass} name="title" required placeholder="Rabies booster" /></Field>
        <Field label="Provider / clinic"><input className={inputClass} name="providerName" placeholder="North Star Vet" /></Field>
        <Field label="Linked document">
          <select className={inputClass} name="documentId">
            <option value="">None</option>
            {petDocuments.map((document) => <option key={document.id} value={document.id}>{document.file_name}</option>)}
          </select>
        </Field>
        <Field label="Notes"><textarea className={`${inputClass} min-h-24 md:col-span-3`} name="notes" placeholder="Dose, batch number, results, next due date..." /></Field>
        <Button className="md:col-span-3" disabled={saving || pets.length === 0}><ClipboardList className="h-4 w-4" /> {saving ? "Saving record..." : "Save Timeline Record"}</Button>
      </form>
    </Card>
  );
}

function Timeline({ records, pets }: { records: TimelineRecord[]; pets: Pet[] }) {
  const petName = (petId: string) => pets.find((pet) => pet.id === petId)?.name ?? "Unknown pet";

  return (
    <Card id="timeline">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge><Syringe className="mr-1 h-3 w-3" /> Medical Timeline</Badge>
          <h2 className="mt-3 text-2xl font-bold">Chronological health history</h2>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {records.length ? records.map((record) => (
          <div key={record.id} className="flex gap-4 rounded-3xl border border-slate-200/70 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <ClipboardList className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold">{record.title}</p>
                <Badge>{categoryLabel(record.category)}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{petName(record.pet_id)} · {formatDate(record.occurred_on)}{record.provider_name ? ` · ${record.provider_name}` : ""}</p>
              {record.notes ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{record.notes}</p> : null}
            </div>
          </div>
        )) : (
          <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-white/15">No medical history yet. Add a pet, upload a document, or create a manual record.</div>
        )}
      </div>
    </Card>
  );
}

export default function Home() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("Ready for secure owner records.");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [records, setRecords] = useState<TimelineRecord[]>([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const { theme, setTheme } = useTheme();

  const refreshData = useCallback(async (client: Supabase, ownerId: string) => {
    setLoadingData(true);
    const [petsResult, documentsResult, recordsResult] = await Promise.all([
      client.from("pets").select("*").eq("owner_id", ownerId).order("created_at", { ascending: false }),
      client.from("documents").select("*").eq("owner_id", ownerId).order("created_at", { ascending: false }),
      client.from("timeline_records").select("*").eq("owner_id", ownerId).order("occurred_on", { ascending: false })
    ]);

    if (petsResult.error) throw petsResult.error;
    if (documentsResult.error) throw documentsResult.error;
    if (recordsResult.error) throw recordsResult.error;

    const nextPets = petsResult.data ?? [];
    setPets(nextPets);
    setDocuments(documentsResult.data ?? []);
    setRecords(recordsResult.data ?? []);
    setSelectedPetId((current) => current || nextPets[0]?.id || "");
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;
    let mounted = true;

    async function boot() {
      const { data } = await client.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        try {
          await client.from("profiles").upsert({ id: data.session.user.id, full_name: data.session.user.email ?? null });
          await refreshData(client, data.session.user.id);
        } catch (error) {
          setNotice(error instanceof Error ? error.message : "Could not load owner records.");
        }
      }
    }

    boot();
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        void refreshData(client, nextSession.user.id);
      } else {
        setPets([]);
        setDocuments([]);
        setRecords([]);
        setSelectedPetId("");
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshData, supabase]);

  async function withOwner(action: (client: Supabase, ownerId: string) => Promise<void>) {
    if (!supabase || !session) {
      setNotice("Sign in before saving records.");
      return;
    }
    setSaving(true);
    try {
      await action(supabase, session.user.id);
      await refreshData(supabase, session.user.id);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function addPet(formData: FormData) {
    await withOwner(async (client, ownerId) => {
      const payload: PetInsert = {
        owner_id: ownerId,
        name: String(formData.get("name") ?? "").trim(),
        species: String(formData.get("species") ?? "Dog") as PetInsert["species"],
        breed: emptyToNull(formData.get("breed")),
        species_detail: emptyToNull(formData.get("speciesDetail")),
        color_markings: emptyToNull(formData.get("colorMarkings")),
        date_of_birth: emptyToNull(formData.get("dateOfBirth")),
        sex: String(formData.get("sex") ?? "Unknown") as PetInsert["sex"],
        spayed_neutered: formData.get("spayedNeutered") === "on",
        microchip_number: emptyToNull(formData.get("microchipNumber")),
        weight: numericOrNull(formData.get("weight")),
        care_notes: emptyToNull(formData.get("careNotes"))
      };
      const { error } = await client.from("pets").insert(payload);
      if (error) throw error;
      setNotice(`${payload.name} was added to your private pet profiles.`);
    });
  }

  async function uploadDocuments(formData: FormData) {
    await withOwner(async (client, ownerId) => {
      const petId = String(formData.get("petId") ?? "");
      const files = formData.getAll("files").filter((file): file is File => file instanceof File && file.size > 0);
      if (!petId || files.length === 0) throw new Error("Choose a pet and at least one file.");

      for (const file of files) {
        const storagePath = `${ownerId}/${petId}/${Date.now()}-${sanitizeFileName(file.name)}`;
        const upload = await client.storage.from(documentBucket).upload(storagePath, file, { upsert: false, contentType: file.type || "application/octet-stream" });
        if (upload.error) throw upload.error;
        const insert = await client.from("documents").insert({
          owner_id: ownerId,
          pet_id: petId,
          file_name: file.name,
          storage_path: storagePath,
          mime_type: file.type || "application/octet-stream",
          status: "uploaded"
        });
        if (insert.error) throw insert.error;
      }
      setNotice(`${files.length} document${files.length === 1 ? "" : "s"} uploaded to the private vault.`);
    });
  }

  async function addTimelineRecord(formData: FormData) {
    await withOwner(async (client, ownerId) => {
      const petId = String(formData.get("petId") ?? "");
      if (!petId) throw new Error("Choose a pet for the timeline record.");
      const title = String(formData.get("title") ?? "").trim();
      const occurredOn = String(formData.get("occurredOn") ?? "");
      if (!title || !occurredOn) throw new Error("Timeline records need a date and item name.");

      const { error } = await client.from("timeline_records").insert({
        owner_id: ownerId,
        pet_id: petId,
        document_id: emptyToNull(formData.get("documentId")),
        category: String(formData.get("category") ?? "visit") as TimelineCategory,
        title,
        occurred_on: occurredOn,
        provider_name: emptyToNull(formData.get("providerName")),
        notes: emptyToNull(formData.get("notes"))
      });
      if (error) throw error;
      setNotice(`${title} was added to the medical timeline.`);
    });
  }

  async function downloadDocument(document: DocumentRow) {
    if (!supabase) return;
    const { data, error } = await supabase.storage.from(documentBucket).createSignedUrl(document.storage_path, 60);
    if (error) {
      setNotice(error.message);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  function exportPetHistory(pet: Pet) {
    const petRecords = records.filter((record) => record.pet_id === pet.id);
    const doc = generateMedicalHistoryPdf(
      {
        name: pet.name,
        species: pet.species,
        breed: pet.breed ?? pet.species_detail ?? undefined,
        microchipNumber: pet.microchip_number ?? undefined,
        dateOfBirth: pet.date_of_birth ?? undefined,
        weight: pet.weight ? `${pet.weight} lb` : undefined
      },
      petRecords.map((record) => ({
        date: formatDate(record.occurred_on),
        category: categoryLabel(record.category),
        title: record.title,
        provider: record.provider_name ?? undefined,
        notes: record.notes ?? undefined
      }))
    );
    doc.save(`${pet.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-medical-history.pdf`);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setNotice("Signed out.");
  }

  if (!supabase) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <Badge><Sparkles className="mr-1 h-3 w-3" /> Setup Required</Badge>
            <h1 className="mt-4 text-4xl font-black">Connect Supabase to launch PetGalaxy</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, apply `supabase/schema.sql`, then restart the dev server.</p>
          </Card>
          <AuthPanel />
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="flex min-h-[520px] flex-col justify-center overflow-hidden">
            <Badge><ShieldCheck className="mr-1 h-3 w-3" /> Private Pet Records</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">PetGalaxy medical command center</h1>
            <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">Save pet profiles, upload documents, build a chronological health timeline, and export clinic-ready records from one owner-controlled workspace.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Profiles", "Vault", "Timeline"].map((item) => <div key={item} className="rounded-2xl border border-slate-200/80 bg-white/50 p-4 text-sm font-bold dark:border-white/10 dark:bg-white/5">{item}</div>)}
            </div>
          </Card>
          <AuthPanel />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen lg:flex" id="dashboard">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <button className="focus-ring rounded-2xl bg-slate-950 p-3 text-white lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu /></button>
            <div>
              <Badge><Sparkles className="mr-1 h-3 w-3" /> Owner Portal</Badge>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">Your pet records</h1>
              <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{session.user.email} · {notice}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => session && refreshData(supabase, session.user.id)} disabled={loadingData}><RefreshCw className="h-4 w-4" /> Refresh</Button>
              <Button variant="outline" aria-label="Search coming soon"><Search className="h-4 w-4" /></Button>
              <Button variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
              <Button variant="secondary" onClick={signOut}><LogOut className="h-4 w-4" /> Sign Out</Button>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-3">
            <Card><Dog className="text-blue-500" /><p className="mt-4 text-3xl font-black">{pets.length}</p><p className="text-sm text-slate-500">Active pet profiles</p></Card>
            <Card><FileText className="text-violet-500" /><p className="mt-4 text-3xl font-black">{documents.length}</p><p className="text-sm text-slate-500">Documents stored</p></Card>
            <Card><Bell className="text-emerald-500" /><p className="mt-4 text-3xl font-black">{records.length}</p><p className="text-sm text-slate-500">Timeline records</p></Card>
          </section>

          <PetForm onSubmit={addPet} saving={saving} />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pets.length ? pets.map((pet) => (
              <Card key={pet.id} className="relative overflow-hidden">
                <Cat className="absolute right-4 top-4 h-20 w-20 text-blue-500/10" />
                <div className="relative">
                  <Badge>{pet.species}</Badge>
                  <h2 className="mt-4 text-2xl font-black">{pet.name}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{pet.breed ?? pet.species_detail ?? "No breed detail"}{pet.microchip_number ? ` · ${pet.microchip_number}` : ""}</p>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{pet.care_notes ?? "No care notes yet."}</p>
                  <Button className="mt-5 w-full" variant="outline" onClick={() => exportPetHistory(pet)}><Download className="h-4 w-4" /> Export PDF</Button>
                </div>
              </Card>
            )) : (
              <Card className="md:col-span-2 xl:col-span-3">
                <h2 className="text-2xl font-bold">Start with a pet profile</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">PetGalaxy is empty until you add your first pet. Once a pet exists, documents and timeline records can attach to it.</p>
              </Card>
            )}
          </section>

          <DocumentVault pets={pets} documents={documents} selectedPetId={selectedPetId} setSelectedPetId={setSelectedPetId} onUpload={uploadDocuments} onDownload={downloadDocument} saving={saving} />
          <TimelineForm pets={pets} documents={documents} selectedPetId={selectedPetId} setSelectedPetId={setSelectedPetId} onSubmit={addTimelineRecord} saving={saving} />
          <Timeline records={records} pets={pets} />

          <Card id="export-center">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <Badge><Download className="mr-1 h-3 w-3" /> Export Center</Badge>
                <h2 className="mt-3 text-2xl font-bold">Clinic-ready PDF packets</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Choose any saved pet card above to export a PDF built from live profile and timeline data.</p>
              </div>
              <Button className="self-center" disabled={!pets.length} onClick={() => pets[0] && exportPetHistory(pets[0])}><Download className="h-4 w-4" /> Export First Pet</Button>
            </div>
          </Card>

          <Card id="settings">
            <Badge><Settings className="mr-1 h-3 w-3" /> Launch Settings</Badge>
            <h2 className="mt-3 text-2xl font-bold">Post-MVP roadmap</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">AI extraction, reminders, search, media galleries, and shared caregiver access are intentionally held for the next release after core records are stable.</p>
          </Card>
        </div>
      </div>
      {!sidebarOpen ? null : <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close overlay"><X className="sr-only" /></button>}
    </main>
  );
}
