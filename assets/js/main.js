(() => {
  'use strict';

  const currentYear = document.querySelectorAll('[data-current-year]');
  currentYear.forEach((el) => { el.textContent = new Date().getFullYear(); });

  const currentFile = (() => {
    const file = window.location.pathname.split('/').pop();
    return file || 'index.html';
  })();

  document.querySelectorAll('[data-nav]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const hrefFile = href.split('#')[0];
    if (hrefFile === currentFile) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const servicePages = ['servicos.html', 'limpeza.html', 'seguranca.html'];
  if (servicePages.includes(currentFile)) {
    const serviceTrigger = document.querySelector('[data-services-nav]');
    if (serviceTrigger) serviceTrigger.classList.add('active');
  }

  const navbarCollapse = document.querySelector('#mainNav');
  if (navbarCollapse && window.bootstrap) {
    navbarCollapse.querySelectorAll('a:not(.dropdown-toggle)').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
        }
      });
    });
  }
})();
