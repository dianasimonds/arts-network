document.addEventListener("click", (event) => {
  document.querySelectorAll(".menu-dropdown[open]").forEach((dropdown) => {
    if (dropdown.contains(event.target)) return;
    dropdown.removeAttribute("open");
  });
});
