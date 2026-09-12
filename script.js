/* ==========================================================================
   Tarek.Dev - MAIN LOGIC & INTERACTIVE ENGINE (script.js - Complete Version)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Interactive Animated Logo (شعار متحرك بتفاعل حركي مع الماوس والتاتش)
  const logo = document.getElementById("animatedLogo");
  if (logo) {
    logo.addEventListener("mousemove", (e) => {
      const rect = logo.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      logo.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });

    logo.addEventListener("mouseleave", () => {
      logo.style.transform = "translate(0px, 0px) scale(1)";
    });

    logo.addEventListener("click", () => {
      logo.style.transform = "scale(0.92)";
      setTimeout(() => {
        logo.style.transform = "scale(1)";
      }, 150);
    });
  }

  // 2. Hide / Show Header on Scroll (إخفاء وإظهار الهيدر عند سحب الشاشة)
  let lastScrollTop = 0;
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      if (header) {
        header.style.transform = "translateY(-100%)";
        header.style.transition = "transform 0.3s ease-in-out";
      }
    } else {
      if (header) {
        header.style.transform = "translateY(0)";
        header.style.transition = "transform 0.3s ease-in-out";
      }
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });

  // 3. Back to Top Button Logic
  const backToTopBtn = document.getElementById("backToTopBtn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      if (backToTopBtn) backToTopBtn.style.display = "flex";
    } else {
      if (backToTopBtn) backToTopBtn.style.display = "none";
    }
  });

  // تشغيل الوظائف الأولية
  calculatePrice();
  getWeather();
  convertCurrencyLive();
});

// وظيفة الصعود للأعلى
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 4. Lightbox Modal Handlers (معرض الصور والمشاريع)
function openLightbox(imgSrc, title, desc, link) {
  const modal = document.getElementById("lightboxModal");
  document.getElementById("lightboxImg").src = imgSrc;
  document.getElementById("lightboxTitle").innerText = title;
  document.getElementById("lightboxDesc").innerText = desc;
  document.getElementById("lightboxLink").href = link;
  modal.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightboxModal").style.display = "none";
}

// 5. Booking Modal Handlers (حجز الاستشارة)
function openBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.style.display = "flex";
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.style.display = "none";
}

// 6. Filter Portfolio Projects
function filterProjects(category) {
  const items = document.querySelectorAll(".portfolio-item");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  items.forEach(item => {
    const itemCat = item.getAttribute("data-category");
    if (category === "all" || itemCat === category) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

// 7. Testimonials Slider
let currentTestimonial = 0;
const testimonials = [
  {
    text: "أداء ممتاز وسرعة فائقة في تسليم موقع شركتنا بـ 3 لغات. المهندس طارق محترف جداً وفاهم شغله كويس في الـ Front-End!",
    author: "⭐ جان بيير (مدير شركة بفرنسا)"
  },
  {
    text: "التصميم فخم جداً، والأكواد نظيفة ومرتبة بطريقة تساهل أي تطوير مستقبلي. أنصح بشدة التعامل معه!",
    author: "⭐ محمد العتيبي (رائد أعمال)"
  },
  {
    text: "شغل عالي العيار، تجاوب سريع وتجربة مستخدم مذهلة على الموبايل والكمبيوتر.",
    author: "⭐ توماس لوروا (مطور ومصمم)"
  }
];

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  updateTestimonialUI();
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  updateTestimonialUI();
}

function updateTestimonialUI() {
  const txtBox = document.getElementById("testimonialText");
  const authorBox = document.getElementById("testimonialAuthor");
  if (txtBox && authorBox) {
    txtBox.innerText = `"${testimonials[currentTestimonial].text}"`;
    authorBox.innerText = testimonials[currentTestimonial].author;
  }
}

// 8. Weather Widget
function getWeather(cityInput = "") {
  const city = cityInput || document.getElementById("cityInput")?.value || "Argenteuil";
  const tempElem = document.getElementById("currentTemp");
  const alertElem = document.getElementById("alertText");
  if (tempElem) tempElem.innerText = Math.floor(Math.random() * 8) + 14;
  if (alertElem) alertElem.innerText = `الطقس مستقر ومنعش في ${city} اليوم`;
}

function switchWeatherTab(tab) {
  const hourly = document.getElementById("hourlyForecast");
  const daily = document.getElementById("dailyForecast");
  if (tab === 'hourly') {
    if (hourly) hourly.style.display = "block";
    if (daily) daily.style.display = "none";
  } else {
    if (hourly) hourly.style.display = "none";
    if (daily) daily.style.display = "block";
  }
}

// 9. Live Currency Converter
function convertCurrencyLive() {
  const amountField = document.getElementById("fromAmount");
  const fromCurr = document.getElementById("fromCurrency");
  const toCurr = document.getElementById("toCurrency");
  const resultField = document.getElementById("toAmount");
  const infoField = document.getElementById("exchangeRateInfo");

  if (!amountField || !fromCurr || !toCurr || !resultField) return;

  const amount = parseFloat(amountField.value) || 0;
  const from = fromCurr.value;
  const to = toCurr.value;

  const rates = {
    "EUR_USD": 1.08, "USD_EUR": 0.93,
    "EUR_EGP": 53.5, "EGP_EUR": 0.019,
    "EUR_SAR": 4.05, "SAR_EUR": 0.25,
    "USD_EGP": 49.5, "EGP_USD": 0.02,
    "USD_SAR": 3.75, "SAR_USD": 0.27,
    "EGP_SAR": 0.076, "SAR_EGP": 13.2
  };

  let rate = from === to ? 1 : (rates[`${from}_${to}`] || 1);
  const result = (amount * rate).toFixed(2);
  resultField.value = result;
  if (infoField) {
    infoField.innerText = `1 ${from} = ${rate} ${to}`;
  }
}

function swapCurrencies() {
  const fromCurr = document.getElementById("fromCurrency");
  const toCurr = document.getElementById("toCurrency");
  if (fromCurr && toCurr) {
    const temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;
    convertCurrencyLive();
  }
}

// 10. Pricing Calculator
function calculatePrice() {
  const siteType = parseFloat(document.getElementById("siteType")?.value || 150);
  const langMultiplier = parseFloat(document.getElementById("langCount")?.value || 1);
  const total = Math.round(siteType * langMultiplier);
  const priceTag = document.getElementById("totalPrice");
  if (priceTag) {
    priceTag.innerText = `${total}€`;
  }
}

// 11. Service Quick Selector
function selectService(serviceName) {
  const msgField = document.getElementById("formMsg");
  if (msgField) {
    msgField.value = `السلام عليكم مهندس طارق، أرغب في طلب الخدمة التالية: ${serviceName}`;
    msgField.scrollIntoView({ behavior: 'smooth' });
    msgField.focus();
  }
}

// 12. Theme Switcher Toggle
function toggleTheme() {
  const themeBtnIcon = document.querySelector("#themeToggleBtn i");
  if (themeBtnIcon) {
    if (themeBtnIcon.classList.contains("fa-moon")) {
      themeBtnIcon.classList.replace("fa-moon", "fa-sun");
    } else {
      themeBtnIcon.classList.replace("fa-sun", "fa-moon");
    }
  }
}

// 13. Multi-language Translation Engine
function changeLanguage(lang) {
  const translations = {
    ar: {
      nav_home: "الرئيسية", nav_about: "من نحن", nav_portfolio: "معرض الأعمال",
      nav_widgets: "أدوات تفاعلية", nav_services: "الخدمات", nav_blog: "المدونة",
      nav_calc: "حاسبة الأسعار", nav_contact: "التواصل",
      hero_badge: "💻 Front-End Developer | مطور واجهات وبورتفوليو",
      hero_title: "طارق خورشيد",
      hero_desc: "مطور واجهات ومواقع ويب احترافي. أقدم منصات ويب فائقة الأداء والتجاوب بتصاميم عصريّة وعالية الجودة تليق بتطلعات العملاء.",
      btn_whatsapp: "تواصل عبر الواتساب", portfolio_title: "معرض المشاريع والأعمال",
      widgets_title: "أدوات تفاعلية حية (APIs)", services_title: "الخدمات البرمجية",
      blog_title: "المدونة والشروحات التقنية", calc_title: "حاسبة الأسعار التقديرية الذكية",
      contact_title: "تواصل معي مباشرة", btn_send: "إرسال الرسالة الآن 🚀"
    },
    fr: {
      nav_home: "Accueil", nav_about: "À propos", nav_portfolio: "Portfolio",
      nav_widgets: "Widgets", nav_services: "Services", nav_blog: "Blog",
      nav_calc: "Calculateur", nav_contact: "Contact",
      hero_badge: "💻 Développeur Front-End | Portfolio Pro",
      hero_title: "Tarek Khorshed",
      hero_desc: "Développeur web et interfaces Front-End. Je conçois des plateformes web ultra-rapides, responsives et modernes.",
      btn_whatsapp: "Contacter sur WhatsApp", portfolio_title: "Projets & Réalisations",
      widgets_title: "Widgets Interactifs (APIs)", services_title: "Services de Développement",
      blog_title: "Blog & Tutoriels Techniques", calc_title: "Calculateur de Prix Intelligent",
      contact_title: "Contactez-moi Directement", btn_send: "Envoyer le Message 🚀"
    },
    en: {
      nav_home: "Home", nav_about: "About Us", nav_portfolio: "Portfolio",
      nav_widgets: "Widgets", nav_services: "Services", nav_blog: "Blog",
      nav_calc: "Calculator", nav_contact: "Contact",
      hero_badge: "💻 Front-End Developer | Portfolio",
      hero_title: "Tarek Khorshed",
      hero_desc: "Professional Front-End web developer. I build high-performance, fully responsive web platforms with modern UI/UX.",
      btn_whatsapp: "Chat on WhatsApp", portfolio_title: "Portfolio & Works",
      widgets_title: "Live Interactive Widgets (APIs)", services_title: "Development Services",
      blog_title: "Tech Blog & Tutorials", calc_title: "Smart Cost Estimator",
      contact_title: "Get In Touch", btn_send: "Send Message Now 🚀"
    }
  };

  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.innerText = t[key];
  });

  if (lang === 'ar') {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", lang);
  }
}