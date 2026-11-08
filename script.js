/*
  PENTING: Atur tanggal dan jam ulang tahun di bawah ini.
  Format: TAHUN-BULAN-TANGGAL T JAM:MENIT:DETIK
  Contoh: "2026-11-10T00:00:00"
  Waktu mengikuti zona waktu perangkat yang membuka website.
*/
const BIRTHDAY_DATE = "2026-11-07T00:00:00";

const $ = (id) => document.getElementById(id);
const stages = ["stage-countdown","stage-gift","stage-letter","stage-album","stage-video","stage-final"];
let countdownTimer;

function showStage(id) {
  stages.forEach(stageId => $(stageId).classList.toggle("active", stageId === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateCountdown() {
  const target = new Date(BIRTHDAY_DATE).getTime();
  const now = Date.now();
  let distance = target - now;

  if (Number.isNaN(target)) {
    $("countdownHint").textContent = "Format tanggal belum benar. Periksa BIRTHDAY_DATE di script.js.";
    $("clickMe").disabled = true;
    return;
  }

  if (distance <= 0) {
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";
    $("countdownHint").textContent = "Yeay! Hari spesialmu sudah tiba. Saatnya membuka kejutan! ♡";
    $("clickMe").disabled = false;
    $("clickMe").classList.remove("locked");
    $("lockText").textContent = "your surprise is ready!";
    clearInterval(countdownTimer);
    return;
  }

  const totalHours = Math.floor(distance / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  $("hours").textContent = String(totalHours).padStart(2, "0");
  $("minutes").textContent = String(minutes).padStart(2, "0");
  $("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
countdownTimer = setInterval(updateCountdown, 1000);

$("clickMe").addEventListener("click", () => {
  if (!$("clickMe").disabled) showStage("stage-gift");
});

$("openGift").addEventListener("click", () => {
  const gift = $("openGift");
  if (gift.classList.contains("opened")) return;
  gift.classList.add("opened");
  setTimeout(() => showStage("stage-letter"), 1050);
});

$("openEnvelope").addEventListener("click", () => {
  const envelope = $("openEnvelope");
  if (envelope.classList.contains("opened")) return;
  envelope.classList.add("opened");
  setTimeout(() => {
    $("letterMessage").classList.add("show");
    $("letterMessage").scrollIntoView({ behavior: "smooth", block: "center" });
  }, 850);
});

document.querySelectorAll(".next-btn").forEach(button => {
  button.addEventListener("click", () => showStage(button.dataset.next));
});

// ==========================================================
 // MEDIA KENANGAN: atur file foto dan video langsung di sini.
 // Simpan file di folder "media" sejajar dengan index.html.
 // Contoh: "media/foto-1.jpg" dan "media/video-kenangan.mp4".
 // Kosongkan array/string jika belum ingin menampilkan media.
 // ==========================================================
const MEMORY_PHOTOS = [
  "media/p0.jpeg",
  "media/p1.jpeg",
  "media/p2.jpeg",
  "media/p3.jpeg",
  "media/p4.jpeg",
  "media/p5.jpeg"
];
const MEMORY_VIDEO = "media/vidio.mp4";

let currentSlide = 0;
const slider = $("memorySlider");
const slideDots = $("slideDots");
const slideImage = document.querySelector(".memory-photo");
const slidePlaceholder = document.querySelector(".photo-placeholder");
const slideCaption = document.querySelector(".photo-slide figcaption");

function renderSlide(index) {
  if (!slider) return;
  const count = MEMORY_PHOTOS.length;
  if (!count) {
    slideImage.hidden = true;
    slidePlaceholder.textContent = "Tambahkan foto di folder media ♡";
    slideDots.innerHTML = "";
    return;
  }
  currentSlide = (index + count) % count;
  slideImage.src = MEMORY_PHOTOS[currentSlide];
  slideImage.hidden = false;
  slidePlaceholder.hidden = true;
  slideImage.onerror = () => {
    slideImage.hidden = true;
    slidePlaceholder.hidden = false;
    slidePlaceholder.textContent = "File foto belum ditemukan";
  };
  slideCaption.textContent = ["Princess Kecil ♡","Princess prengut ♡","Princess Morning Person ♡","Princess Olahraga ♡","Princess Khawatir ♡","Princess Kondangan ♡"][currentSlide % 6];
  slideDots.innerHTML = "";
  MEMORY_PHOTOS.forEach((_, dotIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slide-dot" + (dotIndex === currentSlide ? " active" : "");
    dot.setAttribute("aria-label", "Lihat foto " + (dotIndex + 1));
    dot.addEventListener("click", () => renderSlide(dotIndex));
    slideDots.appendChild(dot);
  });
  const figure = document.querySelector(".photo-slide");
  figure.classList.remove("slide-enter");
  void figure.offsetWidth;
  figure.classList.add("slide-enter");
}
$("prevSlide").addEventListener("click", () => renderSlide(currentSlide - 1));
$("nextSlide").addEventListener("click", () => renderSlide(currentSlide + 1));
renderSlide(0);
setInterval(() => {
  if ($("stage-album").classList.contains("active") && MEMORY_PHOTOS.length > 1) {
    renderSlide(currentSlide + 1);
  }
}, 5000);

const memoryVideo = $("memoryVideo");
const videoPlaceholder = $("videoPlaceholder");
if (MEMORY_VIDEO) {
  memoryVideo.src = MEMORY_VIDEO;
  memoryVideo.hidden = false;
  videoPlaceholder.hidden = true;
  memoryVideo.addEventListener("error", () => {
    memoryVideo.hidden = true;
    videoPlaceholder.hidden = false;
    videoPlaceholder.querySelector("small").textContent = "Periksa lokasi file MEMORY_VIDEO di script.js";
  });
}

$("replayBtn").addEventListener("click", () => {
  $("openGift").classList.remove("opened");
  $("openEnvelope").classList.remove("opened");
  $("letterMessage").classList.remove("show");
  showStage("stage-countdown");
});

// Kalau tanggal yang disetel sudah lewat saat website dibuka, tombol langsung aktif.


// Musik romantis instrumental orisinal berbasis Web Audio.
// Browser meminta interaksi pengguna terlebih dahulu sebelum audio diputar.
let romanticAudioContext = null;
let romanticMusicTimer = null;
let romanticMusicOn = false;
let noteIndex = 0;
const romanticNotes = [
  [261.63, 329.63, 392.00], [293.66, 349.23, 440.00],
  [246.94, 329.63, 392.00], [220.00, 293.66, 369.99]
];

function playSoftChord() {
  if (!romanticAudioContext || !romanticMusicOn) return;
  const now = romanticAudioContext.currentTime;
  const chord = romanticNotes[noteIndex % romanticNotes.length];
  chord.forEach((frequency, index) => {
    const oscillator = romanticAudioContext.createOscillator();
    const gain = romanticAudioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.035 : 0.018, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
    oscillator.connect(gain);
    gain.connect(romanticAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 2.9);
  });
  noteIndex++;
}

async function toggleRomanticMusic() {
  const button = $("musicToggle");
  if (!romanticAudioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      button.textContent = "Musik tidak didukung browser ini";
      return;
    }
    romanticAudioContext = new AudioContextClass();
  }
  if (romanticAudioContext.state === "suspended") {
    await romanticAudioContext.resume();
  }
  romanticMusicOn = !romanticMusicOn;
  if (romanticMusicOn) {
    playSoftChord();
    romanticMusicTimer = setInterval(playSoftChord, 2900);
    button.textContent = "♫ Matikan musik";
    button.setAttribute("aria-pressed", "true");
  } else {
    clearInterval(romanticMusicTimer);
    button.textContent = "♫ Nyalakan musik";
    button.setAttribute("aria-pressed", "false");
  }
}

$("musicToggle").addEventListener("click", toggleRomanticMusic);
