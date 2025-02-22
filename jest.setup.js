require('@testing-library/jest-dom');

jest.mock('chart.js', () => ({
  Chart: jest.fn()
}));

document.body.innerHTML = `
  <div id="co2Graph"></div>
  <select id="country"></select>
  <select id="company"></select>
  <div class="language-selector">
    <img id="lang-de" src="de_flag.png" alt="Deutsch">
    <img id="lang-en" src="en_flag.png" alt="English">
    <img id="lang-ar" src="arabic_flag.png" alt="Arabic">
  </div>
`;
