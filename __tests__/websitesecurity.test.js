describe('Website Security Tests', () => {
    // Import or recreate the security functions for testing
    function sanitizeString(str) {
        if (typeof str !== 'string') return '';
        // More comprehensive character escaping
        return str.replace(/[<>&"'`=\/]/g, match => {
          const entities = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;',
            '=': '&#x3D;',
            '/': '&#x2F;',
            ':': '&#x3A;'  // Add colon escaping
          };
          return entities[match] || match;
        });
      }      
  
    function validateSelection(value, allowedValues) {
      if (!value || !allowedValues) return false;
      return allowedValues.includes(value) || value === 'all';
    }
  
    function validateInput(input, pattern) {
      if (!input) return false;
      return pattern.test(input);
    }
  
    function populateDropdown(dropdown, items, label, allOption) {
        if (!dropdown || !Array.isArray(items)) return;
        
        dropdown.innerHTML = '';
        
        const allOpt = document.createElement('option');
        allOpt.value = 'all';
        allOpt.textContent = sanitizeString(allOption);
        dropdown.appendChild(allOpt);
        
        items.forEach(item => {
          const opt = document.createElement('option');
          const safeItem = sanitizeString(item);
          opt.value = safeItem;  
          opt.textContent = safeItem;  
          dropdown.appendChild(opt);
        });
      }          
  
    // XSS Prevention Tests
    test('sanitizeString prevents XSS', () => {
        const testCases = [
          '<script>alert("XSS")</script>',
          '<img src=x onerror=alert(1)>',
          'javascript:alert(1)',
          '<a href="javascript:alert(1)">',
          '"><script>alert(document.cookie)</script>'
        ];
      
        testCases.forEach(input => {
          const sanitized = sanitizeString(input);
          
          if (input.includes('<')) {
            expect(sanitized).toContain('&lt;');
          }
          if (input.includes('>')) {
            expect(sanitized).toContain('&gt;');
          }
          if (input.includes('"')) {
            expect(sanitized).toContain('&quot;');
          }
          
          expect(sanitized).not.toContain('<script');
          expect(sanitized).not.toContain('onerror=alert');
        });
      });           
  
    test('sanitizeString handles non-string inputs', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(123)).toBe('');
      expect(sanitizeString({})).toBe('');
    });
  
    // Input Validation Tests
    test('validateSelection rejects invalid inputs', () => {
      const validCountries = ['Germany', 'USA', 'China'];
      expect(validateSelection('Germany', validCountries)).toBe(true);
      expect(validateSelection('all', validCountries)).toBe(true);
      expect(validateSelection('Hacker', validCountries)).toBe(false);
      expect(validateSelection(null, validCountries)).toBe(false);
      expect(validateSelection(undefined, validCountries)).toBe(false);
      expect(validateSelection('<script>', validCountries)).toBe(false);
    });
  
    test('validateInput correctly validates patterns', () => {
      const countryPattern = /^[A-Za-z\s]{2,50}$/;
      const companyPattern = /^[A-Za-z0-9\s_\-&]{2,50}$/;
      
      // Valid inputs
      expect(validateInput('Germany', countryPattern)).toBe(true);
      expect(validateInput('United States', countryPattern)).toBe(true);
      expect(validateInput('Siemens AG', companyPattern)).toBe(true);
      
      // Invalid inputs
      expect(validateInput('<script>alert(1)</script>', countryPattern)).toBe(false);
      expect(validateInput('', countryPattern)).toBe(false);
      expect(validateInput(null, countryPattern)).toBe(false);
      expect(validateInput('Company-123<script>', companyPattern)).toBe(false);
    });
  
    // DOM Manipulation Security Tests
    test('populateDropdown safely handles malicious input', () => {
        document.body.innerHTML = '<select id="testSelect"></select>';
        const select = document.getElementById('testSelect');
        const maliciousItems = ['<img src=x onerror=alert(1)>', 'normal', '<script>alert(2)</script>'];
        
        populateDropdown(select, maliciousItems, 'Test', 'All');
        
        expect(select.options.length).toBe(4); // "all" + 3 items
        
        for (let i = 0; i < select.options.length; i++) {
          const option = select.options[i];
          expect(option.value).not.toContain('<script>');
          expect(option.value).not.toContain('onerror=');
        }
        
        const html = select.innerHTML;
        expect(html).not.toContain('<script>');
        expect(html).not.toContain('onerror=alert');
        
        expect(select.textContent).toContain('normal');
      });                 
  });
  