const menuButtons = document.querySelectorAll("[data-menu-toggle]");

menuButtons.forEach((button) => {
  const menu = button.parentElement.querySelector("[data-menu]");
  if (!menu) return;

  button.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

document.addEventListener("click", (event) => {
  document.querySelectorAll(".menu-dropdown").forEach((dropdown) => {
    if (dropdown.contains(event.target)) return;

    const menu = dropdown.querySelector("[data-menu]");
    const button = dropdown.querySelector("[data-menu-toggle]");

    if (menu) menu.classList.remove("is-open");
    if (button) button.setAttribute("aria-expanded", "false");
  });
});
