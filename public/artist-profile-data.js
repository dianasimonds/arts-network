function renderList(target, items) {
  if (!target || !Array.isArray(items) || !items.length) return;
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

const profileSlug = new URLSearchParams(window.location.search).get("profile");
const savedProfile = profileSlug && window.ProfileStore
  ? window.ProfileStore.getProfileBySlug(profileSlug)
  : null;

if (savedProfile) {
  document.querySelectorAll("[data-profile-name]").forEach((element) => {
    element.textContent = savedProfile.name;
  });

  const role = document.querySelector("[data-profile-role]");
  if (role && savedProfile.role) role.textContent = savedProfile.role;

  const summary = document.querySelector("[data-profile-summary]");
  if (summary && savedProfile.summary) summary.textContent = savedProfile.summary;

  const tags = document.querySelector("[data-profile-tags]");
  if (tags && savedProfile.tags.length) {
    tags.innerHTML = savedProfile.tags.map((tag) => `<span>${tag}</span>`).join("");
  }

  const about = document.querySelector("[data-profile-about]");
  if (about && savedProfile.about) about.textContent = savedProfile.about;

  renderList(document.querySelector("[data-profile-research]"), savedProfile.research);
  renderList(document.querySelector("[data-profile-details]"), savedProfile.details);

  const statement = document.querySelector("[data-profile-statement]");
  if (statement && savedProfile.statement) {
    statement.textContent = savedProfile.statement;
  }
}
