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

/* ---------- docs table of contents ---------- */

const toc = document.querySelector(".docs-toc");

if (toc) {
  const depth = Number.parseInt(toc.dataset.depth ?? "3", 10);
  const headingSelector =
    depth >= 3
      ? ".docs-content h2[id], .docs-content h3[id]"
      : ".docs-content h2[id]";
  const headings = document.querySelectorAll(headingSelector);
  const list = document.createElement("ol");
  const linkFor = new Map();

  for (const heading of headings) {
    const item = document.createElement("li");
    item.className = heading.tagName === "H3" ? "toc-h3" : "toc-h2";
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    item.append(link);
    list.append(item);
    linkFor.set(heading.id, link);
  }

  toc.append(list);

  // Hover-revealed anchor links, added after the TOC is built so its
  // labels don't pick up the "#" text.
  for (const heading of document.querySelectorAll(
    ".docs-content h2[id], .docs-content h3[id], .docs-content h4[id]",
  )) {
    const anchor = document.createElement("a");
    anchor.className = "anchor-link";
    anchor.href = `#${heading.id}`;
    anchor.textContent = "#";
    anchor.setAttribute("aria-label", `Link to ${heading.textContent}`);
    heading.append(anchor);
  }

  // Highlight the section under the top of the viewport as it scrolls.
  let activeLink = null;
  const setActive = (id) => {
    const link = linkFor.get(id);
    if (!link || link === activeLink) return;
    activeLink?.removeAttribute("aria-current");
    link.setAttribute("aria-current", "true");
    activeLink = link;
    link.scrollIntoView({ block: "nearest" });
  };

  const visible = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.add(entry.target.id);
        } else {
          visible.delete(entry.target.id);
        }
      }
      // Prefer the first visible heading. When none intersect the band,
      // keep the last heading that scrolled above it.
      for (const heading of headings) {
        if (visible.has(heading.id)) {
          setActive(heading.id);
          return;
        }
        if (heading.getBoundingClientRect().top > 0) break;
        setActive(heading.id);
      }
    },
    { rootMargin: "0px 0px -70% 0px" },
  );

  for (const heading of headings) {
    observer.observe(heading);
  }

  // Mobile collapse.
  const sidebar = document.querySelector(".docs-sidebar");
  const tocToggle = document.querySelector(".docs-toc-toggle");
  tocToggle.addEventListener("click", () => {
    const open = sidebar.dataset.open === "true";
    sidebar.dataset.open = String(!open);
    tocToggle.setAttribute("aria-expanded", String(!open));
  });
  toc.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      sidebar.dataset.open = "false";
      tocToggle.setAttribute("aria-expanded", "false");
    }
  });
}
