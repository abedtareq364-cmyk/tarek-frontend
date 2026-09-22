/* ==========================================
   Tarek Khorshed - Main JavaScript (script.js)
   ========================================== */

// --- 1. Theme Toggle (الوضع الليلي والنهاري) ---
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeBtnIcon = document.querySelector('#themeToggleBtn i');
    
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeBtnIcon) themeBtnIcon.className = 'fa-solid fa-moon';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        if (themeBtnIcon) themeBtnIcon.className = 'fa-solid fa-sun';
    }
}

// تحميل الثيم المفضّل عند فتح الصفحة وتشغيل الدوال الابتدائية
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtnIcon = document.querySelector('#themeToggleBtn i');
    if (themeBtnIcon) {
        themeBtnIcon.className = savedTheme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    
    // تشغيل الدوال الحية والابتدائية
    initPortfolioFilter();
    getWeather('Argenteuil');
    getExchangeRates();
    loadUserReviews();
    calculatePrice();
});

// --- 2. Portfolio Filtering (فلترة معرض الأعمال) ---
function filterProjects(category) {
    const items = document.querySelectorAll('.portfolio-item');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function initPortfolioFilter() {
    // تفعيل الوضع الافتراضي
}

// --- 3. Lightbox Modal (نافذة تكبير الصور والتفاصيل) ---
function openLightbox(imgSrc, title, desc, link) {
    const modal = document.getElementById('lightboxModal');
    if (!modal) return;
    document.getElementById('lightboxImg').src = imgSrc;
    document.getElementById('lightboxTitle').innerText = title;
    document.getElementById('lightboxDesc').innerText = desc;
    document.getElementById('lightboxLink').href = link;
    modal.style.display = 'flex';
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) modal.style.display = 'none';
}

// إغلاق المودال عند النقر خارج المحتوى
window.onclick = function(event) {
    const modal = document.getElementById('lightboxModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// --- 4. Weather API Widget (ودجت الطقس المباشر عبر Open-Meteo) ---
async function getWeather(cityName = 'Argenteuil') {
    const cityInput = document.getElementById('cityInput');
    if (cityInput && cityName !== cityInput.value) {
        cityInput.value = cityName;
    }

    let lat = 48.947;
    let lon = 2.25;
    
    if (cityName.toLowerCase() === 'paris') { lat = 48.8566; lon = 2.3522; }
    else if (cityName.toLowerCase() === 'cairo') { lat = 30.0444; lon = 31.2357; }

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        
        if (data && data.current_weather) {
            const tempElem = document.getElementById('currentTemp');
            const alertElem = document.getElementById('alertText');
            if (tempElem) tempElem.innerText = Math.round(data.current_weather.temperature);
            const windspeed = data.current_weather.windspeed;
            if (alertElem) alertElem.innerText = `سرعة الرياح: ${windspeed} كم/س - الطقس حي ومستقر في ${cityName}`;
        }
    } catch (error) {
        console.error('خطأ في جلب بيانات الطقس:', error);
        const tempElem = document.getElementById('currentTemp');
        const alertElem = document.getElementById('alertText');
        if (tempElem) tempElem.innerText = '--';
        if (alertElem) alertElem.innerText = 'تعذر تحديث الطقس الحي مؤقتاً';
    }
}

function switchWeatherTab(tab) {
    const hourlyBtn = document.querySelectorAll('.weather-tabs .tab-btn')[0];
    const dailyBtn = document.querySelectorAll('.weather-tabs .tab-btn')[1];
    const hourlyView = document.getElementById('hourlyForecast');
    const dailyView = document.getElementById('dailyForecast');

    if (!hourlyBtn || !dailyBtn) return;

    if (tab === 'hourly') {
        hourlyBtn.classList.add('active');
        dailyBtn.classList.remove('active');
        if (hourlyView) hourlyView.style.display = 'block';
        if (dailyView) dailyView.style.display = 'none';
    } else {
        dailyBtn.classList.add('active');
        hourlyBtn.classList.remove('active');
        if (dailyView) {
            dailyView.style.display = 'block';
            dailyView.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem; text-align:center; padding:15px;">توقعات الأسبوع القادم مستقرة وملائمة لأعمال التشطيبات البنائية ☀️</p>';
        }
        if (hourlyView) hourlyView.style.display = 'none';
    }
}

// --- 5. Live Currency Converter (محول العملات المباشر عبر Frankfurter API) ---
let exchangeRates = { EUR: 1, USD: 1.08, EGP: 52.5, SAR: 4.05 };

async function getExchangeRates() {
    try {
        const res = await fetch('https://api.frankfurter.app/latest?from=EUR');
        const data = await res.json();
        if (data && data.rates) {
            exchangeRates = data.rates;
            exchangeRates['EUR'] = 1; // ضمان تثبيت اليورو كمرجع
            convertCurrencyLive();
            console.log('تم تحديث أسعار العملات الحية بنجاح');
        }
    } catch (e) {
        console.log('استخدام أسعار العملات الاحتياطية', e);
        convertCurrencyLive();
    }
}

function convertCurrencyLive() {
    const amountInput = document.getElementById('fromAmount');
    const toAmountInput = document.getElementById('toAmount');
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    
    if (!amountInput || !toAmountInput || !fromSelect || !toSelect) return;

    const amount = parseFloat(amountInput.value) || 0;
    const from = fromSelect.value;
    const to = toSelect.value;

    const rateFrom = exchangeRates[from] || 1;
    const rateTo = exchangeRates[to] || 1;

    // الحساب عبر اليورو كقاعدة أساسية
    const amountInEUR = amount / rateFrom;
    const converted = amountInEUR * rateTo;

    toAmountInput.value = converted.toFixed(2);
    
    const singleRate = (rateTo / rateFrom).toFixed(4);
    const rateInfo = document.getElementById('exchangeRateInfo');
    if (rateInfo) {
        rateInfo.innerText = `1 ${from} = ${singleRate} ${to} (أسعار حية)`;
    }
}

function swapCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    if (!fromSelect || !toSelect) return;
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    convertCurrencyLive();
}

