const profileTypeOrder = ["artist", "curator", "institution", "gallery", "collective", "other"];
const profilesGroups = document.getElementById("profilesGroups");
const profilesEmptyState = document.getElementById("profilesEmptyState");
const profilesResultCount = document.getElementById("profilesResultCount");
const profilesSearchInput = document.getElementById("profilesSearchInput");
const profilesTypeFilter = document.getElementById("profilesTypeFilter");

function formatProfileType(type) {
  return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Other";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function profileMatches(profile, query, type) {
  const matchesType = type === "all" || (profile.type || "other") === type;
  if (!matchesType) return false;
  if (!query) return true;

  const haystack = [
    profile.name,
    profile.role,
    profile.location,
    profile.affiliation,
    profile.summary,
    ...(profile.tags || [])
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function renderProfiles() {
  const allProfiles = window.ProfileStore?.listProfiles?.() || [];
  const query = (profilesSearchInput?.value || "").trim().toLowerCase();
  const selectedType = profilesTypeFilter?.value || "all";
  const visibleProfiles = allProfiles.filter((profile) => profileMatches(profile, query, selectedType));

  profilesResultCount.textContent = `${visibleProfiles.length} profile${visibleProfiles.length === 1 ? "" : "s"} shown`;

  if (!visibleProfiles.length) {
    profilesGroups.innerHTML = "";
    profilesEmptyState.classList.remove("is-hidden");
    return;
  }

  profilesEmptyState.classList.add("is-hidden");

  const grouped = profileTypeOrder
    .map((type) => ({
      type,
      items: visibleProfiles.filter((profile) => (profile.type || "other") === type)
    }))
    .filter((group) => group.items.length);

  profilesGroups.innerHTML = grouped
    .map((group) => `
      <article class="profiles-group-card">
        <h2>${escapeHtml(formatProfileType(group.type))}</h2>
        <div class="profiles-group-list">
          ${group.items
            .map((profile) => `
              <div class="profiles-item">
                <a class="profiles-item-name" href="/artist-profile.html?profile=${encodeURIComponent(profile.slug)}">
                  ${escapeHtml(profile.name)}
                </a>
                ${profile.role ? `<div class="profiles-item-role">${escapeHtml(profile.role)}</div>` : ""}
                ${profile.summary ? `<div class="profiles-item-summary">${escapeHtml(profile.summary)}</div>` : ""}
                <div class="profiles-item-meta">
                  ${[profile.location, profile.affiliation].filter(Boolean).map(escapeHtml).join(" · ") || "No extra details yet"}
                </div>
              </div>
            `)
            .join("")}
        </div>
      </article>
    `)
    .join("");
}

if (profilesSearchInput) {
  profilesSearchInput.addEventListener("input", renderProfiles);
}

if (profilesTypeFilter) {
  profilesTypeFilter.addEventListener("change", renderProfiles);
}

renderProfiles();
