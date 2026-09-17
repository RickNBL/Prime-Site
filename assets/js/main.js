(() => {
  'use strict';

  const primeMobileViewportGuard = () => {
    if (window.innerWidth < 1200 && window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY);
    }
  };
  window.addEventListener('pageshow', primeMobileViewportGuard, { passive: true });
  window.addEventListener('resize', primeMobileViewportGuard, { passive: true });
  primeMobileViewportGuard();

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

  const servicePages = ['limpeza.html', 'seguranca.html', 'jardinagem.html', 'manutencao.html'];
  if (servicePages.includes(currentFile)) {
    const serviceTrigger = document.querySelector('[data-services-nav]');
    if (serviceTrigger) serviceTrigger.classList.add('active');
  }

  const navbarCollapse = document.querySelector('#mainNav');
  if (navbarCollapse && window.bootstrap) {
    navbarCollapse.querySelectorAll('a:not(.dropdown-toggle)').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1200 && navbarCollapse.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
        }
      });
    });
  }
})();
