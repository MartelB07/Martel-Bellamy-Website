const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const photos = Array.from(document.querySelectorAll(".photography, .artwork"));

let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    const photo = photos[currentIndex];

    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    document.body.style.overflow = "";
}

function showPrevious() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    lightboxImage.src = photos[currentIndex].src;
    lightboxImage.alt = photos[currentIndex].alt;
}

function showNext() {
    currentIndex = (currentIndex + 1) % photos.length;
    lightboxImage.src = photos[currentIndex].src;
    lightboxImage.alt = photos[currentIndex].alt;
}

photos.forEach((photo, index) => {
    photo.style.cursor = "pointer";
    photo.addEventListener("click", () => openLightbox(index));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPrevious);
lightboxNext.addEventListener("click", showNext);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrevious();
    if (e.key === "ArrowRight") showNext();
});