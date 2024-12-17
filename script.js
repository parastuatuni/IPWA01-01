document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('co2Graph').getContext('2d');

    // Beispiel-Daten für CO₂-Emissionen
    const data = {
        Germany: { Siemens: 100, Volkswagen: 200, Total: 300 },
        USA: { Apple: 150, Microsoft: 250, Total: 400 },
        China: { Huawei: 300, Xiaomi: 100, Total: 400 },
    };

    const countries = Object.keys(data);
    const companies = { all: "Alle", ...Object.assign({}, ...countries.map(c => Object.keys(data[c]).reduce((a, v) => ({ ...a, [v]: v }), {}))) };

    const countryDropdown = document.getElementById("country");
    const companyDropdown = document.getElementById("company");

    // Initial Dropdowns füllen
    function populateDropdown(dropdown, items) {
        dropdown.innerHTML = '<option value="all">Alle</option>';
        for (let item of items) {
            dropdown.innerHTML += `<option value="${item}">${item}</option>`;
        }
    }
    populateDropdown(countryDropdown, countries);
    populateDropdown(companyDropdown, Object.keys(companies));

    let chart;

    // Balkendiagramm erstellen
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

    // Initiale Anzeige nach Ländern
    createChart(Object.fromEntries(countries.map(c => [c, data[c].Total])));

    // Filterlogik
    countryDropdown.addEventListener("change", () => {
        const country = countryDropdown.value;
        if (country === "all") {
            createChart(Object.fromEntries(countries.map(c => [c, data[c].Total])));
        } else {
            createChart(data[country]);
        }
    });
});

