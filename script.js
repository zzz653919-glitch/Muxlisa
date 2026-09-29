const body = document.body;
const kimga = body.dataset.kimga || 'Ustoz';
const kimdan = body.dataset.kimdan || 'Shogirdingiz';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const steps = [
  { icon: '🎉', title: "O'qituvchi va murabbiylar kuni muborak!",
    text: `Hurmatli ${kimga}, 1-oktyabr bayrami bilan chin dildan tabriklaymiz!` },
  { icon: '📚', title: "Bilim uchun rahmat",
    text: "Siz bergan har bir dars hayotimizga yo'l ochdi. Sabringiz va mehringiz uchun katta rahmat." },
  { icon: '💡', title: "Siz tufayli oson bo'ldi",
    text: "Eng qiyin mavzu ham sizning tushuntirishingizda osonlashib qolardi. Har bir «tushundim» sizning yutug'ingiz." },
  { icon: '🌟', title: "Tilaklarimiz",
    text: "Sizga sog'lik, oilaviy baxt, tinch osmon va ko'p mehnatsevar shogirdlar tilaymiz." },
  { icon: '🍋', title: "Kichik choy tanaffusi",
    text: "Bugun dars ham, uy vazifasi ham yo'q. Faqat muzdek Lipton, limon va yaxshi kayfiyat!" },
  { icon: '❤️', title: "Ustoz — ikkinchi ota-ona",
    text: "Bergan tarbiyangiz va ko'rsatgan yo'lingizning qadriga doim yetamiz. Bayramingiz barakali bo'lsin!" },
];

const wishes = [
  "Bugun sizga faqat yaxshi xabarlar kelsin!",
  "Shogirdlaringiz sizdan ham o'zib ketsin!",
  "Choyingiz doim issiq, kayfiyatingiz doim a'lo bo'lsin!",
  "Sizning sabringiz uchun dunyoga medal kam!",
  "Har kuningiz bayramdek o'tsin!",
  "Sizdan o'rgangan har bir narsa bizda yashaydi!",
  "Doskadagi bo'r kabi, yaxshi so'zlaringiz ham qolsin!",
  "Bugun hech kim dars tayyorlamasin, faqat siz dam oling!",
];

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const dots = $('dots');
steps.forEach(() => dots.append(document.createElement('span')));

let current = 0;
let run = 0;

async function type(el, text, id) {
  if (reduce) { el.textContent = text; return; }
  el.textContent = '';
  el.classList.add('typing');
  for (const ch of text) {
    if (id !== run) return;
    el.textContent += ch;
    await wait(28);
  }
  el.classList.remove('typing');
}

async function show(n) {
  current = n;
  const id = ++run;
  [...dots.children].forEach((d, k) => d.classList.toggle('on', k === n));
  $('prev').disabled = n === 0;
  $('next').textContent = n === steps.length - 1 ? 'Boshidan' : 'Keyingi tabrik';
  $('title').classList.remove('typing');
  $('text').classList.remove('typing');
  $('wish').textContent = '';
  const icon = $('icon');
  icon.textContent = steps[n].icon;
  icon.classList.remove('hop');
  void icon.offsetWidth;
  icon.classList.add('hop');
  await type($('title'), steps[n].title, id);
  await type($('text'), steps[n].text, id);
  if (id === run && n === steps.length - 1) confetti(60);
}

function confetti(count = 40) {
  if (reduce) return;
  const colors = ['#e63946', '#2a9d8f', '#3a86ff', '#8338ec', '#ff9f1c', '#ffffff'];
  for (let k = 0; k < count; k++) {
    const p = document.createElement('div');
    p.className = 'conf';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[k % colors.length];
    p.style.animationDuration = 2 + Math.random() * 2.5 + 's';
    p.style.animationDelay = Math.random() * 0.6 + 's';
    document.body.append(p);
    setTimeout(() => p.remove(), 5000);
  }
}

// Bosilgan joyda belgilar sochiladi
function burst(x, y, n = 8) {
  if (reduce) return;
  const set = ['⭐', '🍋', '🍃', '❤️', '✨', '🧊', '🍑'];
  for (let k = 0; k < n; k++) {
    const p = document.createElement('span');
    const a = (Math.PI * 2 * k) / n + Math.random() * 0.5;
    const d = 60 + Math.random() * 70;
    p.className = 'pop';
    p.textContent = set[Math.floor(Math.random() * set.length)];
    p.style.left = x - 13 + 'px';
    p.style.top = y - 13 + 'px';
    p.style.setProperty('--dx', Math.cos(a) * d + 'px');
    p.style.setProperty('--dy', Math.sin(a) * d - 30 + 'px');
    p.style.setProperty('--rr', (Math.random() * 360 - 180) + 'deg');
    document.body.append(p);
    setTimeout(() => p.remove(), 1200);
  }
}

let lastWish = -1;
function gift(e) {
  let k;
  do { k = Math.floor(Math.random() * wishes.length); } while (k === lastWish);
  lastWish = k;
  const w = $('wish');
  w.classList.remove('show');
  void w.offsetWidth;
  w.textContent = wishes[k];
  w.classList.add('show');
  const r = e.currentTarget.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 12);
  confetti(30);
}

const go = (n) => show((n + steps.length) % steps.length);
$('next').onclick = () => go(current + 1);
$('prev').onclick = () => show(Math.max(0, current - 1));
$('gift').onclick = gift;
$('theme').onclick = () => {
  body.dataset.theme = (+body.dataset.theme + 1) % 4;
};

// Kartochkaning istalgan joyiga bosilsa belgilar sochiladi
document.querySelector('.card').addEventListener('click', (e) => {
  if (e.target.closest('button')) return;
  burst(e.clientX, e.clientY);
});

// Klaviatura va barmoq bilan surish
addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') go(current + 1);
  if (e.key === 'ArrowLeft') show(Math.max(0, current - 1));
});
let sx = null;
addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
addEventListener('touchend', (e) => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx;
  sx = null;
  if (dx < -60) go(current + 1);
  if (dx > 60) show(Math.max(0, current - 1));
}, { passive: true });

$('to').textContent = `Hurmatli ${kimga}!`;
$('from').textContent = kimdan;

// Sahifa ochilganda: otkritka konstruktor kabi yig'iladi, konfeti 5 marta otiladi,
// yig'ish tugagach matn yoziladi
if (!reduce) {
  for (let k = 0; k < 5; k++) setTimeout(() => confetti(30), 315 + k * 790);
}
setTimeout(() => show(0), reduce ? 0 : 3465);
