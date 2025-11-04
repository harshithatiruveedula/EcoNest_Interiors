document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (!navToggle || !siteNav) return;

  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
    const isOpen = siteNav.classList.contains("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });
});
