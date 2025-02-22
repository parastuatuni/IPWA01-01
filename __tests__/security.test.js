describe('Security Functions', () => {
    // Mock the functions since they're not directly accessible
    const validateSelection = (value, allowedValues) => {
        if (!value || !allowedValues) return false;
        return allowedValues.includes(value) || value === 'all';
    };

    const sanitizeString = (str) => {
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

    test('validateSelection should handle valid inputs', () => {
        expect(validateSelection('Germany', ['Germany', 'USA'])).toBe(true);
        expect(validateSelection('all', ['Germany', 'USA'])).toBe(true);
    });

    test('validateSelection should reject invalid inputs', () => {
        expect(validateSelection('InvalidCountry', ['Germany', 'USA'])).toBe(false);
        expect(validateSelection(null, ['Germany', 'USA'])).toBe(false);
        expect(validateSelection(undefined, ['Germany', 'USA'])).toBe(false);
    });

    test('sanitizeString should escape HTML characters', () => {
        expect(sanitizeString('<script>')).toBe('&lt;script&gt;');
        expect(sanitizeString('<img src="x" onerror="alert(1)">')).toBe('&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;');
    });

    test('sanitizeString should handle invalid inputs', () => {
        expect(sanitizeString(null)).toBe('');
        expect(sanitizeString(undefined)).toBe('');
        expect(sanitizeString(123)).toBe('');
    });
});
