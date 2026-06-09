import { jsPDF } from "jspdf";

type ExportPet = {
  name: string;
  species: string;
  breed?: string;
  microchipNumber?: string;
  dateOfBirth?: string;
  weight?: string;
};

type ExportTimelineRecord = {
  date: string;
  category: string;
  title: string;
  provider?: string;
  notes?: string;
};

export function generateMedicalHistoryPdf(pet: ExportPet, records: ExportTimelineRecord[]) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 48;
  let y = margin;

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 612, 88, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("PetGalaxy Comprehensive Medical History", margin, 42);
  doc.setFontSize(10);
  doc.text(`Generated ${new Date().toLocaleDateString()}`, margin, 62);

  y = 124;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.text(pet.name, margin, y);
  doc.setFontSize(11);
  doc.text(`${pet.species}${pet.breed ? ` · ${pet.breed}` : ""}`, margin, y + 20);
  if (pet.microchipNumber) doc.text(`Microchip: ${pet.microchipNumber}`, margin, y + 38);
  if (pet.dateOfBirth) doc.text(`Date of birth: ${pet.dateOfBirth}`, margin, y + 56);
  if (pet.weight) doc.text(`Weight: ${pet.weight}`, 320, y + 56);

  y += 96;
  doc.setFontSize(14);
  doc.text("Chronological Timeline", margin, y);
  y += 24;

  records.forEach((record, index) => {
    if (y > 720) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text(`${record.date} · ${record.category}`, margin, y);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.text(record.title, margin, y + 18);
    const detailLines = [record.provider ? `Provider: ${record.provider}` : null, record.notes].filter(Boolean).join(" · ");
    if (detailLines) doc.text(doc.splitTextToSize(detailLines, 500), margin, y + 36);
    y += detailLines ? 78 : 54;
    if (index < records.length - 1) {
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y - 18, 564, y - 18);
    }
  });

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`PetGalaxy · Page ${page} of ${pages}`, margin, 760);
  }

  return doc;
}
