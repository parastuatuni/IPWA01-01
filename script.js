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

    // Dropdowns füllen
    function populateDropdown(dropdown, items) {
        dropdown.innerHTML = '<option value="all">Alle</option>';
        items.forEach(item => {
            dropdown.innerHTML += `<option value="${item}">${item}</option>`;
        });
    }

    populateDropdown(countryDropdown, countries);
    populateDropdown(companyDropdown, allCompanies);

    // Graph erstellen
    function createChart(filteredData) {
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(filteredData),
                datasets: [{
                    label: 'CO₂-Emissionen (in Tonnen)',
                    data: Object.values(filteredData),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Standardanzeige: Nach Ländern
    function showTotalsByCountry() {
        const totals = {};
        countries.forEach(country => {
            totals[country] = Object.values(data[country]).reduce((a, b) => a + b, 0);
        });
        createChart(totals);
    }

    showTotalsByCountry();

    // Filter-Logik
    function updateFilters() {
        const selectedCountry = countryDropdown.value;
        const selectedCompany = companyDropdown.value;

        if (selectedCountry === "all" && selectedCompany === "all") {
            showTotalsByCountry();
        } else if (selectedCountry !== "all" && selectedCompany === "all") {
            createChart(data[selectedCountry]);
            populateDropdown(companyDropdown, Object.keys(data[selectedCountry]));
        } else if (selectedCompany !== "all" && selectedCountry === "all") {
            const companyData = {};
            countries.forEach(country => {
                if (data[country][selectedCompany] !== undefined) {
                    companyData[country] = data[country][selectedCompany];
                }
            });
            createChart(companyData);
            populateDropdown(countryDropdown, Object.keys(companyData));
        } else {
            createChart({ [selectedCompany]: data[selectedCountry][selectedCompany] });
        }
    }

    // Event-Listener für Filter
    countryDropdown.addEventListener("change", updateFilters);
    companyDropdown.addEventListener("change", updateFilters);
});
