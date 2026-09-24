// ==========================================================
// NS Unisex Hair Studio 1929 — site script
// ==========================================================

// TODO: replace with the salon's WhatsApp number (country code, digits only), e.g. "919876543210"
const SALON_PHONE = "910000000000";

// Nav: shrink on scroll + mobile toggle
const nav = document.getElementById("nav");
const toggle = document.getElementById("navToggle");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});
document.querySelectorAll("#navLinks a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  })
);

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  io.observe(el);
});

// Service tabs
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".menu");
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });
    panels.forEach((p) => {
      const match = p.dataset.panel === tab.dataset.tab;
      p.hidden = !match;
      p.classList.toggle("is-active", match);
    });
  })
);

// Opening hours: highlight today + open/closed status (IST)
(function hours() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = document.querySelector(`#hoursList li[data-day="${day}"]`);
  if (today) today.classList.add("is-today");

  const status = document.getElementById("openStatus");
  const open = day !== 2 && mins >= 570 && mins < 1200; // 9:30–20:00, closed Tuesday
  const nextWed = day === 2 || (day === 1 && mins >= 1200);
  const when = nextWed ? " Wednesday" : mins >= 1200 ? " tomorrow" : "";
  status.textContent = open ? "Open now · closes 8:00 pm" : `Closed now · opens 9:30 am${when}`;
  status.classList.add(open ? "is-open" : "is-closed");
})();

// WhatsApp + call links
const waBase = `https://wa.me/${SALON_PHONE}`;
document.querySelectorAll(".js-wa").forEach((a) => {
  a.href = `${waBase}?text=${encodeURIComponent("Hi NS Hair Studio 1929, I'd like to book an appointment.")}`;
});
document.querySelectorAll(".js-call").forEach((a) => (a.href = `tel:+${SALON_PHONE}`));

// Booking form -> WhatsApp message
const form = document.getElementById("bookingForm");
const err = document.getElementById("formError");
const dateInput = form.elements.date;
dateInput.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  err.textContent = "";
  const f = form.elements;

  if (!form.checkValidity()) {
    err.textContent = "Please fill in your name, a valid phone number, service, date and time.";
    form.querySelector(":invalid")?.focus();
    return;
  }
  const picked = new Date(f.date.value + "T00:00");
  if (picked.getDay() === 2) {
    err.textContent = "We're closed on Tuesdays — please choose another day.";
    f.date.focus();
    return;
  }

  const niceDate = picked.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const msg = [
    "Hi NS Hair Studio 1929! I'd like to book an appointment.",
    "",
    `Name: ${f.name.value.trim()}`,
    `Phone: ${f.phone.value.trim()}`,
    `Service: ${f.service.value}`,
    `Date: ${niceDate}`,
    `Time: ${f.time.value}`,
    f.notes.value.trim() ? `Notes: ${f.notes.value.trim()}` : "",
  ].filter(Boolean).join("\n");

  window.open(`${waBase}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();
