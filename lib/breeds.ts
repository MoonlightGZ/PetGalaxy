export const catBreeds = [
  "Domestic Shorthair",
  "Domestic Longhair",
  "Maine Coon",
  "Ragdoll",
  "Siamese",
  "Bengal",
  "Persian",
  "Sphynx",
  "British Shorthair",
  "Scottish Fold",
  "Abyssinian",
  "Russian Blue"
];

export const dogBreeds = [
  "Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akita", "Alaskan Malamute", "Australian Cattle Dog",
  "Australian Shepherd", "Basenji", "Basset Hound", "Beagle", "Bernese Mountain Dog", "Bichon Frise",
  "Border Collie", "Boston Terrier", "Boxer", "Brittany", "Bulldog", "Cane Corso", "Cavalier King Charles Spaniel",
  "Chihuahua", "Chinese Crested", "Cocker Spaniel", "Collie", "Dachshund", "Dalmatian", "Doberman Pinscher",
  "English Springer Spaniel", "French Bulldog", "German Shepherd Dog", "German Shorthaired Pointer", "Golden Retriever",
  "Great Dane", "Great Pyrenees", "Havanese", "Labrador Retriever", "Maltese", "Mastiff", "Miniature Schnauzer",
  "Newfoundland", "Papillon", "Pembroke Welsh Corgi", "Pomeranian", "Poodle", "Portuguese Water Dog", "Pug",
  "Rhodesian Ridgeback", "Rottweiler", "Samoyed", "Shetland Sheepdog", "Shiba Inu", "Shih Tzu", "Siberian Husky",
  "Vizsla", "Weimaraner", "West Highland White Terrier", "Whippet", "Yorkshire Terrier", "Mixed Breed"
];

export function breedsForSpecies(species: string) {
  if (species === "Cat") return catBreeds;
  if (species === "Dog") return dogBreeds;
  return [];
}
