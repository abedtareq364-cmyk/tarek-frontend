// ==========================================
// Tarek.Dev - ملف الجافاسكريبت (script.js)
// ==========================================

const translations = {
  ar: {
    nav_home: "الرئيسية",
    nav_about: "من نحن",
    nav_blog: "المدونة",
    nav_projects: "المشاريع",
    nav_contact: "اتصل بنا",
    hero_title: "طارق عابد",
    hero_desc: "مطور واجهات أمامية وصنايعي معلم متخصص في Peinture و Plaquiste و Carrelage في فرنسا.",
    btn_consult: "استشارة مجانية",
    btn_estimator_btn: "حاسبة الأسعار",
    consult_title: "طلب استشارة مجانية",
    consult_send: "إرسال الاستشارة",
    calc_heading: "حاسبة الأسعار التقديرية",
    calc_service_type: "اختر الخدمة أو الصنعة",
    trouble_title: "دليل المشاكل الفنية وحلولها",
    services_title: "خدمات مصغرة وأكواد جاهزة",
    blog_title: "المدونة التقنية",
    projects_title: "المشاريع والسيرفرات السحابية",
    tools_title: "الأدوات الذكية التفاعلية",
    calc_title: "الحاسبة السريعة",
    weather_title: "حالة الطقس الفورية",
    refresh_weather: "تحديث الطقس",
    currency_title: "محول العملات",
    convert_btn: "تحويل",
    game_title: "اللعبة التفاعلية",
    game_start: "اضغط هنا للبدء!",
    game_score: "الوقت المستغرق: --",
    contact_title: "تواصل معي"
  },
  fr: {
    nav_home: "Accueil",
    nav_about: "À propos",
    nav_blog: "Blog",
    nav_projects: "Projets",
    nav_contact: "Contact",
    hero_title: "Tarek Abed",
    hero_desc: "Développeur Front-end et professionnel spécialisé en Peinture, Plaquiste et Carrelage en France.",
    btn_consult: "Consultation",
    btn_estimator_btn: "Calculateur",
    consult_title: "Consultation gratuite",
    consult_send: "Envoyer",
    calc_heading: "Calculateur de prix estimatif",
    calc_service_type: "Sélectionnez le service",
    trouble_title: "Guide des problèmes techniques",
    services_title: "Micro-services & Codes",
    blog_title: "Blog Technique",
    projects_title: "Projets & Serveurs Cloud",
    tools_title: "Outils Intelligents",
    calc_title: "Calculatrice Rapide",
    weather_title: "Météo en direct",
    refresh_weather: "Actualiser",
    currency_title: "Convertisseur",
    convert_btn: "Convertir",
    game_title: "Jeu Interactif",
    game_start: "Commencer !",
    game_score: "Temps: --",
    contact_title: "Contact"
  },
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_blog: "Blog",
    nav_projects: "Projects",
    nav_contact: "Contact",
    hero_title: "Tarek Abed",
    hero_desc: "Front-end Developer and professional specialist in Peinture, Plaquiste and Carrelage in France.",
    btn_consult: "Free Consult",
    btn_estimator_btn: "Price Estimator",
    consult_title: "Free Consultation Request",
    consult_send: "Send Request",
    calc_heading: "Estimated Price Calculator",
    calc_service_type: "Select Service or Craft",
    trouble_title: "Technical & Craft Troubleshooting Guide",
    services_title: "Micro-services & Ready Codes",
    blog_title: "Tech Blog",
    projects_title: "Cloud Projects & Servers",
    tools_title: "Smart Interactive Tools",
    calc_title: "Quick Calculator",
    weather_title: "Live Weather",
    refresh_weather: "Refresh",
    currency_title: "Currency Converter",
    convert_btn: "Convert",
    game_title: "Interactive Game",
    game_start: "Click here to start!",
    game_score: "Time taken: --",
    contact_title: "Get in Touch"
  },
  de: {
    nav_home: "Startseite",
    nav_about: "Über uns",
    nav_blog: "Blog",
    nav_projects: "Projekte",
    nav_contact: "Kontakt",
    hero_title: "Tarek Abed",
    hero_desc: "Front-end-Entwickler und Spezialist für Peinture, Plaquiste und Carrelage in Frankreich.",
    btn_consult: "Beratung",
    btn_estimator_btn: "Rechner",
    consult_title: "Beratungsanfrage",
    consult_send: "Senden",
    calc_heading: "Preisrechner",
    calc_service_type: "Dienstleistung wählen",
    trouble_title: "Fehlerbehebung",
    services_title: "Dienste & Codes",
    blog_title: "Tech-Blog",
    projects_title: "Cloud-Projekte",
    tools_title: "Werkzeuge",
    calc_title: "Rechner",
    weather_title: "Wetter",
    refresh_weather: "Aktualisieren",
    currency_title: "Währung",
    convert_btn: "Konvertieren",
    game_title: "Spiel",
    game_start: "Starten",
    game_score: "Zeit: --",
    contact_title: "Kontakt"
  },
  es: {
    nav_home: "Inicio",
    nav_about: "Sobre nosotros",
    nav_blog: "Blog",
    nav_projects: "Proyectos",
    nav_contact: "Contacto",
    hero_title: "Tarek Abed",
    hero_desc: "Desarrollador Front-end y especialista en Peinture, Plaquiste y Carrelage en Francia.",
    btn_consult: "Consulta",
    btn_estimator_btn: "Calculadora",
    consult_title: "Consulta gratuita",
    consult_send: "Enviar",
    calc_heading: "Calculadora de precios",
    calc_service_type: "Seleccionar servicio",
    trouble_title: "Solución de problemas",
    services_title: "Servicios y Códigos",
    blog_title: "Blog Técnico",
    projects_title: "Proyectos Cloud",
    tools_title: "Herramientas",
    calc_title: "Calculadora",
    weather_title: "Clima",
    refresh_weather: "Actualizar",
    currency_title: "Moneda",
    convert_btn: "Convertir",
    game_title: "Juego",
    game_start: "Comenzar",
    game_score: "Tiempo: --",
    contact_title: "Contacto"
  }
};

