const profileTemplateModal = document.querySelector("[data-profile-template-modal]");
const profileTemplateOpeners = document.querySelectorAll("[data-profile-template-open]");
const profileTemplateClosers = document.querySelectorAll("[data-profile-template-close]");
const profileTemplateForm = document.querySelector(".profile-template-form");

function setProfileTemplateOpen(isOpen) {
  if (!profileTemplateModal) return;

  if (isOpen) {
    profileTemplateModal.hidden = false;
    document.body.style.overflow = "hidden";
  } else {
    profileTemplateModal.hidden = true;
    document.body.style.overflow = "";
  }
}

profileTemplateOpeners.forEach((button) => {
  button.addEventListener("click", () => setProfileTemplateOpen(true));
});

profileTemplateClosers.forEach((button) => {
  button.addEventListener("click", () => setProfileTemplateOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setProfileTemplateOpen(false);
  }
});

function splitLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

if (profileTemplateForm && window.ProfileStore) {
  profileTemplateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(profileTemplateForm);
    const name = String(formData.get("name") || "").trim();

    if (!name) {
      let message = profileTemplateForm.querySelector(".profile-template-message");
      if (!message) {
        message = document.createElement("p");
        message.className = "profile-template-message";
        profileTemplateForm.appendChild(message);
      }
      message.textContent = "Add at least a name before saving your draft profile.";
      return;
    }

    const profile = {
      name,
      type: String(formData.get("type") || "other").trim(),
      role: String(formData.get("role") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      affiliation: String(formData.get("affiliation") || "").trim(),
      summary: String(formData.get("summary") || "").trim(),
      tags: ["tag1", "tag2", "tag3"]
        .map((field) => String(formData.get(field) || "").trim())
        .filter(Boolean),
      about: String(formData.get("about") || "").trim(),
      research: splitLines(String(formData.get("research") || "")),
      details: splitLines(String(formData.get("details") || "")),
      statement: String(formData.get("statement") || "").trim()
    };

    const saved = window.ProfileStore.saveProfile(profile);
    window.location.href = `/artist-profile.html?profile=${encodeURIComponent(saved.slug)}`;
  });
}
