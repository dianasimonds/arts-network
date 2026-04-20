const PROFILE_STORAGE_KEY = "catenartsProfiles";
const PROFILE_TYPE_ORDER = ["artist", "curator", "institution", "gallery", "collective", "other"];

function slugifyProfileName(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "profile";
}

function readProfiles() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Unable to read saved profiles:", error);
    return [];
  }
}

function writeProfiles(profiles) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
}

function listProfiles() {
  return readProfiles().sort((left, right) => {
    const leftType = PROFILE_TYPE_ORDER.indexOf(left.type || "other");
    const rightType = PROFILE_TYPE_ORDER.indexOf(right.type || "other");

    if (leftType !== rightType) {
      return leftType - rightType;
    }

    return left.name.localeCompare(right.name);
  });
}

function getProfileBySlug(slug) {
  return readProfiles().find((profile) => profile.slug === slug) || null;
}

function saveProfile(profile) {
  const profiles = readProfiles();
  const slugBase = slugifyProfileName(profile.name);
  let slug = slugBase;
  let suffix = 2;

  while (profiles.some((entry) => entry.slug === slug && entry.name !== profile.name)) {
    slug = `${slugBase}-${suffix}`;
    suffix += 1;
  }

  const normalized = {
    slug,
    name: profile.name,
    type: profile.type || "other",
    role: profile.role || "",
    location: profile.location || "",
    affiliation: profile.affiliation || "",
    summary: profile.summary || "",
    tags: Array.isArray(profile.tags) ? profile.tags : [],
    about: profile.about || "",
    research: Array.isArray(profile.research) ? profile.research : [],
    details: Array.isArray(profile.details) ? profile.details : [],
    statement: profile.statement || ""
  };

  const existingIndex = profiles.findIndex((entry) => entry.slug === slug);
  if (existingIndex >= 0) {
    profiles[existingIndex] = normalized;
  } else {
    profiles.push(normalized);
  }

  writeProfiles(profiles);
  return normalized;
}

window.ProfileStore = {
  listProfiles,
  getProfileBySlug,
  saveProfile,
  slugifyProfileName
};
