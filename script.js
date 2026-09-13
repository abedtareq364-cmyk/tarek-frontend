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

  // تحميل الثيم المحفوظ (ليلي / نهاري) أول ما الصفحة تفتح
  const savedTheme = localStorage.getItem("tarek_theme");
  const themeBtnIcon = document.querySelector("#themeToggleBtn i");
  if (savedTheme === "light") {
    document.documentElement.classList.add("light-mode");
    if (themeBtnIcon) {
      themeBtnIcon.classList.replace("fa-moon", "fa-sun");
    }
  }

  // تشغيل الوظائف الأولية
  calculatePrice();
  getWeather();
  convertCurrencyLive();
  updateTestimonialUI();
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

// 7. Testimonials & Dynamic Reviews Management (عرض كافة التقييمات بنمط بطاقات جوجل)
let dynamicTestimonials = [
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

function updateTestimonialUI() {
  const gridBox = document.getElementById("testimonialsGrid");
  if (!gridBox) return;

  gridBox.innerHTML = ""; // مسح القديم وإعادة رسم القائمة بالكامل

  dynamicTestimonials.forEach(review => {
    const firstLetter = review.author.replace(/⭐/g, "").trim().charAt(0) || "ت";

    const card = document.createElement("div");
    card.className = "google-review-card";
    card.innerHTML = `
      <div>
        <div class="google-review-header">
          <div class="google-review-avatar">${firstLetter}</div>
          <div>
            <div class="google-review-author">${review.author}</div>
            <div class="google-review-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
          </div>
        </div>
        <p class="google-review-text">"${review.text}"</p>
      </div>
    `;
    gridBox.appendChild(card);
  });
}

// دالة استقبال وتثبيت تقييم العميل الجديد وعرضه فوراً
function submitUserReview(event) {
  event.preventDefault();
  const name = document.getElementById("reviewerName").value.trim();
  const rating = document.getElementById("reviewerRating").value;
  const comment = document.getElementById("reviewerComment").value.trim();

  if (name && comment) {
    const newReview = {
      text: comment,
      author: `${rating} ${name}`
    };

    dynamicTestimonials.push(newReview);
    updateTestimonialUI(); // تحديث الشبكة فوراً لتظهر كل التعليقات مصفوفة جنب بعض

    alert("شكراً لك! تم إضافة تقييمك بنجاح وعرضه في منصة التقييمات 🎉");
    document.getElementById("reviewForm").reset();
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

// 10. Pricing & Building Calculator (حاسبة الأسعار المزدوجة الذكية)
function toggleCalculatorType() {
    const category = document.getElementById('serviceCategory').value;
    const webOptions = document.getElementById('webCalcOptions');
    const buildingOptions = document.getElementById('buildingCalcOptions');

    if (category === 'building') {
        if (webOptions) webOptions.style.display = 'none';
        if (buildingOptions) buildingOptions.style.display = 'block';
    } else {
        if (webOptions) webOptions.style.display = 'block';
        if (buildingOptions) buildingOptions.style.display = 'none';
    }
    calculatePrice();
}

function calculatePrice() {
    const category = document.getElementById('serviceCategory')?.value || 'web';
    let total = 0;
    const priceTag = document.getElementById("totalPrice");

    if (category === 'building') {
        const pricePerSqm = parseFloat(document.getElementById('buildingType')?.value || 35);
        const area = parseFloat(document.getElementById('surfaceArea')?.value || 30);
        total = pricePerSqm * area;
    } else {
        const siteType = parseFloat(document.getElementById("siteType")?.value || 150);
        const langMultiplier = parseFloat(document.getElementById("langCount")?.value || 1);
        total = Math.round(siteType * langMultiplier);
    }

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

// 12. PDF Quote Generator (توليد وتحميل عرض السعر بصيغة PDF)
function generatePDFQuote() {
  const category = document.getElementById('serviceCategory')?.value || 'web';
  const totalPrice = document.getElementById('totalPrice')?.innerText || '0€';
  let serviceDetails = '';

  if (category === 'building') {
    const buildingTypeSelect = document.getElementById('buildingType');
    const buildingName = buildingTypeSelect.options[buildingTypeSelect.selectedIndex].text;
    const area = document.getElementById('surfaceArea')?.value || 30;
    serviceDetails = `المجال: مهن البناء والتشطيب (Bâtiment)\nالخدمة: ${buildingName}\nالمساحة: ${area} م²`;
  } else {
    const siteTypeSelect = document.getElementById('siteType');
    const siteName = siteTypeSelect.options[siteTypeSelect.selectedIndex].text;
    const langCountSelect = document.getElementById('langCount');
    const langName = langCountSelect.options[langCountSelect.selectedIndex].text;
    serviceDetails = `المجال: تطوير واجهات ومواقع الويب (Front-End)\nنوع الموقع: ${siteName}\nاللغات: ${langName}`;
  }

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>عرض سعر - Tarek.Dev</title>
        <style>
          body { font-family: 'Cairo', sans-serif; padding: 40px; color: #111; background: #fff; }
          .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #d97706; margin: 0; font-size: 24px; }
          .details { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; margin-bottom: 30px; line-height: 2.2; }
          .total { font-size: 22px; font-weight: bold; color: #d97706; text-align: center; background: #fef3c7; padding: 15px; border-radius: 10px; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>المهندس طارق خورشيد | Tarek.Dev</h1>
          <p>هندسة وتطوير الويب وأعمال التشطيبات بفرنسا</p>
        </div>
        <div class="details">
          <h3>تفاصيل عرض السعر المبدئي:</h3>
          <p>${serviceDetails.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="total">
          التكلفة الإجمالية التقديرية: ${totalPrice}
        </div>
        <div class="footer">
          <p>موقع الويب: tarekkorshed.com | هاتف / واتساب: +33 7 49 40 85 35</p>
          <p>تم استخراج هذا العرض تلقائياً من حسبة المنصة الرقمية.</p>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// 13. Theme Switcher Toggle (الثيم الحقيقي للنهار والليل)
function toggleTheme() {
  const htmlElement = document.documentElement;
  const themeBtnIcon = document.querySelector("#themeToggleBtn i");

  if (htmlElement.classList.contains("light-mode")) {
    htmlElement.classList.remove("light-mode");
    if (themeBtnIcon) {
      themeBtnIcon.classList.replace("fa-sun", "fa-moon");
    }
    localStorage.setItem("tarek_theme", "dark");
  } else {
    htmlElement.classList.add("light-mode");
    if (themeBtnIcon) {
      themeBtnIcon.classList.replace("fa-moon", "fa-sun");
    }
    localStorage.setItem("tarek_theme", "light");
  }
}

// 14. Multi-language Translation Engine
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
      widgets_title: "أدوات تفاعلية حية (APIs)", services_title: "الخدمات البرمجية والتشطيبات",
      blog_title: "المدونة والشروحات التقنية", calc_title: "حاسبة التقدير الفوري للمشاريع والتشطيبات",
      contact_title: "تواصل معي مباشرة", btn_send: "إرسال الرسالة الآن 🚀",
      calc_service_label: "اختر مجال الخدمة المطلوب:",
      opt_cat_web: "تطوير واجهات ومواقع الويب (Front-End)",
      opt_cat_building: "مهن البناء والتشطيب بفرنسا (Métiers du Bâtiment)",
      calc_site_type: "نوع الموقع المطلوب:",
      opt_portfolio: "موقع شخصي / بورتفوليو تعريف (150€)",
      opt_business: "موقع شركة أو نشاط تجاري (300€)",
      opt_ecom: "متجر إلكتروني متكامل (500€)",
      calc_lang_count: "عدد اللغات في الموقع:",
      opt_l1: "لغة واحدة",
      opt_l2: "لغتان (عربي + فرنسي/إنجليزي)",
      opt_l3: "ثلاث لغات أو أكثر",
      calc_building_type: "نوع الخدمة (Métiers du Bâtiment):",
      opt_carreleur: "تركيب سيراميك وبلاط - Carreleur (ابتداءً من 35€ / م²)",
      opt_plaquiste: "أعمال الجبس بورد والديكور - Plaquiste (ابتداءً من 25€ / م²)",
      opt_peintre: "الدهانات والتشطيبات الداخلية - Peintre (ابتداءً من 20€ / م²)",
      calc_surface_area: "المساحة التقريبية (بالمتر المربع م²):",
      calc_total_text: "التكلفة التقديرية المبدئية:",
      btn_book_calc: "اطلب هذا العرض الآن 🚀"
    },
    fr: {
      nav_home: "Accueil", nav_about: "À propos", nav_portfolio: "Portfolio",
      nav_widgets: "Widgets", nav_services: "Services", nav_blog: "Blog",
      nav_calc: "Calculateur", nav_contact: "Contact",
      hero_badge: "💻 Développeur Front-End | Portfolio Pro",
      hero_title: "Tarek Khorshed",
      hero_desc: "Développeur web et interfaces Front-End. Je conçois des plateformes web ultra-rapides, responsives et modernes.",
      btn_whatsapp: "Contacter sur WhatsApp", portfolio_title: "Projets & Réalisations",
      widgets_title: "Widgets Interactifs (APIs)", services_title: "Services Web & Bâtiment",
      blog_title: "Blog & Tutoriels Techniques", calc_title: "Calculateur de Devis Interactif",
      contact_title: "Contactez-moi Directement", btn_send: "Envoyer le Message 🚀",
      calc_service_label: "Sélectionnez le domaine de service :",
      opt_cat_web: "Développement Web & Front-End",
      opt_cat_building: "Métiers du Bâtiment (France)",
      calc_site_type: "Type de site web :",
      opt_portfolio: "Site Portfolio / Personnel (150€)",
      opt_business: "Site Vitrine / Entreprise (300€)",
      opt_ecom: "Site E-commerce Complet (500€)",
      calc_lang_count: "Nombre de langues :",
      opt_l1: "Une seule langue",
      opt_l2: "Deux langues (Arabe + Français/Anglais)",
      opt_l3: "Trois langues ou plus",
      calc_building_type: "Type de service (Bâtiment) :",
      opt_carreleur: "Carreleur - Pose de carrelage (à partir de 35€ / m²)",
      opt_plaquiste: "Plaquiste - Cloisons & Placo (à partir de 25€ / m²)",
      opt_peintre: "Peintre en bâtiment - Finitions (à partir de 20€ / m²)",
      calc_surface_area: "Surface approximative (en m²) :",
      calc_total_text: "Estimation tarifaire indicative :",
      btn_book_calc: "Commander ce devis 🚀"
    },
    en: {
      nav_home: "Home", nav_about: "About Us", nav_portfolio: "Portfolio",
      nav_widgets: "Widgets", nav_services: "Services", nav_blog: "Blog",
      nav_calc: "Calculator", nav_contact: "Contact",
      hero_badge: "💻 Front-End Developer | Portfolio",
      hero_title: "Tarek Khorshed",
      hero_desc: "Professional Front-End web developer. I build high-performance, fully responsive web platforms with modern UI/UX.",
      btn_whatsapp: "Chat on WhatsApp", portfolio_title: "Portfolio & Works",
      widgets_title: "Live Interactive Widgets (APIs)", services_title: "Web Services & Renovations",
      blog_title: "Tech Blog & Tutorials", calc_title: "Smart Cost & Renovation Estimator",
      contact_title: "Get In Touch", btn_send: "Send Message Now 🚀",
      calc_service_label: "Select Service Domain:",
      opt_cat_web: "Web & Front-End Development",
      opt_cat_building: "Building & Renovation (France)",
      calc_site_type: "Website Type:",
      opt_portfolio: "Personal Portfolio (150€)",
      opt_business: "Business Website (300€)",
      opt_ecom: "E-commerce Store (500€)",
      calc_lang_count: "Language Count:",
      opt_l1: "Single Language",
      opt_l2: "Two Languages (Arabic + French/English)",
      opt_l3: "Three or More Languages",
      calc_building_type: "Service Type (Bâtiment):",
      opt_carreleur: "Tiler - Carreleur (from 35€ / m²)",
      opt_plaquiste: "Drywaller - Plaquiste (from 25€ / m²)",
      opt_peintre: "Painter - Peintre (from 20€ / m²)",
      calc_surface_area: "Approximate Area (in m²):",
      calc_total_text: "Estimated Initial Cost:",
      btn_book_calc: "Book This Offer Now 🚀"
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
}// 15. Cookie Consent Banner Logic
document.addEventListener("DOMContentLoaded", () => {
  const cookieModal = document.getElementById("cookieConsentModal");
  const cookieStatus = localStorage.getItem("tarek_cookie_consent");

  // لو الزائر مخدش قرار قبل كده، اظهر النافذة المنبثقة
  if (!cookieStatus && cookieModal) {
    setTimeout(() => {
      cookieModal.classList.add("active");
    }, 1000); // تظهر بعد ثانية من فتح الموقع
  }
});

function acceptCookies() {
  localStorage.setItem("tarek_cookie_consent", "accepted");
  const cookieModal = document.getElementById("cookieConsentModal");
  if (cookieModal) {
    cookieModal.classList.remove("active");
  }
}

function declineCookies() {
  localStorage.setItem("tarek_cookie_consent", "declined");
  const cookieModal = document.getElementById("cookieConsentModal");
  if (cookieModal) {
    cookieModal.classList.remove("active");
  }
}
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