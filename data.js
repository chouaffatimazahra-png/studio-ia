/* =========================================================
   DATA — هنا تبدلي كلش بلا ما تمسي الكود
   - img: حطي مسار الصورة (مثلا "assets/models/femme-s-1.jpg")
     إذا خليتيها فارغة "" يبان placeholder ملوّن
   - video: (اختياري) مسار فيديو mp4
   ========================================================= */

const SITE = {
  brand: "STUDIO·IA",
  whatsapp: "213667526459",            // 0667 52 64 59 (بالصيغة الدولية بلا +)
  email: "magicseedsai@gmail.com",        // ← الإيميل تاعك
  // فيديو واحد "assets/hero.mp4" ولا بزاف بالترتيب ["a.mp4", "b.mp4"]  (16:9)
  heroVideo: ["assets/videos/hero-1-studio.mp4", "assets/videos/hero-2-mannequin.mp4"],
  heroVideoMobile: ["assets/videos/hero-mobile-1-studio.mp4", "assets/videos/hero-mobile-2-mannequin.mp4"], // 9:16 (téléphone)
  // image affichée pendant le chargement de chaque vidéo (même ordre) → jamais d'écran noir
  heroPoster: ["assets/hero-frames/shot1-studio-dark.webp", "assets/hero-frames/shot3-portrait-bijoux.webp"],
  currency: "DA",
  owner: "",                           // ← الاسم الكامل (يبان لتحت فالموقع) — يتبدل من لوحة التحكم
  social: { instagram: "", tiktok: "", facebook: "", linkedin: "", higgsfield: "" }, // روابط https://…
};

