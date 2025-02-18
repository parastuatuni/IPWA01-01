document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('co2Graph')?.getContext('2d');

    // Beispiel-Daten für CO₂-Emissionsdaten
const data = {
    Germany: { Siemens: 100, Volkswagen: 200 },
    USA: { Apple: 150, Microsoft: 250 },
    China: { Huawei: 300, Xiaomi: 100 },
    Switzerland: { Nestle: 700, Lindt: 200 },
    Peru: { Alicorp: 120, Primax: 200 },
    Turkey: { Turkish_Airlines: 500, Koton: 420 },
    Greece: { OPAP: 160, OTE_Group: 220 },
    Japan: { Toyota: 580, Mitsubishi: 590 },
    Vietnam: { Vingroup: 380, Viettel_Group: 200 },
    Egypt: { Ezz_Steel: 590, Mansour_Group: 630 }
};

    const countries = Object.keys(data);
    const allCompanies = [...new Set(countries.flatMap(country => Object.keys(data[country])))];

    let chart;
    let currentLang = 'de';

    // Translations moved outside of any function
    const translations = {
        de: {
            home: "Startseite",
            about: "Über Uns",
            aboutTextLink: "Über Uns Text",
            graph: "CO₂-Emissionsdaten",
            mission: "Unsere Mission",
            missionText: "Diese Plattform ermöglicht es dir, die CO₂-Emissionen verschiedener Unternehmen aus unterschiedlichen Ländern zu erkunden. Lass uns gemeinsam an der Transparenz arbeiten!",
            countryLabel: "Land",
            companyLabel: "Firma",
            allOption: "All",
            graphLabel: "CO₂-Emissionen (in Tonnen)",
            footerImpressum: "Impressum",
            footerDatenschutz: "Datenschutz",
            footerRights: "Alle Rechte vorbehalten.",
            graphLink: "CO₂-Emissionsdaten",
            missionLink: "Unsere Mission",

            //Über uns:
            aboutTitle: "Über Uns",
            aboutWelcome: "Willkommen bei \"Be The Change\"! Unser Ziel ist es, Transparenz bei CO₂-Emissionen zu schaffen, um bewusste Entscheidungen zu fördern und einen positiven Einfluss auf unseren Planeten zu haben.",
            aboutContact: "Kontaktiert uns gerne per Mail (bethechange@gmail.com) oder folgt uns auf Instagram (@bethechange)!",
            aboutFeedback: "Wir freuen uns auf euren Input!",
        
            //Datenschutz:
            privacyTitle: "Datenschutz",
            privacyContent: "Hier stehen die Datenschutzrichtlinien der Webseite, die Informationen darüber geben, wie Nutzerdaten verarbeitet und gespeichert werden.",
        
            //Impressum:
            imprintTitle: "Impressum",
            imprintContent: "Hier stehen die Angaben zum Anbieter der Webseite, wie Name, Adresse, Kontaktinformationen usw.",
        },
        en: {
            home: "Home",
            about: "About Us",
            aboutTextLink: "About Us Text",
            graph: "CO₂ Emissions Data",
            mission: "Our Mission",
            missionText: "This platform allows you to explore CO₂ emissions of various companies from different countries. Let's work together for transparency!",
            countryLabel: "Country",
            companyLabel: "Company",
            allOption: "All",
            graphLabel: "CO₂ Emissions (in tons)",
            footerImpressum: "Imprint",
            footerDatenschutz: "Privacy Policy",
            footerRights: "All rights reserved.",
            graphLink: "CO₂ Emissions Data",
            missionLink: "Our Mission",

            //About Us:
            aboutTitle: "About Us",
            aboutWelcome: "Welcome to \"Be The Change\"! Our goal is to create transparency in CO₂ emissions to promote conscious decisions and have a positive impact on our planet.",
            aboutContact: "Feel free to contact us via email (bethechange@gmail.com) or follow us on Instagram (@bethechange)!",
            aboutFeedback: "We look forward to your input!",
        
            //Privacy Policy:
            privacyTitle: "Privacy Policy",
            privacyContent: "This section contains the website's privacy policy, providing information about how user data is processed and stored.",
        
            //Imprint:
            imprintTitle: "Imprint",
            imprintContent: "This section contains information about the website provider, such as name, address, contact information, etc.",
        },
        ar: {
            home: "الصفحة الرئيسية",
            about: "من نحن",
            aboutTextLink: "نص عن نحن",
            graph: "بيانات انبعاثات ثاني أكسيد الكربون",
            mission: "مهمتنا",
            missionText: "تتيح لك هذه المنصة استكشاف انبعاثات ثاني أكسيد الكربون الخاصة بشركات مختلفة من دول مختلفة. دعونا نعمل معًا من أجل الشفافية!",
            countryLabel: "البلد",
            companyLabel: "الشركة",
            allOption: "الكل",
            graphLabel: "انبعاثات ثاني أكسيد الكربون (بالأطنان)",
            footerImpressum: "التعليمات",
            footerDatenschutz: "سياسة الخصوصية",
            footerRights: "جميع الحقوق محفوظة.",
            graphLink: "بيانات انبعاثات ثاني أكسيد الكربون",
            missionLink: "مهمتنا",
            
            //About Us:
            aboutTitle: "من نحن",
            aboutWelcome: "مرحباً بكم في \"كن التغيير\"! هدفنا هو خلق الشفافية في انبعاثات ثاني أكسيد الكربون لتعزيز القرارات الواعية وإحداث تأثير إيجابي على كوكبنا.",
            aboutContact: "لا تترددوا في التواصل معنا عبر البريد الإلكتروني (bethechange@gmail.com) أو متابعتنا على انستغرام (@bethechange)!",
            aboutFeedback: "نتطلع إلى مشاركاتكم!",
        
            //Privacy Policy:
            privacyTitle: "سياسة الخصوصية",
            privacyContent: "يحتوي هذا القسم على سياسة الخصوصية للموقع، والتي توفر معلومات حول كيفية معالجة وتخزين بيانات المستخدم.",
        
            //Imprint:
            imprintTitle: "بيانات النشر",
            imprintContent: "يحتوي هذا القسم على معلومات عن مزود الموقع، مثل الاسم والعنوان ومعلومات الاتصال وما إلى ذلك.",
        },
    };

    // Dropdowns füllen
    function populateDropdown(dropdown, items, label, allOption) {
        if (!dropdown) return;
        dropdown.innerHTML = `<option value="all">${allOption}</option>`;
        items.forEach(item => {
            dropdown.innerHTML += `<option value="${item}">${item}</option>`;
        });
    }

    // Graph erstellen
    function createChart(filteredData, lang = 'de') {
        if (!ctx) return;
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

    // Filter-Logik
    function updateFilters(lang = 'de') {
        const countryDropdown = document.getElementById("country");
        const companyDropdown = document.getElementById("company");
        if (!countryDropdown || !companyDropdown) return;

        const selectedCountry = countryDropdown.value;
        const selectedCompany = companyDropdown.value;

        if (selectedCountry === "all" && selectedCompany === "all") {
            showTotalsByCountry(lang);
        } else if (selectedCountry !== "all" && selectedCompany === "all") {
            createChart(data[selectedCountry], lang);
            populateDropdown(companyDropdown, Object.keys(data[selectedCountry]), translations[lang].companyLabel, translations[lang].allOption);
        } else if (selectedCompany !== "all" && selectedCountry === "all") {
            const companyData = {};
            countries.forEach(country => {
                if (data[country][selectedCompany] !== undefined) {
                    companyData[country] = data[country][selectedCompany];
                }
            });
            createChart(companyData, lang);
            populateDropdown(countryDropdown, Object.keys(companyData), translations[lang].countryLabel, translations[lang].allOption);
        } else {
            createChart({ [selectedCompany]: data[selectedCountry][selectedCompany] }, lang);
        }
    }

    function updatePageContent(lang) {
        const content = translations[lang];
        currentLang = lang;
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        try {
            // Update navigation elements
            document.querySelector('.dropdown a[href="index.html"]').textContent = content.home;
            document.querySelector('.dropdown a[href="about.html"]').textContent = content.about;
            document.querySelector('.dropdown-menu a[href="index.html#graph"]').textContent = content.graphLink;
            document.querySelector('.dropdown-menu a[href="index.html#mission"]').textContent = content.missionLink;
            document.querySelector('.dropdown-menu a[href="about.html#about-text"]').textContent = content.aboutTextLink;

            // Update footer
            const footerLinks = document.querySelectorAll('footer a');
            footerLinks[0].textContent = content.footerImpressum;
            footerLinks[1].textContent = content.footerDatenschutz;
            const footerRights = document.querySelector('footer p').childNodes[0];
            if (footerRights) {
                footerRights.textContent = `© 2024 Be The Change. ${content.footerRights} `;
            }

            // Update flags active state
            const allFlags = document.querySelectorAll('.lang-flag');
            allFlags.forEach(flag => flag.classList.remove('active'));
            document.getElementById(`lang-${lang}`).classList.add('active');

            // Handle RTL for Arabic
            const nav = document.querySelector('.header-nav');
            const mainContent = document.querySelector('main');
            if (lang === 'ar') {
                nav.classList.add('arabic');
                mainContent.classList.add('rtl-content');
                document.dir = 'rtl';
                document.documentElement.lang = 'ar';
                document.body.classList.add('rtl-content'); // Add this line
            } else {
                nav.classList.remove('arabic');
                mainContent.classList.remove('rtl-content');
                document.dir = 'ltr';
                document.documentElement.lang = lang;
                document.body.classList.remove('rtl-content'); // Add this line
            }


            // Update page-specific content
            switch(currentPage) {
                case 'index.html':
                    if (document.querySelector('#graph')) {
                        document.querySelector('#graph h2').textContent = content.graph;
                        document.querySelector('#mission h2').textContent = content.mission;
                        document.querySelector('#mission p').textContent = content.missionText;
                        document.querySelector('label[for="country"]').textContent = content.countryLabel;
                        document.querySelector('label[for="company"]').textContent = content.companyLabel;
                        updateFilters(lang);
                    }
                    break;

                case 'about.html':
                    if (document.querySelector('#about-text')) {
                        document.querySelector('#about-text h2').textContent = content.aboutTitle;
                        const paragraphs = document.querySelectorAll('#about-text p');
                        if (paragraphs.length >= 3) {
                            paragraphs[0].textContent = content.aboutWelcome;
                            paragraphs[1].textContent = content.aboutContact;
                            paragraphs[2].textContent = content.aboutFeedback;
                        }
                    }
                    break;

                case 'datenschutz.html':
                    if (document.querySelector('#datenschutz')) {
                        document.querySelector('#datenschutz h2').textContent = content.privacyTitle;
                        document.querySelector('#datenschutz p').textContent = content.privacyContent;
                    }
                    break;

                case 'impressum.html':
                    if (document.querySelector('#impressum')) {
                        document.querySelector('#impressum h2').textContent = content.imprintTitle;
                        document.querySelector('#impressum p').textContent = content.imprintContent;
                    }
                    break;
            }
        } catch (e) {
            console.error('Error updating content:', e);
        }
    }

    // Initialize the page
    const countryDropdown = document.getElementById("country");
    const companyDropdown = document.getElementById("company");
    
    if (countryDropdown && companyDropdown) {
        populateDropdown(countryDropdown, countries, translations['de'].countryLabel, translations['de'].allOption);
        populateDropdown(companyDropdown, allCompanies, translations['de'].companyLabel, translations['de'].allOption);
        
        countryDropdown.addEventListener("change", () => updateFilters(currentLang));
        companyDropdown.addEventListener("change", () => updateFilters(currentLang));
        
        showTotalsByCountry('de');
    }

    // Initialize language switchers
    const langDe = document.getElementById('lang-de');
    const langEn = document.getElementById('lang-en');
    const langAr = document.getElementById('lang-ar');

    if (langDe && langEn && langAr) {
        langDe.addEventListener('click', () => updatePageContent('de'));
        langEn.addEventListener('click', () => updatePageContent('en'));
        langAr.addEventListener('click', () => updatePageContent('ar'));

        // Initialize with German language
        updatePageContent('de');
    }
});
