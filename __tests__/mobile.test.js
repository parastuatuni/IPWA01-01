describe('Mobile Menu Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <button class="mobile-menu-button" aria-label="Toggle menu">
                <span class="menu-icon">☰</span>
            </button>
            <nav>
                <ul class="header-nav">
                    <li class="dropdown">
                        <a href="index.html">Startseite</a>
                    </li>
                </ul>
            </nav>
        `;

        // Add click event handler
        const menuButton = document.querySelector('.mobile-menu-button');
        const nav = document.querySelector('.header-nav');
        
        menuButton.addEventListener('click', () => {
            nav.classList.toggle('show');
            menuButton.setAttribute('aria-expanded', nav.classList.contains('show').toString());
        });
    });

    test('mobile menu button exists', () => {
        const menuButton = document.querySelector('.mobile-menu-button');
        expect(menuButton).toBeTruthy();
    });

    test('mobile menu is initially hidden', () => {
        const nav = document.querySelector('.header-nav');
        expect(nav.classList.contains('show')).toBe(false);
    });

    test('clicking menu button toggles menu visibility', () => {
        const menuButton = document.querySelector('.mobile-menu-button');
        const nav = document.querySelector('.header-nav');
        
        menuButton.click();
        expect(nav.classList.contains('show')).toBe(true);
        
        menuButton.click();
        expect(nav.classList.contains('show')).toBe(false);
    });

    test('menu button has correct accessibility attributes', () => {
        const menuButton = document.querySelector('.mobile-menu-button');
        expect(menuButton.getAttribute('aria-label')).toBe('Toggle menu');
    });
});