/* ---------- MANNEQUINS ---------- */
const CATEGORIES = [
  { id: "femmes",  label: "Femmes"  },
  { id: "hommes",  label: "Hommes"  },
  { id: "bebes",   label: "Bébés"   },
  { id: "enfants", label: "Enfants" },
  { id: "seniors", label: "Seniors" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// كل مانكان: id, name, cat, size + وحدة من هذو:
//   sheet:  صورة وحدة فيها الوجهات جنب بعض (قدام، 3/4، جنب، ورا) → تدور 3D بالماوس
//   frames: شحال من وجهة فالصورة (عادة 4)
//   turn:   (اختياري) فيديو 360° يلعب كي يجي الماوس فوقها
//   img:    صورة عادية وحدة
//   hero: false → تبان غير فالـ Casting، ماشي فالشريط تاع البداية
// الصور المصلحين (نفس العلو، فالوسط، بلا خلفية) فـ assets/models/final/
//   oNN = الشوتينغ الأول (4 وجهات، كحل) · nNN = الشوتينغ الثاني (قدام + ورا، أبيض/رمادي)
//   الوجوه فـ assets/models/final/faces/ — بدلي الأسماء والسايز كيما تحبي
const P = (n) => String(n).padStart(2, "0");
const O = (n) => ({ sheet: `assets/models/final/o${P(n)}.png`, face: `assets/models/final/faces/o${P(n)}.jpg`, frames: 4 });
const N = (n) => ({ sheet: `assets/models/final/n${P(n)}.png`, face: `assets/models/final/faces/n${P(n)}.jpg`, frames: 2, hero: false });
const MODELS = [
  // ---------- Femmes ----------
  { id: "o07", name: "Rania",     cat: "femmes",  size: "XS",  ...O(7) },
  { id: "n02", name: "Lilia",     cat: "femmes",  size: "XS",  ...N(2) },
  // n06 (Dounia) : morceau de main du gros plan collé à l'image de face → à retoucher
  { id: "o03", name: "Lina",      cat: "femmes",  size: "S",   ...O(3) },
  { id: "o21", name: "Yasmine",   cat: "femmes",  size: "S",   ...O(21) },
  { id: "o23", name: "Imane",     cat: "femmes",  size: "S",   ...O(23) },
  { id: "o04", name: "Kenza",     cat: "femmes",  size: "S",   ...O(4) },
  { id: "n01", name: "Amina",     cat: "femmes",  size: "S",   ...N(1) },
  { id: "n05", name: "Asma",      cat: "femmes",  size: "S",   ...N(5) },
  { id: "n53", name: "Feriel",    cat: "femmes",  size: "S",   ...N(53) },
  { id: "n54", name: "Ikram",     cat: "femmes",  size: "S",   ...N(54) },
  { id: "n59", name: "Nesrine",   cat: "femmes",  size: "S",   ...N(59) },
  // n60, n61, n63 : t-shirt blanc effacé avec le fond → à refaire / retoucher
  { id: "o22", name: "Meriem",    cat: "femmes",  size: "M",   ...O(22) },
  { id: "o24", name: "Selma",     cat: "femmes",  size: "M",   ...O(24) },
  { id: "o05", name: "Sarah",     cat: "femmes",  size: "M",   ...O(5) },
  { id: "n07", name: "Sabrina",   cat: "femmes",  size: "M",   ...N(7) },
  { id: "n44", name: "Chahrazed", cat: "femmes",  size: "M",   ...N(44) },
  { id: "n47", name: "Houda",     cat: "femmes",  size: "M",   ...N(47) },
  { id: "n55", name: "Leila",     cat: "femmes",  size: "M",   ...N(55) },
  { id: "o06", name: "Amel",      cat: "femmes",  size: "L",   ...O(6) },
  { id: "n03", name: "Hania",     cat: "femmes",  size: "L",   ...N(3) },
  { id: "n48", name: "Wafa",      cat: "femmes",  size: "L",   ...N(48) },
  { id: "n49", name: "Assia",     cat: "femmes",  size: "L",   ...N(49) },
  { id: "n50", name: "Siham",     cat: "femmes",  size: "L",   ...N(50) },
  { id: "n51", name: "Naima",     cat: "femmes",  size: "L",   ...N(51) },
  { id: "n56", name: "Zineb",     cat: "femmes",  size: "L",   ...N(56) },
  { id: "n57", name: "Khadidja",  cat: "femmes",  size: "L",   ...N(57) },
  { id: "n58", name: "Manel",     cat: "femmes",  size: "L",   ...N(58) },
  { id: "o02", name: "Nadia",     cat: "femmes",  size: "XL",  ...O(2) },
  { id: "n45", name: "Djamila",   cat: "femmes",  size: "XL",  ...N(45) },
  { id: "n46", name: "Souad",     cat: "femmes",  size: "XL",  ...N(46) },
  { id: "n52", name: "Malika",    cat: "femmes",  size: "XL",  ...N(52) },
  { id: "n62", name: "Lamia",     cat: "femmes",  size: "XL",  ...N(62) },
  { id: "o01", name: "Samira",    cat: "femmes",  size: "XXL", ...O(1) },
  // ---------- Hommes ----------
  { id: "o08", name: "Rayan",     cat: "hommes",  size: "S",   ...O(8) },
  { id: "n18", name: "Mehdi",     cat: "hommes",  size: "S",   ...N(18) },
  { id: "n20", name: "Bilal",     cat: "hommes",  size: "S",   ...N(20) },
  { id: "n22", name: "Hamza",     cat: "hommes",  size: "S",   ...N(22) },
  { id: "o10", name: "Adam",      cat: "hommes",  size: "M",   ...O(10) },
  { id: "n09", name: "Sofiane",   cat: "hommes",  size: "M",   ...N(9) },
  { id: "n16", name: "Nassim",    cat: "hommes",  size: "M",   ...N(16) },
  { id: "n17", name: "Amine",     cat: "hommes",  size: "M",   ...N(17) },
  { id: "n21", name: "Riad",      cat: "hommes",  size: "M",   ...N(21) },
  { id: "n25", name: "Farid",     cat: "hommes",  size: "M",   ...N(25) },
  { id: "o09", name: "Karim",     cat: "hommes",  size: "L",   ...O(9) },
  { id: "n10", name: "Walid",     cat: "hommes",  size: "L",   ...N(10) },
  { id: "n11", name: "Mourad",    cat: "hommes",  size: "L",   ...N(11) },
  { id: "n12", name: "Samir",     cat: "hommes",  size: "L",   ...N(12) },
  { id: "n23", name: "Hichem",    cat: "hommes",  size: "L",   ...N(23) },
  { id: "n24", name: "Lotfi",     cat: "hommes",  size: "L",   ...N(24) },
  { id: "n13", name: "Redouane",  cat: "hommes",  size: "XL",  ...N(13) },
  { id: "n19", name: "Toufik",    cat: "hommes",  size: "XL",  ...N(19) },
  { id: "n14", name: "Nabil",     cat: "hommes",  size: "XXL", ...N(14) },
  { id: "n15", name: "Djamel",    cat: "hommes",  size: "XXL", ...N(15) },
  // ---------- Bébés ----------
  { id: "o19", name: "Yanis",     cat: "bebes",   size: "XS",  ...O(19) },
  { id: "n42", name: "Amira",     cat: "bebes",   size: "XS",  ...N(42) },
  { id: "o20", name: "Wassim",    cat: "bebes",   size: "S",   ...O(20) },
  { id: "n43", name: "Taha",      cat: "bebes",   size: "S",   ...N(43) },
  // ---------- Enfants ----------
  { id: "o12", name: "Nour",      cat: "enfants", size: "XS",  ...O(12) },
  { id: "o14", name: "Anis",      cat: "enfants", size: "XS",  ...O(14) },
  { id: "n26", name: "Malak",     cat: "enfants", size: "XS",  ...N(26) },
  { id: "n28", name: "Hiba",      cat: "enfants", size: "XS",  ...N(28) },
  { id: "n30", name: "Aya",       cat: "enfants", size: "XS",  ...N(30) },
  { id: "n31", name: "Ritaj",     cat: "enfants", size: "XS",  ...N(31) },
  { id: "n37", name: "Iyad",      cat: "enfants", size: "XS",  ...N(37) },
  { id: "n38", name: "Adem",      cat: "enfants", size: "XS",  ...N(38) },
  { id: "o11", name: "Maya",      cat: "enfants", size: "S",   ...O(11) },
  { id: "o16", name: "Lyna",      cat: "enfants", size: "S",   ...O(16) },
  { id: "o15", name: "Yacine",    cat: "enfants", size: "S",   ...O(15) },
  { id: "n32", name: "Lamis",     cat: "enfants", size: "S",   ...N(32) },
  { id: "n33", name: "Nihad",     cat: "enfants", size: "S",   ...N(33) },
  { id: "n35", name: "Ayoub",     cat: "enfants", size: "S",   ...N(35) },
  { id: "n36", name: "Islem",     cat: "enfants", size: "S",   ...N(36) },
  { id: "n41", name: "Younes",    cat: "enfants", size: "S",   ...N(41) },
  { id: "o13", name: "Ilyes",     cat: "enfants", size: "M",   ...O(13) },
  { id: "n27", name: "Assil",     cat: "enfants", size: "M",   ...N(27) },
  { id: "n34", name: "Ghada",     cat: "enfants", size: "M",   ...N(34) },
  { id: "n39", name: "Haithem",   cat: "enfants", size: "M",   ...N(39) },
  { id: "n40", name: "Akram",     cat: "enfants", size: "M",   ...N(40) },
  { id: "n29", name: "Rahaf",     cat: "enfants", size: "L",   ...N(29) },
  // ---------- Seniors ----------
  { id: "o17", name: "Fatiha",    cat: "seniors", size: "M",   ...O(17) },
  { id: "o18", name: "Rachid",    cat: "seniors", size: "L",   ...O(18) },
];

/* ---------- BANDE DÉFILANTE (sous le hero) ----------
   صور حقيقية يدورو تحت العنوان. pos = أي جزء من الصورة يبان (مثلا "50% 20%")
   مؤقتا: الصور لي درتيهم. من بعد نبدلوهم بالمانكانات الكاملين */
const MARQUEE = [
  { img: "assets/hero-frames/shot3-portrait-bijoux.webp", pos: "62% 40%", label: "Bijoux" },
  { img: "assets/models/character-ref-femme-1.webp",      pos: "50% 30%", label: "Inès · M" },
  { img: "assets/hero-frames/shot1-studio-dark.webp",     pos: "70% 55%", label: "Studio" },
  { img: "assets/hero-frames/test-shot3-portrait.webp",   pos: "70% 35%", label: "Mode · Satin" },
  { img: "assets/models/character-ref-femme-1.webp",      pos: "100% 30%", label: "Vue dos" },
  { img: "assets/hero-frames/test-shot2-model.webp",      pos: "66% 45%", label: "Studio beige" },
  { img: "assets/models/character-ref-femme-1.webp",      pos: "0% 40%", label: "Portrait" },
];

/* ---------- LOCATIONS ---------- */
// type: studio · interieur · produit · exterieur   — img: "" = bientôt (à générer, voir PROMPTS-HIGGSFIELD.md)
const L = (n) => `assets/locations/loc-${String(n).padStart(2, "0")}.jpg`;
const LOCATIONS = [
  // ---------- Studios ----------
  { id: "l01", name: "Studio blanc lumineux",        type: "studio",    img: L(1) },
  { id: "l64", name: "Studio blanc · arche",         type: "studio",    img: "assets/locations/studio-blanc.jpg" },
  { id: "l02", name: "Studio crème",                 type: "studio",    img: L(2) },
  { id: "l03", name: "Fond papier beige",            type: "studio",    img: L(3) },
  { id: "l04", name: "Studio gris anthracite",       type: "studio",    img: L(4) },
  { id: "l05", name: "Studio noir",                  type: "studio",    img: L(5) },
  { id: "l06", name: "Fond vert (tous décors)",      type: "studio",    img: L(6) },
  { id: "l07", name: "Loft lumière du jour",         type: "studio",    img: L(7) },
  { id: "l13", name: "Atelier · table en bois",      type: "studio",    img: L(13) },
  { id: "l19", name: "Loft · miroir arche",          type: "studio",    img: L(19) },
  { id: "l20", name: "Loft · miroir noir",           type: "studio",    img: L(20) },
  // ---------- Intérieurs ----------
  { id: "l14", name: "Riad blanc · tapis berbère",   type: "interieur", img: L(14) },
  { id: "l15", name: "Riad · zellige",               type: "interieur", img: L(15) },
  { id: "l16", name: "Arcades · tapis rouge",        type: "interieur", img: L(16) },
  { id: "l17", name: "Alcôve mauresque",             type: "interieur", img: L(17) },
  { id: "l18", name: "Salon bohème",                 type: "interieur", img: L(18) },
  { id: "l21", name: "Appartement haussmannien",     type: "interieur", img: L(21) },
  { id: "l22", name: "Salon noir & or",              type: "interieur", img: L(22) },
  { id: "l23", name: "Arcades terracotta",           type: "interieur", img: L(23) },
  { id: "l24", name: "Patio zellige",                type: "interieur", img: L(24) },
  { id: "l32", name: "Escalier d'immeuble ancien",   type: "interieur", img: L(32) },
  // ---------- Produits (bijoux, cosmétiques…) ----------
  { id: "l08", name: "Podium beige",                 type: "produit",   img: L(8) },
  { id: "l09", name: "Podium courbe",                type: "produit",   img: L(9) },
  { id: "l10", name: "Marbre noir · spot",           type: "produit",   img: L(10) },
  { id: "l11", name: "Marbre noir · fumée",          type: "produit",   img: L(11) },
  { id: "l12", name: "Marbre noir · mise en scène",  type: "produit",   img: L(12) },
  // ---------- Extérieurs ----------
  { id: "l25", name: "Ruelle méditerranéenne",       type: "exterieur", img: L(25) },
  { id: "l26", name: "Escaliers de la médina",       type: "exterieur", img: L(26) },
  { id: "l27", name: "Rue parisienne",               type: "exterieur", img: L(27) },
  { id: "l28", name: "Front de mer · palmiers",      type: "exterieur", img: L(28) },
  { id: "l29", name: "Dunes du Sahara",              type: "exterieur", img: L(29) },
  { id: "l30", name: "Terrasse de café",             type: "exterieur", img: L(30) },
  { id: "l31", name: "Souk des cuivres",             type: "exterieur", img: L(31) },
  { id: "l33", name: "Jardin tropical",              type: "exterieur", img: L(33) },
  // ---------- Lieux réels (photos Unsplash, licence libre usage commercial) ----------
  { id: "s01", name: "Casbah d'Alger",               type: "exterieur", img: "assets/locations/real-s01.jpg" },
  { id: "s02", name: "Mansourah · Tlemcen",          type: "exterieur", img: "assets/locations/real-s02.jpg" },
  { id: "s05", name: "Ponts de Constantine",         type: "exterieur", img: "assets/locations/real-s05.jpg" },
  { id: "s06", name: "Ghardaïa · M'zab",             type: "exterieur", img: "assets/locations/real-s06.jpg" },
  { id: "s07", name: "Ksar dans le Sahara",          type: "exterieur", img: "assets/locations/real-s07.jpg" },
  { id: "s08", name: "Tombeau de la Chrétienne · Tipaza", type: "exterieur", img: "assets/locations/real-s08.jpg" },
  { id: "s09", name: "Santa Cruz · Oran",            type: "exterieur", img: "assets/locations/real-s09.jpg" },
  { id: "s10", name: "Paris · Tour Eiffel",          type: "exterieur", img: "assets/locations/real-s10.jpg" },
  { id: "s11", name: "Istanbul · Bosphore",          type: "exterieur", img: "assets/locations/real-s11.jpg" },
  { id: "s12", name: "Dubaï · Burj Khalifa",         type: "exterieur", img: "assets/locations/real-s12.jpg" },
  { id: "a01", name: "Grande Poste · Alger",         type: "exterieur", img: "assets/locations/real-a01.jpg" },
  { id: "a02", name: "Alger centre · rue haussmannienne", type: "exterieur", img: "assets/locations/real-a02.jpg" },
  { id: "a03", name: "Alger centre · immeuble d'angle", type: "exterieur", img: "assets/locations/real-a03.jpg" },
  { id: "a04", name: "Front de mer · arcades d'Alger", type: "exterieur", img: "assets/locations/real-a04.jpg" },
  { id: "s04", name: "Jardin d'Essai · allée des dragonniers", type: "exterieur", img: "assets/locations/real-s04.jpg" },
  // ---------- Bientôt (prompts prêts dans PROMPTS-HIGGSFIELD.md) ----------
  { id: "s03", name: "Notre-Dame d'Afrique · Alger", type: "exterieur", img: "" },
  { id: "s13", name: "Jardin d'Essai · grande allée & bassin", type: "exterieur", img: "" },
  { id: "s14", name: "Alger centre · la nuit",       type: "exterieur", img: "" },
];

/* ---------- PORTFOLIO (الخدمات لي درتيهم) ---------- */
// pos = partie de l'image à montrer dans la carte (16:10)
const PORTFOLIO = [
  { title: "Karakou · des toits de la Casbah", tag: "Mode · Traditionnel", quality: "ultra", video: "assets/portfolio/karakou-casbah.mp4" },
  { title: "Campagne · mannequin & bijoux", tag: "Vidéo",               video: "assets/videos/hero-2-mannequin.mp4" },
  { title: "Karakou velours brodé",         tag: "Mode · Traditionnel", img: "assets/portfolio/karakou-velours.webp", pos: "50% 30%" },
  { title: "Boucles d'oreilles or & diamants", tag: "Bijoux",           img: "assets/portfolio/boucles-or-diamants.webp", pos: "50% 55%" },
  { title: "Pull en maille · e-commerce",   tag: "Mode · Moderne",      img: "assets/portfolio/pull-maille.webp" },
  { title: "Écouteurs sans fil · pub",      tag: "Produit",             img: "assets/portfolio/ecouteurs.webp" },
  { title: "Portrait bijoux · lumière or",  tag: "Bijoux",              img: "assets/hero-frames/shot3-portrait-bijoux.webp", pos: "65% 35%" },
];

/* ---------- PACKS (الأسعار — بدليهم) ---------- */
const PACKS = [
  {
    id: "sample", name: "Sample", price: "—", period: "une fois",
    desc: "Pour tester la qualité avant de s'engager.",
    features: ["3 photos HD", "1 mannequin", "1 location studio", "Livraison 48h"],
  },
  {
    id: "standard", name: "Standard", price: "—", period: "/ mois",
    desc: "Pour les boutiques qui publient chaque semaine.",
    features: ["20 photos HD", "2 vidéos courtes (10s)", "3 mannequins au choix", "Studios + 1 extérieur"],
  },
  {
    id: "pro", name: "Pro", price: "—", period: "/ mois", featured: true,
    desc: "Le meilleur choix pour vendre sur Instagram & TikTok.",
    features: ["50 photos HD", "6 vidéos (jusqu'à 30s)", "Mannequins illimités", "Toutes les locations", "1 vidéo scénario"],
  },
  {
    id: "ultra", name: "Ultra", price: "—", period: "/ mois",
    desc: "Pour les marques qui veulent une vraie campagne.",
    features: ["Photos illimitées", "15 vidéos 4K", "Campagne complète", "Mannequin exclusif", "Priorité 24h"],
  },
];