// --- 6. Project & Services Calculator (حاسبة الأسعار الذكية) ---
function toggleCalculatorType() {
    const category = document.getElementById('serviceCategory').value;
    const webOptions = document.getElementById('webCalcOptions');
    const buildingOptions = document.getElementById('buildingCalcOptions');

    if (category === 'web') {
        if (webOptions) webOptions.style.display = 'block';
        if (buildingOptions) buildingOptions.style.display = 'none';
    } else {
        if (webOptions) webOptions.style.display = 'none';
        if (buildingOptions) buildingOptions.style.display = 'block';
    }
    calculatePrice();
}

function calculatePrice() {
    const categoryElem = document.getElementById('serviceCategory');
    if (!categoryElem) return 0;
    
    const category = categoryElem.value;
    let finalPrice = 150;

    if (category === 'web') {
        const siteType = parseFloat(document.getElementById('siteType').value) || 150;
        const langMultiplier = parseFloat(document.getElementById('langCount').value) || 1;
        finalPrice = Math.round(siteType * langMultiplier);
    } else {
        const ratePerMeter = parseFloat(document.getElementById('buildingType').value) || 30;
        const area = parseFloat(document.getElementById('surfaceArea').value) || 30;
        finalPrice = ratePerMeter * area;
    }

    const totalPriceElem = document.getElementById('totalPrice');
    if (totalPriceElem) {
        totalPriceElem.innerText = finalPrice + '€';
    }
    return finalPrice;
}

function sendWhatsAppQuote() {
    const category = document.getElementById('serviceCategory').value;
    const price = document.getElementById('totalPrice').innerText;
    let details = '';

    if (category === 'web') {
        const siteTypeElem = document.getElementById('siteType');
        const siteType = siteTypeElem ? siteTypeElem.selectedOptions[0].text : 'موقع ويب';
        details = `تطوير موقع ويب (${siteType})`;
    } else {
        const buildTypeElem = document.getElementById('buildingType');
        const buildType = buildTypeElem ? buildTypeElem.selectedOptions[0].text : 'أعمال تشطيبات';
        const area = document.getElementById('surfaceArea').value;
        details = `أعمال تشطيبات (${buildType}) بمساحة ${area} م²`;
    }

    const message = `السلام عليكم يا باشمهندس طارق، قمت بحساب تقدير لمشروعي عبر الموقع:\n- الخدمة: ${details}\n- التكلفة التقديرية: ${price}\nأرجو التواصل لتأكيد التفاصيل وتحديد الموعد.`;
    window.open(`https://api.whatsapp.com/send?phone=33749408535&text=${encodeURIComponent(message)}`, '_blank');
}

function exportToPDF() {
    window.print();
}

function openBookingModal() {
    window.location.hash = '#contact';
}

// --- 7. Multi-Language Switcher (تبديل اللغات السريع) ---
function changeLanguage(lang) {
    if (lang === 'fr') {
        alert('Basculement vers le Français - Bienvenue sur le site professionnel de Tarek Khorshed.');
    } else if (lang === 'en') {
        alert('Switched to English - Welcome to Tarek Khorshed portfolio.');
    } else if (lang === 'es') {
        alert('Cambiado al Español - Bienvenido.');
    } else if (lang === 'de') {
        alert('Auf Deutsch gewechselt - Willkommen.');
    }
}

// --- 8. Testimonials & User Reviews (نظام تقييمات العملاء) ---
function loadUserReviews() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;

    let defaultReviews = [
        { name: 'توماس لوروا (Thomas Leroy)', rating: '⭐⭐⭐⭐⭐', comment: 'عمل احترافي دقيق جداً في تشطيبات الجبس بورد والسيراميك بمنزلي في باريس. أنصح بالتعامل معه بشدة!' },
        { name: 'محمد عبد الله', rating: '⭐⭐⭐⭐⭐', comment: 'موقع بورتفوليو سريع للغاية وبتصميم فخم وراقي. سلمني المشروع في الوقت المحدد تماماً.' }
    ];

    let savedReviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    let allReviews = [...savedReviews, ...defaultReviews];

    grid.innerHTML = allReviews.map(r => `
        <div class="service-card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="color: var(--text-main); font-size: 1.05rem;">${r.name}</h4>
                <span style="font-size: 0.9rem;">${r.rating}</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem;">"${r.comment}"</p>
        </div>
    `).join('');
}

function submitUserReview(event) {
    event.preventDefault();
    const name = document.getElementById('reviewerName').value;
    const rating = document.getElementById('reviewerRating').value;
    const comment = document.getElementById('reviewerComment').value;

    let savedReviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    savedReviews.unshift({ name, rating, comment });
    localStorage.setItem('userReviews', JSON.stringify(savedReviews));

    document.getElementById('reviewForm').reset();
    loadUserReviews();
    alert('شكراً لك! تم نشر تقييمك بنجاح على الموقع.');
}