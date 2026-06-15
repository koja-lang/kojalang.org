document.querySelector(".theme-toggle").addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
});

const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const menuLinks = () => nav.querySelectorAll("#nav-menu a");

const setMenuOpen = (open) => {
  nav.dataset.open = String(open);
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
};

const openMenu = () => {
  setMenuOpen(true);
  // Defer so the menu is visible (not visibility:hidden) before focusing.
  requestAnimationFrame(() => menuLinks()[0]?.focus());
};

const closeMenu = ({ returnFocus = true } = {}) => {
  setMenuOpen(false);
  if (returnFocus) {
    navToggle.focus();
  }
};

navToggle.addEventListener("click", () => {
  if (nav.dataset.open === "true") {
    closeMenu();
  } else {
    openMenu();
  }
});

document.addEventListener("click", (event) => {
  if (nav.dataset.open === "true" && !nav.contains(event.target)) {
    closeMenu({ returnFocus: false });
  }
});

document.addEventListener("keydown", (event) => {
  if (nav.dataset.open !== "true") return;
  if (event.key === "Escape") {
    closeMenu();
    return;
  }
  if (event.key !== "Tab") return;
  // Trap focus within the open full-screen menu (close button + links).
  const focusables = [navToggle, ...menuLinks()];
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
