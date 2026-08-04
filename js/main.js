/* ============ NAVBAR ============ */
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", onScroll);
onScroll();

navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
});

// Tutup menu mobile saat link diklik
navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
    })
);

/* ============ AKTIFKAN LINK NAV SAAT SCROLL ============ */
const sections = document.querySelectorAll("section[id], header[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navAnchors.forEach((a) => {
                a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
            });
        });
    },
    { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

/* ============ ANIMASI ANGKA STATISTIK ============ */
function animateCount(el, target, duration = 1500) {
    const start = performance.now();
    function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("id-ID");
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
    (entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            animateCount(document.getElementById("stat-siswa"), 36);
            animateCount(document.getElementById("stat-mapel"), 8);
        });
    },
    { threshold: 0.5 }
);
statObserver.observe(document.querySelector(".hero-stats"));

/* ============ REVEAL ON SCROLL ============ */
const revealObserver = new IntersectionObserver(
    (entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);
document
    .querySelectorAll(".section > .container > *:not(.section-head), .section-head")
    .forEach((el) => {
        if (el.querySelector("h2") || el.classList.contains("about-grid") ||
            el.classList.contains("skill-grid") || el.classList.contains("member-grid") ||
            el.classList.contains("schedule-grid") || el.classList.contains("contact-grid") ||
            el.classList.contains("hero-cta")) {
            el.classList.add("reveal");
            revealObserver.observe(el);
        }
    });

/* ============ DATA ANGGOTA (tersimpan di localStorage) ============ */
const DEFAULT_MEMBERS = [
    "Ahmad Fauzi",
    "Bella Putri",
    "Candra Wijaya",
    "Dinda Ayu",
    "Eko Prasetyo",
    "Fajar Ramadhan",
    "Gita Maharani",
    "Hendra Gunawan",
];

const STORAGE_KEY = "tkj1_members";

function getMembers() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(stored) && stored.length) return stored;
    } catch (e) { /* abaikan */ }
    return DEFAULT_MEMBERS.slice();
}

function saveMembers(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const memberGrid = document.getElementById("memberGrid");
const addMemberBtn = document.getElementById("addMember");

function renderMembers() {
    const members = getMembers();
    memberGrid.innerHTML = "";
    members.forEach((name, i) => {
        const initials = name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

        const card = document.createElement("article");
        card.className = "member-card reveal visible";
        card.innerHTML = `
            <div class="member-avatar">${initials}</div>
            <h3>${name}</h3>
            <p>Siswa ${i + 1}</p>
            <button class="delete-member" title="Hapus">✕ hapus</button>
        `;

        // Klik kartu = ubah nama
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-member")) return;
            const newName = prompt("Ubah nama siswa:", name);
            if (newName && newName.trim()) {
                const list = getMembers();
                list[i] = newName.trim();
                saveMembers(list);
                renderMembers();
            }
        });

        // Hapus anggota
        card.querySelector(".delete-member").addEventListener("click", (e) => {
            e.stopPropagation();
            if (!confirm(`Hapus "${name}" dari daftar?`)) return;
            const list = getMembers();
            list.splice(i, 1);
            saveMembers(list);
            renderMembers();
        });

        memberGrid.appendChild(card);
    });
}

addMemberBtn.addEventListener("click", () => {
    const newName = prompt("Nama siswa baru:");
    if (newName && newName.trim()) {
        const list = getMembers();
        list.push(newName.trim());
        saveMembers(list);
        renderMembers();
    }
});

renderMembers();

/* ============ JADWAL ============ */
const SCHEDULE = [
    {
        day: "Senin",
        icon: "🟢",
        items: [
            { time: "07.30", name: "Upacara / Senam" },
            { time: "08.30", name: "Matematika" },
            { time: "10.00", name: "Teknologi Jaringan" },
            { time: "12.30", name: "B. Indonesia" },
            { time: "14.00", name: "Produktif TKJ" },
        ],
    },
    {
        day: "Selasa",
        icon: "🟡",
        items: [
            { time: "07.30", name: "Pend. Agama" },
            { time: "09.00", name: "Jaringan Komputer" },
            { time: "11.00", name: "Bahasa Inggris" },
            { time: "12.30", name: "Produktif TKJ" },
            { time: "14.00", name: "Bimbingan Konseling" },
        ],
    },
    {
        day: "Rabu",
        icon: "🔵",
        items: [
            { time: "07.30", name: "Fisika" },
            { time: "09.00", name: "Perakitan Komputer" },
            { time: "11.00", name: "Seni Budaya" },
            { time: "12.30", name: "Teknologi Jaringan" },
            { time: "14.00", name: "Kegiatan Mandiri" },
        ],
    },
    {
        day: "Kamis",
        icon: "🟣",
        items: [
            { time: "07.30", name: "Bahasa Inggris" },
            { time: "09.00", name: "Sistem Operasi" },
            { time: "11.00", name: "Matematika" },
            { time: "12.30", name: "Produktif TKJ" },
            { time: "14.00", name: "Pramuka" },
        ],
    },
    {
        day: "Jumat",
        icon: "🔴",
        items: [
            { time: "07.30", name: "B. Indonesia" },
            { time: "09.00", name: "PJOK" },
            { time: "10.30", name: "Jaringan Komputer" },
            { time: "12.00", name: "Keagamaan / Rohis" },
        ],
    },
    {
        day: "Sabtu",
        icon: "⚪",
        items: [
            { time: "08.00", name: "Ekstrakurikuler" },
            { time: "10.00", name: "UKK / Latihan Project" },
            { time: "12.00", name: "Bersih-bersih Kelas" },
        ],
    },
];

const scheduleGrid = document.getElementById("scheduleGrid");

SCHEDULE.forEach((d) => {
    const card = document.createElement("article");
    card.className = "day-card";
    card.innerHTML = `
        <h3>${d.icon} ${d.day}</h3>
        <ul>
            ${d.items
                .map((i) => `<li><span class="time">${i.time}</span>${i.name}</li>`)
                .join("")}
        </ul>
    `;
    scheduleGrid.appendChild(card);
});

/* ============ FORM KONTAK ============ */
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.getElementById("nama").value.trim();

    // Tampilkan pesan sukses (demo — belum dikirim ke server)
    const success = document.createElement("div");
    success.className = "form-success show";
    success.textContent = `Terima kasih, ${nama}! Pesan kamu sudah tersimpan. (Demo — hubungkan ke WhatsApp/email untuk pengiriman nyata.)`;
    contactForm.appendChild(success);

    contactForm.reset();
    setTimeout(() => success.remove(), 6000);
});
