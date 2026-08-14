(function () {
  const toggle = document.querySelector(".menu-toggle");
  const sidebar = document.getElementById("site-nav");
  const backdrop = document.querySelector(".nav-backdrop");

  if (!toggle || !sidebar || !backdrop) return;

  function setOpen(open) {
    sidebar.classList.toggle("is-open", open);
    backdrop.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setOpen(!sidebar.classList.contains("is-open"));
  });

  backdrop.addEventListener("click", function () {
    setOpen(false);
  });

  sidebar.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 899px)").matches) {
        setOpen(false);
      }
    });
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setOpen(false);
  });
})();
