// integration.test.js
describe('Website Integration Tests', () => {
    // Mock Chart.js
    const mockChart = {
      destroy: jest.fn()
    };
    
    // Setup mock DOM for testing
    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();
      
      // Create a more complete DOM structure for integration testing
      document.body.innerHTML = `
        <header>
          <div class="header-container">
            <div class="header-logo">
              <a href="index.html"><img src="Logo.png" alt="Be The Change Logo"></a>
              <h1><a href="index.html" class="header-title">Be The Change</a></h1>
            </div>
            
            <button class="mobile-menu-button" aria-label="Toggle menu">
              <span class="menu-icon">☰</span>
            </button>
            
            <div class="language-selector">
              <img src="de_flag.png" alt="Deutsch" class="lang-flag active" id="lang-de">
              <img src="en_flag.png" alt="English" class="lang-flag" id="lang-en">
              <img src="arabic_flag.png" alt="Arabic" class="lang-flag" id="lang-ar">
            </div>
            
            <nav>
              <ul class="header-nav">
                <li class="dropdown">
                  <a href="index.html">Startseite</a>
                  <ul class="dropdown-menu">
                    <li><a href="index.html#graph">CO₂-Emissionsdaten</a></li>
                    <li><a href="index.html#mission">Unsere Mission</a></li>
                  </ul>
                </li>
                <li class="dropdown">
                  <a href="about.html">Über Uns</a>
                  <ul class="dropdown-menu">
                    <li><a href="about.html#about-text">Über Uns Text</a></li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      <main>
        <section id="graph">
          <h2>CO₂-Emissionsdaten</h2>
          <div class="filters">
            <label for="country">Land:</label>
            <select id="country">
              <option value="all">Alle</option>
            </select>
            <label for="company">Firma:</label>
            <select id="company">
              <option value="all">Alle</option>
            </select>
          </div>
          <canvas id="co2Graph"></canvas>
        </section>

        <section id="mission">
          <h2>Unsere Mission</h2>
          <p>Diese Plattform ermöglicht es dir, die CO₂-Emissionen verschiedener Unternehmen aus unterschiedlichen Ländern zu erkunden. Lass uns gemeinsam an der Transparenz arbeiten!</p>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Be The Change. Alle Rechte vorbehalten. 
          <a href="impressum.html">Impressum</a> | 
          <a href="datenschutz.html">Datenschutz</a>
        </p>
      </footer>
    `;

    // Mock Chart constructor
    global.Chart = jest.fn(() => mockChart);
    // Simulate script.js functionality for testing
    window.validateSelection = (value, allowedValues) => {
        if (!value || !allowedValues) return false;
        return allowedValues.includes(value) || value === 'all';
      };
  
      window.sanitizeString = (str) => {
        if (typeof str !== 'string') return '';
        return str.replace(/[<>&"']/g, match => {
          const entities = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#x27;'
          };
          return entities[match];
        });
      };
  
      // Sample data for testing
      window.data = {
        Germany: { Siemens: 100, Volkswagen: 200 },
        USA: { Apple: 150, Microsoft: 250 },
        China: { Huawei: 300, Xiaomi: 100 }
      };
  
      window.countries = Object.keys(window.data);
      window.allCompanies = [...new Set(window.countries.flatMap(country => Object.keys(window.data[country])))];
      window.currentLang = 'de';
    // Translations for testing
    window.translations = {
        de: {
          home: "Startseite",
          about: "Über Uns",
          aboutTextLink: "Über Uns Text",
          graph: "CO₂-Emissionsdaten",
          mission: "Unsere Mission",
          missionText: "Diese Plattform ermöglicht es dir, die CO₂-Emissionen verschiedener Unternehmen aus unterschiedlichen Ländern zu erkunden. Lass uns gemeinsam an der Transparenz arbeiten!",
          countryLabel: "Land",
          companyLabel: "Firma",
          allOption: "Alle",
          graphLabel: "CO₂-Emissionen (in Tonnen)",
          footerImpressum: "Impressum",
          footerDatenschutz: "Datenschutz",
          footerRights: "Alle Rechte vorbehalten.",
          graphLink: "CO₂-Emissionsdaten",
          missionLink: "Unsere Mission",
          menuToggle: "Menü"
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
          menuToggle: "Menu"
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
          menuToggle: "القائمة"
        }
      };
    // Mock functions for testing
    window.populateDropdown = (dropdown, items, label, allOption) => {
        if (!dropdown || !Array.isArray(items)) return;
        const safeAllOption = window.sanitizeString(allOption);
        dropdown.innerHTML = `<option value="all">${safeAllOption}</option>`;
        items.forEach(item => {
          const safeItem = window.sanitizeString(item);
          dropdown.innerHTML += `<option value="${safeItem}">${safeItem}</option>`;
        });
      };
  
      window.createChart = jest.fn((filteredData, lang = 'de') => {
        // Mock chart creation
        if (window.chart) window.chart.destroy();
        window.chart = mockChart;
        window.chartData = {
          filteredData,
          lang
        };
      });
  
      window.showTotalsByCountry = (lang = 'de') => {
        const totals = {};
        window.countries.forEach(country => {
          totals[country] = Object.values(window.data[country]).reduce((a, b) => a + b, 0);
        });
        window.createChart(totals, lang);
      };
      window.updateFilters = (lang = 'de') => {
        const countryDropdown = document.getElementById("country");
        const companyDropdown = document.getElementById("company");
        if (!countryDropdown || !companyDropdown) return;
  
        const selectedCountry = countryDropdown.value;
        const selectedCompany = companyDropdown.value;
  
        // Validate selections
        if (!window.validateSelection(selectedCountry, [...window.countries, 'all']) || 
            !window.validateSelection(selectedCompany, [...window.allCompanies, 'all'])) {
          console.error('Invalid selection detected');
          return;
        }
  
        if (selectedCountry === "all" && selectedCompany === "all") {
          window.showTotalsByCountry(lang);
        } else if (selectedCountry !== "all" && selectedCompany === "all") {
          window.createChart(window.data[selectedCountry], lang);
          window.populateDropdown(companyDropdown, Object.keys(window.data[selectedCountry]), window.translations[lang].companyLabel, window.translations[lang].allOption);
        } else if (selectedCompany !== "all" && selectedCountry === "all") {
          const companyData = {};
          window.countries.forEach(country => {
            if (window.data[country][selectedCompany] !== undefined) {
              companyData[country] = window.data[country][selectedCompany];
            }
          });
          window.createChart(companyData, lang);
          window.populateDropdown(countryDropdown, Object.keys(companyData), window.translations[lang].countryLabel, window.translations[lang].allOption);
        } else {
          window.createChart({ [selectedCompany]: window.data[selectedCountry][selectedCompany] }, lang);
        }
      };
      window.updatePageContent = (lang) => {
        const content = window.translations[lang];
        window.currentLang = lang;
  
        try {
          // Update navigation elements with sanitization
          document.querySelector('.dropdown a[href="index.html"]').textContent = window.sanitizeString(content.home);
          document.querySelector('.dropdown a[href="about.html"]').textContent = window.sanitizeString(content.about);
          document.querySelector('.dropdown-menu a[href="index.html#graph"]').textContent = window.sanitizeString(content.graphLink);
          document.querySelector('.dropdown-menu a[href="index.html#mission"]').textContent = window.sanitizeString(content.missionLink);
          document.querySelector('.dropdown-menu a[href="about.html#about-text"]').textContent = window.sanitizeString(content.aboutTextLink);
  
          document.querySelector('.mobile-menu-button').setAttribute('aria-label', window.sanitizeString(content.menuToggle));
          
          // Update footer
          const footerLinks = document.querySelectorAll('footer a');
          footerLinks[0].textContent = window.sanitizeString(content.footerImpressum);
          footerLinks[1].textContent = window.sanitizeString(content.footerDatenschutz);
          
          // Update section content
          document.querySelector('#graph h2').textContent = window.sanitizeString(content.graph);
          document.querySelector('#mission h2').textContent = window.sanitizeString(content.mission);
          document.querySelector('#mission p').textContent = window.sanitizeString(content.missionText);
          document.querySelector('label[for="country"]').textContent = window.sanitizeString(content.countryLabel) + ':';
          document.querySelector('label[for="company"]').textContent = window.sanitizeString(content.companyLabel) + ':';
        // Update flags
        const allFlags = document.querySelectorAll('.lang-flag');
        allFlags.forEach(flag => flag.classList.remove('active'));
        document.getElementById(`lang-${lang}`).classList.add('active');

        // Handle RTL
        const nav = document.querySelector('.header-nav');
        const mainContent = document.querySelector('main');
        if (lang === 'ar') {
        nav.classList.add('arabic');
        mainContent.classList.add('rtl-content');
        document.dir = 'rtl';
        document.documentElement.lang = 'ar';
        document.body.classList.add('rtl-content');
        } else {
        nav.classList.remove('arabic');
        mainContent.classList.remove('rtl-content');
        document.dir = 'ltr';
        document.documentElement.lang = lang;
        document.body.classList.remove('rtl-content');
        }

        // Reset mobile menu - THIS IS THE NEW CODE TO ADD
        const headerNav = document.querySelector('.header-nav');
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        if (headerNav && headerNav.classList.contains('show')) {
        headerNav.classList.remove('show');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        }

        // Update filters
        window.updateFilters(lang);

      } catch (e) {
        console.error('Error updating content:', e);
      }
    };
    // Initialize dropdowns
    const countryDropdown = document.getElementById("country");
    const companyDropdown = document.getElementById("company");
    
    window.populateDropdown(countryDropdown, window.countries, window.translations['de'].countryLabel, window.translations['de'].allOption);
    window.populateDropdown(companyDropdown, window.allCompanies, window.translations['de'].companyLabel, window.translations['de'].allOption);
    
    // Add event listeners
    countryDropdown.addEventListener("change", () => window.updateFilters(window.currentLang));
    companyDropdown.addEventListener("change", () => window.updateFilters(window.currentLang));
    
    document.getElementById('lang-de').addEventListener('click', () => window.updatePageContent('de'));
    document.getElementById('lang-en').addEventListener('click', () => window.updatePageContent('en'));
    document.getElementById('lang-ar').addEventListener('click', () => window.updatePageContent('ar'));
    
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const headerNav = document.querySelector('.header-nav');
    
    mobileMenuButton.addEventListener('click', () => {
      headerNav.classList.toggle('show');
      mobileMenuButton.setAttribute('aria-expanded', headerNav.classList.contains('show').toString());
    });
    
    // Initialize chart
    window.showTotalsByCountry('de');
  });
  // Test 1: Language switching affects multiple components
  test('language switching updates UI elements across the page', () => {
    // Click English language option
    document.getElementById('lang-en').click();
    
    // Check that multiple components have been updated to English
    expect(document.querySelector('.dropdown a[href="index.html"]').textContent).toBe('Home');
    expect(document.querySelector('#graph h2').textContent).toBe('CO₂ Emissions Data');
    expect(document.querySelector('#mission h2').textContent).toBe('Our Mission');
    expect(document.querySelector('label[for="country"]').textContent).toBe('Country:');
    expect(document.querySelector('label[for="company"]').textContent).toBe('Company:');
    expect(document.querySelector('footer a[href="impressum.html"]').textContent).toBe('Imprint');
    
    // Check that chart was updated with English labels
    expect(window.createChart).toHaveBeenCalled();
    expect(window.currentLang).toBe('en');
  });
  // Test 2: Mobile menu integration
  test('mobile menu toggles correctly and interacts with language switching', () => {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const headerNav = document.querySelector('.header-nav');
    
    // Initially menu is hidden
    expect(headerNav.classList.contains('show')).toBe(false);
    
    // Click to show menu
    mobileMenuButton.click();
    expect(headerNav.classList.contains('show')).toBe(true);
    expect(mobileMenuButton.getAttribute('aria-expanded')).toBe('true');
    
    // Language switch should close mobile menu
    document.getElementById('lang-en').click();
    expect(headerNav.classList.contains('show')).toBe(false);
    expect(mobileMenuButton.getAttribute('aria-expanded')).toBe('false');
  });
  // Test 3: Filter integration with chart
  test('filter changes update chart data correctly', () => {
    const countryDropdown = document.getElementById('country');
    const companyDropdown = document.getElementById('company');
    
    // Select Germany
    countryDropdown.value = 'Germany';
    countryDropdown.dispatchEvent(new Event('change'));
    
    // Chart should be called with Germany data
    expect(window.createChart).toHaveBeenCalledWith(
      window.data.Germany, 
      'de'
    );
    
    // Select Siemens
    companyDropdown.value = 'Siemens';
    companyDropdown.dispatchEvent(new Event('change'));
    
    // Chart should be called with Siemens data for Germany
    expect(window.createChart).toHaveBeenCalledWith(
      { Siemens: 100 }, 
      'de'
    );
  });
  // Test 4: RTL support for Arabic
  test('Arabic language sets RTL direction', () => {
    // Switch to Arabic
    document.getElementById('lang-ar').click();
    
    // Check RTL classes and attributes
    expect(document.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.body.classList.contains('rtl-content')).toBe(true);
    expect(document.querySelector('main').classList.contains('rtl-content')).toBe(true);
    
    // Switch back to German
    document.getElementById('lang-de').click();
    expect(document.dir).toBe('ltr');
    expect(document.body.classList.contains('rtl-content')).toBe(false);
  });
});
            