
(() => {
    const root = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");

    const storedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

    function applyTheme(theme) {
        root.dataset.theme = theme;
        if (!themeToggle) return;

        const isDark = theme === "dark";
        const icon = themeToggle.querySelector(".theme-toggle-icon");
        const label = themeToggle.querySelector(".theme-toggle-text");

        themeToggle.setAttribute("aria-pressed", String(isDark));
        if (icon) icon.textContent = isDark ? "☀️" : "🌙";
        if (label) label.textContent = isDark ? "Light" : "Dark";
    }

    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
            window.localStorage.setItem("theme", nextTheme);
            applyTheme(nextTheme);
        });
    }

    const brandPill = document.querySelector(".brand");
    const navMenu = document.querySelector(".nav-menu");

    if (brandPill && navMenu) {
        const canHover = window.matchMedia("(hover: hover)").matches;
        let closeTimer = null;

        function openNav() {
            window.clearTimeout(closeTimer);
            navMenu.classList.add("open");
            brandPill.setAttribute("aria-expanded", "true");
        }

        function closeNav() {
            navMenu.classList.remove("open");
            brandPill.setAttribute("aria-expanded", "false");
        }

        function scheduleClose() {
            closeTimer = window.setTimeout(closeNav, 140);
        }

        if (canHover) {
            brandPill.addEventListener("mouseenter", openNav);
            brandPill.addEventListener("mouseleave", scheduleClose);
            navMenu.addEventListener("mouseenter", openNav);
            navMenu.addEventListener("mouseleave", scheduleClose);
        }

        brandPill.addEventListener("click", (event) => {
            event.preventDefault();
            navMenu.classList.contains("open") ? closeNav() : openNav();
        });

        document.addEventListener("click", (event) => {
            if (!event.target.closest(".brand-group")) closeNav();
        });
    }

    const revealItems = document.querySelectorAll(".reveal-on-scroll");
    if ("IntersectionObserver" in window && revealItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14 });

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    const contactModal = document.getElementById("contactModal");
    const openContactButtons = document.querySelectorAll("[data-open-contact]");
    const closeContactButtons = document.querySelectorAll("[data-close-contact]");
    const quickEmailForm = document.getElementById("quickEmailForm");

    function openContactModal() {
        if (!contactModal) return;
        contactModal.classList.add("active");
        contactModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        const firstInput = contactModal.querySelector("input, textarea, button");
        if (firstInput) window.setTimeout(() => firstInput.focus(), 80);
    }

    function closeContactModal() {
        if (!contactModal) return;
        contactModal.classList.remove("active");
        contactModal.setAttribute("aria-hidden", "true");
        if (!document.querySelector(".lightbox.active")) {
            document.body.classList.remove("modal-open");
        }
    }

    openContactButtons.forEach((button) => button.addEventListener("click", openContactModal));
    closeContactButtons.forEach((button) => button.addEventListener("click", closeContactModal));

    if (quickEmailForm) {
        quickEmailForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = quickEmailForm.querySelector("#emailName")?.value.trim() || "";
            const message = quickEmailForm.querySelector("#emailMessage")?.value.trim() || "";
            const subject = encodeURIComponent("Portfolio Contact");
            const bodyLines = [];

            if (name) bodyLines.push(`Name: ${name}`);
            if (message) bodyLines.push("", message);

            const body = encodeURIComponent(bodyLines.join("\n"));
            window.location.href = `mailto:martelpb2007@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const photos = Array.from(document.querySelectorAll(".photography, .artwork"));
    let currentIndex = 0;

    function openLightbox(index) {
        if (!lightbox || !lightboxImage || !photos[index]) return;
        currentIndex = index;
        const photo = photos[currentIndex];
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    }

    function closeLightbox() {
        if (!lightbox || !lightboxImage) return;
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";
        lightboxImage.alt = "";
        if (!contactModal || !contactModal.classList.contains("active")) {
            document.body.classList.remove("modal-open");
        }
    }

    function showPrevious() {
        if (!lightboxImage || photos.length === 0) return;
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        lightboxImage.src = photos[currentIndex].src;
        lightboxImage.alt = photos[currentIndex].alt;
    }

    function showNext() {
        if (!lightboxImage || photos.length === 0) return;
        currentIndex = (currentIndex + 1) % photos.length;
        lightboxImage.src = photos[currentIndex].src;
        lightboxImage.alt = photos[currentIndex].alt;
    }

    if (lightbox && lightboxImage && lightboxClose && lightboxPrev && lightboxNext && photos.length > 0) {
        photos.forEach((photo, index) => {
            photo.style.cursor = "pointer";
            photo.addEventListener("click", () => openLightbox(index));
        });

        lightboxClose.addEventListener("click", closeLightbox);
        lightboxPrev.addEventListener("click", showPrevious);
        lightboxNext.addEventListener("click", showNext);

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeContactModal();
            closeLightbox();
        }
        if (lightbox && lightbox.classList.contains("active")) {
            if (event.key === "ArrowLeft") showPrevious();
            if (event.key === "ArrowRight") showNext();
        }
    });


    const musicFilterButtons = Array.from(document.querySelectorAll("[data-music-filter]"));
    const musicCards = Array.from(document.querySelectorAll(".filter-track[data-genre]"));

    if (musicFilterButtons.length > 0 && musicCards.length > 0) {
        musicFilterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.musicFilter || "all";

                musicFilterButtons.forEach((filterButton) => filterButton.classList.remove("active"));
                button.classList.add("active");

                musicCards.forEach((card) => {
                    const genres = (card.dataset.genre || "").split(" ");
                    const shouldShow = filter === "all" || genres.includes(filter);
                    card.classList.toggle("is-hidden", !shouldShow);
                });
            });
        });
    }

    const mediaPlayers = Array.from(document.querySelectorAll("audio, video"));
    mediaPlayers.forEach((player) => {
        player.addEventListener("play", () => {
            mediaPlayers.forEach((otherPlayer) => {
                if (otherPlayer !== player && !otherPlayer.paused) {
                    otherPlayer.pause();
                }
            });
        });
    });


    const randomTracks = [
        { title: "Wish Me Luck", src: "music/audio/singles/wish-me-luck.mp3", description: "" },
        { title: "All I Have Is Me", src: "music/audio/singles/all-i-have-is-me.mp3", description: "" },
        { title: "Atlas", src: "music/audio/singles/atlas.mp3", description: "" },
        { title: "Beautiful", src: "music/audio/singles/beautiful.mp3", description: "" },
        { title: "Golden Gaurdian", src: "music/audio/singles/golden-gaurdian.mp3", description: "" },
        { title: "Luminance", src: "music/audio/singles/luminance.mp3", description: "" },
        { title: "Legion", src: "music/audio/singles/legion.mp3", description: "" },
        { title: "Little Bit Of Spice", src: "music/audio/singles/little-bit-of-spice.mp3", description: "" },
        { title: "Low-High Low-Fi", src: "music/audio/singles/low-high-low-fi.wav", description: "" },
        { title: "Melodic", src: "music/audio/singles/melodic.mp3", description: "" },
        { title: "Phonk Mix", src: "music/audio/singles/phonk-mix.mp3", description: "" },
        { title: "Rising", src: "music/audio/singles/rising.mp3", description: "" },
        { title: "Together", src: "music/audio/singles/together.mp3", description: "" },
        { title: "Wish me Luck", src: "music/audio/singles/wish-me-luck.mp3", description: "" },
        { title: "Dimensions", src: "music/audio/singles/dimensions.mp3", description: "" },
        { title: "Maybe Another Time", src: "music/audio/singles/maybe-another-time.mp3", description: "" }
    ];

    const randomAudioPlayer = document.getElementById("randomAudioPlayer");
    const randomPlayPause = document.getElementById("randomPlayPause");
    const randomNextTrack = document.getElementById("randomNextTrack");
    const randomTrackTitle = document.getElementById("randomTrackTitle");
    const randomTrackDescription = document.getElementById("randomTrackDescription");
    let currentRandomTrack = -1;

    function loadRandomTrack(shouldPlay = false) {
        if (!randomAudioPlayer || randomTracks.length === 0) return;
        let nextIndex = Math.floor(Math.random() * randomTracks.length);
        if (randomTracks.length > 1) {
            while (nextIndex === currentRandomTrack) {
                nextIndex = Math.floor(Math.random() * randomTracks.length);
            }
        }
        currentRandomTrack = nextIndex;
        const track = randomTracks[currentRandomTrack];
        randomAudioPlayer.src = track.src;
        if (randomTrackTitle) randomTrackTitle.textContent = track.title;
        if (randomTrackDescription) randomTrackDescription.textContent = track.description;
        if (shouldPlay) randomAudioPlayer.play().catch(() => {});
    }

    if (randomAudioPlayer && randomPlayPause) {
        if (currentRandomTrack === -1) loadRandomTrack(false);

        randomPlayPause.addEventListener("click", () => {
            if (randomAudioPlayer.paused) {
                if (!randomAudioPlayer.src) loadRandomTrack(false);
                randomAudioPlayer.play().catch(() => {});
            } else {
                randomAudioPlayer.pause();
            }
        });

        randomAudioPlayer.addEventListener("play", () => {
            randomPlayPause.textContent = "Pause";
        });

        randomAudioPlayer.addEventListener("pause", () => {
            randomPlayPause.textContent = "Play Random";
        });

        randomAudioPlayer.addEventListener("ended", () => loadRandomTrack(true));
    }

    if (randomNextTrack) {
        randomNextTrack.addEventListener("click", () => loadRandomTrack(true));
    }


    function formatMediaTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${remaining}`;
    }

    const customAudioControls = Array.from(document.querySelectorAll("[data-audio-control]"));

    customAudioControls.forEach((control) => {
        const audio = control.querySelector("audio");
        const progress = control.querySelector(".audio-progress");
        const currentTime = control.querySelector(".current-time");
        const duration = control.querySelector(".duration");
        const card = control.closest(".track-card, .album-track");
        const toggleButtons = Array.from(card ? card.querySelectorAll("[data-audio-toggle]") : control.querySelectorAll("[data-audio-toggle]"));

        if (!audio) return;

        function setButtonState(isPlaying) {
            toggleButtons.forEach((button) => {
                const compact = button.classList.contains("cover-play-button") || button.classList.contains("album-play-button");
                button.textContent = isPlaying ? (compact ? "❚❚" : "Pause") : (compact ? "▶" : "Play");
                button.setAttribute("aria-pressed", String(isPlaying));
            });
            if (card) card.classList.toggle("is-playing", isPlaying);
        }

        function updateProgress() {
            if (!progress) return;
            const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
            progress.value = String(percent);
            progress.style.setProperty("--progress", `${percent}%`);
            if (currentTime) currentTime.textContent = formatMediaTime(audio.currentTime);
            if (duration) duration.textContent = formatMediaTime(audio.duration);
        }

        toggleButtons.forEach((button) => {
            button.addEventListener("click", () => {
                if (audio.paused) {
                    audio.play().catch(() => {});
                } else {
                    audio.pause();
                }
            });
        });

        if (progress) {
            progress.addEventListener("input", () => {
                if (!audio.duration) return;
                audio.currentTime = (Number(progress.value) / 100) * audio.duration;
                updateProgress();
            });
        }

        audio.addEventListener("loadedmetadata", updateProgress);
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("play", () => setButtonState(true));
        audio.addEventListener("pause", () => setButtonState(false));
        audio.addEventListener("ended", () => setButtonState(false));
        updateProgress();
    });

})();
