document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('co2Graph').getContext('2d');

    // Beispiel-Daten für CO₂-Emissionen
    const data = {
        Germany: { Siemens: 100, Volkswagen: 200 },
        USA: { Apple: 150, Microsoft: 250 },
        China: { Huawei: 300, Xiaomi: 100 },
    };

    const countries = Object.keys(data);
    const allCompanies = [...new Set(countries.flatMap(country => Object.keys(data[country])))];

    const countryDropdown = document.getElementById("country");
    const companyDropdown = document.getElementById("company");

    let chart;

    // Übersetzungen
    const translations = {
        de: {
            home: "Startseite",
            about: "Über Uns",
            graph: "CO₂-Emissionsdaten",
            mission: "Unsere Mission",
            missionText: "Diese Plattform ermöglicht es dir, die CO₂-Emissionen verschiedener Unternehmen aus unterschiedlichen Ländern zu erkunden. Lass uns gemeinsam an der Transparenz arbeiten!",
            countryLabel: "Alle",
            companyLabel: "Alle",
            graphLabel: "CO₂-Emissionen (in Tonnen)",
            footerImpressum: "Impressum",
            footerDatenschutz: "Datenschutz",
            footerRights: "Alle Rechte vorbehalten.",
            graphLink: "CO₂-Emissionsdaten",
            missionLink: "Unsere Mission",
        },
        en: {
            home: "Home",
            about: "About Us",
            graph: "CO₂ Emissions Data",
            mission: "Our Mission",
            missionText: "This platform allows you to explore CO₂ emissions of various companies from different countries. Let's work together for transparency!",
            countryLabel: "All",
            companyLabel: "All",
            graphLabel: "CO₂ Emissions (in tons)",
            footerImpressum: "Imprint",
            footerDatenschutz: "Privacy Policy",
            footerRights: "All rights reserved.",
            graphLink: "CO₂ Emissions Data",
            missionLink: "Our Mission",
        },
        ar: {
            home: "الصفحة الرئيسية",
            about: "من نحن",
            graph: "بيانات انبعاثات ثاني أكسيد الكربون",
            mission: "مهمتنا",
            missionText: "تتيح لك هذه المنصة استكشاف انبعاثات ثاني أكسيد الكربون الخاصة بشركات مختلفة من دول مختلفة. دعونا نعمل معًا من أجل الشفافية!",
            countryLabel: "الكل",
            companyLabel: "الكل",
            graphLabel: "انبعاثات ثاني أكسيد الكربون (بالأطنان)",
            footerImpressum: "التعليمات",
            footerDatenschutz: "سياسة الخصوصية",
            footerRights: "جميع الحقوق محفوظة.",
            graphLink: "بيانات انبعاثات ثاني أكسيد الكربون",
            missionLink: "مهمتنا",
        },
    };

    // Dropdowns füllen
    function populateDropdown(dropdown, items, label) {
        dropdown.innerHTML = `<option value="all">${label}</option>`;
        items.forEach(item => {
            dropdown.innerHTML += `<option value="${item}">${item}</option>`;
        });
    }

    populateDropdown(countryDropdown, countries, translations['de'].countryLabel);
    populateDropdown(companyDropdown, allCompanies, translations['de'].companyLabel);

    // Graph erstellen
    function createChart(filteredData, lang = 'de') {
        const graphLabel = translations[lang]?.graphLabel || "CO₂-Emissionen (in Tonnen)";

        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(filteredData),
                datasets: [{
                    label: graphLabel,
                    data: Object.values(filteredData),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: graphLabel,
                    },
                },
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });
    }

    // Standardanzeige: Nach Ländern
    function showTotalsByCountry(lang = 'de') {
        const totals = {};
        countries.forEach(country => {
            totals[country] = Object.values(data[country]).reduce((a, b) => a + b, 0);
        });
        createChart(totals, lang);
    }

    showTotalsByCountry();

    // Filter-Logik
    function updateFilters(lang = 'de') {
        const selectedCountry = countryDropdown.value;
        const selectedCompany = companyDropdown.value;

        if (selectedCountry === "all" && selectedCompany === "all") {
            showTotalsByCountry(lang);
        } else if (selectedCountry !== "all" && selectedCompany === "all") {
            createChart(data[selectedCountry], lang);
            populateDropdown(companyDropdown, Object.keys(data[selectedCountry]), translations[lang].companyLabel);
        } else if (selectedCompany !== "all" && selectedCountry === "all") {
            const companyData = {};
            countries.forEach(country => {
                if (data[country][selectedCompany] !== undefined) {
                    companyData[country] = data[country][selectedCompany];
                }
            });
            createChart(companyData, lang);
            populateDropdown(countryDropdown, Object.keys(companyData), translations[lang].countryLabel);
        } else {
            createChart({ [selectedCompany]: data[selectedCountry][selectedCompany] }, lang);
        }
    }

    countryDropdown.addEventListener("change", () => updateFilters(currentLang));
    companyDropdown.addEventListener("change", () => updateFilters(currentLang));

    // Sprachwechsel
    let currentLang = 'de';

    const langDe = document.getElementById('lang-de');
    const langEn = document.getElementById('lang-en');
    const langAr = document.getElementById('lang-ar');

    const updateLanguage = (lang) => {
        currentLang = lang;
        const content = translations[lang];

        // Header Navigation
        document.querySelector('.dropdown a[href="index.html"]').textContent = content.home;
        document.querySelector('.dropdown a[href="about.html"]').textContent = content.about;

        // Dropdown Menü-Links
        document.querySelector('.dropdown-menu a[href="index.html#graph"]').textContent = content.graphLink;
        document.querySelector('.dropdown-menu a[href="index.html#mission"]').textContent = content.missionLink;

        // Section Titles
        document.querySelector('#graph h2').textContent = content.graph;
        document.querySelector('#mission h2').textContent = content.mission;

        // Mission Text
        document.querySelector('#mission p').textContent = content.missionText;

        // Filter Labels
        document.querySelector('label[for="country"]').textContent = content.countryLabel;
        document.querySelector('label[for="company"]').textContent = content.companyLabel;

        // Footer Links
        const footerLinks = document.querySelectorAll('footer a');
        footerLinks[0].textContent = content.footerImpressum;
        footerLinks[1].textContent = content.footerDatenschutz;

        // Footer Rights Text
        const footerRights = document.querySelector('footer p').childNodes[0];
        if (footerRights) footerRights.textContent = `${content.footerRights} `;

        // Update Graph
        updateFilters(lang);

        // Anpassungen für Arabisch
        const nav = document.querySelector('.header-nav');
        if (lang === 'ar') {
            nav.classList.add('arabic');
        } else {
            nav.classList.remove('arabic');
        }
    };

    langDe.addEventListener('click', () => updateLanguage('de'));
    langEn.addEventListener('click', () => updateLanguage('en'));
    langAr.addEventListener('click', () => updateLanguage('ar'));
});
