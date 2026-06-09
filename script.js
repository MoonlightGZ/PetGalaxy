const pets = [
  {
    name: "Luna",
    species: "Cat",
    breed: "Domestic Shorthair",
    avatar: "🐱",
    microchip: "982000364721548",
    weight: "10.4 lb",
    notes: "Indoor, calm at visits"
  },
  {
    name: "Orion",
    species: "Dog",
    breed: "Golden Retriever",
    avatar: "🐶",
    microchip: "981020112233445",
    weight: "67 lb",
    notes: "Loves peanut butter meds"
  },
  {
    name: "Kiwi",
    species: "Bird",
    breed: "Green-cheek Conure",
    avatar: "🦜",
    microchip: "Band ID K-204",
    weight: "72 g",
    notes: "Daily chop diet"
  }
];

const extraPets = [
  {
    name: "Nova",
    species: "Reptile",
    breed: "Ball Python",
    avatar: "🦎",
    microchip: "Morph: Pastel",
    weight: "1,180 g",
    notes: "Humidity target 60%"
  },
  {
    name: "Mochi",
    species: "Small Mammal",
    breed: "Rabbit",
    avatar: "🐰",
    microchip: "No chip yet",
    weight: "4.8 lb",
    notes: "Timothy hay unlimited"
  }
];

const timelineRecords = [
  {
    date: "May 12, 2026",
    pet: "Luna",
    category: "Vaccine",
    icon: "💉",
    title: "Rabies 1-year booster",
    details: "Next due May 2027 · Batch RB-4421 · Administered by North Star Vet"
  },
  {
    date: "April 2, 2026",
    pet: "Orion",
    category: "Diagnostic",
    icon: "🧪",
    title: "Comprehensive bloodwork",
    details: "CBC values normal · Chemistry panel attached · Vet notes reviewed"
  },
  {
    date: "March 18, 2026",
    pet: "Luna",
    category: "Medication",
    icon: "💊",
    title: "Parasite prevention refill",
    details: "Monthly topical treatment · 6 doses dispensed"
  },
  {
    date: "February 9, 2026",
    pet: "Kiwi",
    category: "Visit",
    icon: "🩺",
    title: "Annual wellness exam",
    details: "Beak and feather check · Diet plan updated · Weight stable"
  }
];

const extractionStages = [
  "Scanning document layout",
  "Extracting key dates",
  "Detecting pet information",
  "Validating medical records",
  "Updating timeline preview"
];

const documents = ["rabies-certificate.pdf", "bloodwork-results.png", "wellness-visit.jpg"];

const petGrid = document.querySelector("#petGrid");
const timelineList = document.querySelector("#timelineList");
const stageList = document.querySelector("#stageList");
const petCount = document.querySelector("#petCount");
const docCount = document.querySelector("#docCount");
const timelineCount = document.querySelector("#timelineCount");
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const themeLabel = document.querySelector(".theme-label");
const menuToggle = document.querySelector("#menuToggle");
const addMockPet = document.querySelector("#addMockPet");
const exportButton = document.querySelector("#exportButton");
const fakeUpload = document.querySelector("#fakeUpload");
const toast = document.querySelector("#toast");

function renderPets() {
  petGrid.innerHTML = pets
    .map(
      (pet) => `
        <article class="pet-card glass-card reveal">
          <span class="pet-avatar" aria-hidden="true">${pet.avatar}</span>
          <h3>${pet.name}</h3>
          <div class="pet-meta">${pet.species} · ${pet.breed}</div>
          <div class="chip-list" aria-label="${pet.name} details">
            <span class="chip">${pet.microchip}</span>
            <span class="chip">${pet.weight}</span>
            <span class="chip">${pet.notes}</span>
          </div>
        </article>
      `
    )
    .join("");

  petCount.textContent = pets.length;
  revealVisibleCards();
}

function renderTimeline() {
  timelineList.innerHTML = timelineRecords
    .map(
      (record) => `
        <article class="timeline-item">
          <span class="timeline-icon" aria-hidden="true">${record.icon}</span>
          <div>
            <p class="eyebrow">${record.category} · ${record.date}</p>
            <h3>${record.title}</h3>
            <p>${record.pet} · ${record.details}</p>
          </div>
        </article>
      `
    )
    .join("");

  timelineCount.textContent = timelineRecords.length;
}

function renderStages() {
  stageList.innerHTML = extractionStages
    .map(
      (stage, index) => `
        <div class="stage">
          <span class="stage-number">${index + 1}</span>
          <div>
            <strong>${stage}</strong>
            <span aria-hidden="true"></span>
          </div>
        </div>
      `
    )
    .join("");

  docCount.textContent = documents.length;
}

function setTheme(mode) {
  const isDark = mode === "dark";
  document.body.classList.toggle("dark", isDark);
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = isDark ? "Light" : "Dark";
  localStorage.setItem("petgalaxy-theme", mode);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function revealVisibleCards() {
  const revealElements = document.querySelectorAll(".reveal:not(.visible)");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  setTheme(nextTheme);
});

menuToggle.addEventListener("click", () => {
  document.body.classList.toggle("nav-open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => document.body.classList.remove("nav-open"));
});

addMockPet.addEventListener("click", () => {
  const nextPet = extraPets.shift();

  if (!nextPet) {
    showToast("All demo pets are already on the dashboard.");
    return;
  }

  pets.push(nextPet);
  renderPets();
  showToast(`${nextPet.name} was added as a demo pet profile.`);
});

exportButton.addEventListener("click", () => {
  showToast("Demo export prepared: PetGalaxy comprehensive medical history packet.");
});

fakeUpload.addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []);

  if (files.length === 0) {
    return;
  }

  documents.push(...files.map((file) => file.name));
  docCount.textContent = documents.length;
  showToast(`${files.length} demo document${files.length > 1 ? "s" : ""} staged in the vault.`);
  fakeUpload.value = "";
});

["dragenter", "dragover"].forEach((eventName) => {
  document.querySelector(".dropzone").addEventListener(eventName, (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  document.querySelector(".dropzone").addEventListener(eventName, (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove("dragover");
    if (eventName === "drop") {
      const fileCount = event.dataTransfer?.files.length || 0;
      if (fileCount > 0) {
        docCount.textContent = Number(docCount.textContent) + fileCount;
        showToast(`${fileCount} demo file${fileCount > 1 ? "s" : ""} dropped into the vault mockup.`);
      }
    }
  });
});

const savedTheme = localStorage.getItem("petgalaxy-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
setTheme(savedTheme || preferredTheme);
renderPets();
renderTimeline();
renderStages();
revealVisibleCards();
