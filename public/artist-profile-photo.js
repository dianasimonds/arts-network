const profilePhotoInput = document.getElementById("profilePhotoInput");
const profilePhotoPreview = document.getElementById("profilePhotoPreview");
const profilePhotoPlaceholder = document.getElementById("profilePhotoPlaceholder");

if (profilePhotoInput && profilePhotoPreview && profilePhotoPlaceholder) {
  profilePhotoInput.addEventListener("change", (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      profilePhotoPreview.removeAttribute("src");
      profilePhotoPreview.classList.add("is-hidden");
      profilePhotoPlaceholder.classList.remove("is-hidden");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    profilePhotoPreview.src = objectUrl;
    profilePhotoPreview.classList.remove("is-hidden");
    profilePhotoPlaceholder.classList.add("is-hidden");

    profilePhotoPreview.onload = () => {
      URL.revokeObjectURL(objectUrl);
    };
  });
}
