document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (!navToggle || !siteNav) return;

  // Toggle menu open/close
  navToggle.addEventListener("click", function () {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when clicking outside or on a link
  document.addEventListener("click", function (e) {
    if (!siteNav.classList.contains("open")) return;
    if (!e.target.closest(".site-nav") && !e.target.closest(".nav-toggle")) {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", false);
    }
  });

  // Close menu on link click (for smoother UX)
  siteNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", false);
    });
  });
});
