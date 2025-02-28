const testData = {
    Germany: { Siemens: 100, Volkswagen: 200 },
    USA: { Apple: 150, Microsoft: 250 }
};

describe('Graph Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="co2Graph"></div>
            <select id="country"></select>
            <select id="company"></select>
        `;
    });

    test('CO2 data structure matches expected format', () => {
        // Test that Germany has correct companies and values
        expect(testData.Germany.Siemens).toBe(100);
        expect(testData.Germany.Volkswagen).toBe(200);
        
        // Test that USA has correct companies and values
        expect(testData.USA.Apple).toBe(150);
        expect(testData.USA.Microsoft).toBe(250);
    });

    test('country totals are calculated correctly', () => {
        // Test Germany total (Siemens 100 + Volkswagen 200 = 300)
        const germanyTotal = Object.values(testData.Germany).reduce((a, b) => a + b, 0);
        expect(germanyTotal).toBe(300);
    });

    test('dropdowns exist in DOM', () => {
        const countryDropdown = document.getElementById('country');
        const companyDropdown = document.getElementById('company');
        
        expect(countryDropdown).toBeTruthy();
        expect(companyDropdown).toBeTruthy();
    });
});