function calculateEstimate() {
    const type = document.getElementById('serviceType').value;
    const qty = parseFloat(document.getElementById('serviceQty').value) || 1;
    const resultElem = document.getElementById('estimateResult');
    let rate = 0;
    switch(type) {
        case 'web': rate = 50; break;
        case 'app': rate = 300; break;
        case 'placo': rate = 25; break;
        case 'peinture': rate = 20; break;
        case 'carrelage': rate = 40; break;
    }
    let total = type === 'app' ? rate : rate * qty;
    resultElem.textContent = `التكلفة التقديرية: ${total} € (قابل للنقاش)`;
}

function setLanguage(lang) {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', lang);
    htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('preferredLang', lang);

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                htmlElement.setAttribute('data-theme', 'light');
                themeIcon.className = 'fa-solid fa-sun';
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fa-solid fa-moon';
            }
        });
    }

    const langSelect = document.getElementById('langSelect');
    const savedLang = localStorage.getItem('preferredLang') || 'ar';
    if (langSelect) {
        langSelect.value = savedLang;
        setLanguage(savedLang);
        langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }

    if (localStorage.getItem('cookiesAccepted') === 'true') {
        const banner = document.getElementById('cookieBanner');
        if (banner) banner.style.display = 'none';
    }
});

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
}

function appendCalc(val) {
    const screen = document.getElementById('calcScreen');
    if (screen) screen.value += val;
}
function clearCalc() {
    const screen = document.getElementById('calcScreen');
    if (screen) screen.value = '';
}
function calculateResult() {
    const screen = document.getElementById('calcScreen');
    if (!screen) return;
    try { screen.value = eval(screen.value); } catch (e) { screen.value = 'خطأ'; }
}
function updateWeather() {
    const tempVal = document.getElementById('tempVal');
    if (!tempVal) return;
    const temps = ['23°C - مشمس', '21°C - غائم جزئياً', '24°C - صافٍ تماماً'];
    tempVal.textContent = temps[Math.floor(Math.random() * temps.length)];
}
function convertCurrency() {
    const amountInput = document.getElementById('amount');
    const targetSelect = document.getElementById('currencyTarget');
    const resultElem = document.getElementById('conversionResult');
    if (!amountInput || !targetSelect || !resultElem) return;
    const amount = parseFloat(amountInput.value) || 0;
    const target = targetSelect.value;
    let rate = target === 'USD' ? 1.08 : 55.5; 
    let converted = (amount * rate).toFixed(2);
    let currencySymbol = target === 'USD' ? '$' : 'ج.م';
    resultElem.textContent = `النتيجة: ${converted} ${currencySymbol}`;
}

let startTime, endTime, gameTimeout;
function handleGameClick() {
    const box = document.getElementById('gameBox');
    const text = document.getElementById('gameText');
    const score = document.getElementById('gameScore');
    if (!box || !text || !score) return;

    if (box.classList.contains('waiting')) {
        clearTimeout(gameTimeout);
        box.classList.remove('waiting');
        box.style.backgroundColor = '#e74c3c';
        text.textContent = 'تم الضغط مبكراً!';
        return;
    }
    if (box.classList.contains('ready')) {
        endTime = new Date().getTime();
        const timeTaken = endTime - startTime;
        box.classList.remove('ready');
        box.style.backgroundColor = '';
        text.textContent = 'اضغط هنا للبدء!';
        score.textContent = `الوقت المستغرق: ${timeTaken} ملي ثانية`;
        return;
    }
    box.style.backgroundColor = '#f39c12';
    text.textContent = 'انتظر اللون الأخضر...';
    box.classList.add('waiting');
    const randomTime = Math.floor(Math.random() * 2000) + 1500;
    gameTimeout = setTimeout(() => {
        box.classList.remove('waiting');
        box.classList.add('ready');
        box.style.backgroundColor = '#2ecc71';
        text.textContent = 'اضغط الآن بسرعة!';
        startTime = new Date().getTime();
    }, randomTime);
}