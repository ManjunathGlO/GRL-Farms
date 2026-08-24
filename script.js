const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

menuToggle.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  menuToggle.textContent = mobileNav.classList.contains("open") ? "×" : "☰";
});

mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mobileNav.classList.remove("open");
  menuToggle.textContent = "☰";
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const galleryButtons = [...document.querySelectorAll("#galleryGrid button")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
let current = 0;

function openLightbox(index) {
  current = index;
  lightboxImage.src = galleryButtons[current].dataset.img;
  lightboxImage.alt = galleryButtons[current].querySelector("img").alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}
function moveImage(direction) {
  current = (current + direction + galleryButtons.length) % galleryButtons.length;
  openLightbox(current);
}
galleryButtons.forEach((button, index) => button.addEventListener("click", () => openLightbox(index)));
document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
document.getElementById("prevImage").addEventListener("click", () => moveImage(-1));
document.getElementById("nextImage").addEventListener("click", () => moveImage(1));
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") moveImage(-1);
  if (e.key === "ArrowRight") moveImage(1);
});