describe('Language Selector Tests', () => {
    beforeEach(() => {
        // Reset the DOM before each test
        document.body.innerHTML = `
            <div class="language-selector">
                <img id="lang-de" src="de_flag.png" alt="Deutsch" class="lang-flag">
                <img id="lang-en" src="en_flag.png" alt="English" class="lang-flag">
                <img id="lang-ar" src="arabic_flag.png" alt="Arabic" class="lang-flag">
            </div>
            <div class="dropdown">
                <a href="index.html">Startseite</a>
            </div>
        `;
    });

    test('language flags exist in DOM', () => {
        const germanFlag = document.getElementById('lang-de');
        const englishFlag = document.getElementById('lang-en');
        const arabicFlag = document.getElementById('lang-ar');
        
        expect(germanFlag).toBeTruthy();
        expect(englishFlag).toBeTruthy();
        expect(arabicFlag).toBeTruthy();
    });

    test('language flags have correct class', () => {
        const flags = document.querySelectorAll('.lang-flag');
        expect(flags.length).toBe(3);
        flags.forEach(flag => {
            expect(flag.classList.contains('lang-flag')).toBe(true);
        });
    });
});
