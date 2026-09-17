(() => {
  'use strict';

  const form = document.querySelector('#contactForm');
  if (!form) return;

  const statusBox = document.querySelector('#formStatus');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonHtml = submitButton ? submitButton.innerHTML : '';

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get('servico');
  const serviceSelect = form.querySelector('[name="servico"]');
  if (serviceSelect && requestedService) {
    const map = {
      limpeza: 'Limpeza profissional',
      seguranca: 'Segurança',
      ambos: 'Limpeza e segurança'
    };
    const value = map[requestedService];
    if (value) serviceSelect.value = value;
  }

  const setStatus = (type, message) => {
    if (!statusBox) return;
    statusBox.className = `form-status is-visible ${type}`;
    statusBox.textContent = message;
    statusBox.setAttribute('role', type === 'error' ? 'alert' : 'status');
  };

  const clearStatus = () => {
    if (!statusBox) return;
    statusBox.className = 'form-status';
    statusBox.textContent = '';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearStatus();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      setStatus('error', 'Revise os campos obrigatórios antes de enviar.');
      return;
    }

    const email = form.querySelector('[name="email"]')?.value.trim() || '';
    const phone = form.querySelector('[name="telefone"]')?.value.trim() || '';
    if (!email && !phone) {
      setStatus('error', 'Informe ao menos um meio de contato: e-mail ou telefone.');
      return;
    }

    const payload = new FormData(form);
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Enviando';
    }

    try {
      const response = await fetch('api/contato.php', {
        method: 'POST',
        body: payload,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      let data = null;
      try { data = await response.json(); } catch (_) { data = null; }

      if (!response.ok || !data?.ok) {
        throw new Error(data?.message || 'Não foi possível enviar sua solicitação agora.');
      }

      form.reset();
      form.classList.remove('was-validated');
      setStatus('success', data.message || 'Solicitação enviada. A equipe comercial poderá retornar pelo canal informado.');
    } catch (error) {
      setStatus('error', error.message || 'Não foi possível enviar sua solicitação agora.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHtml;
      }
    }
  });
})();

(() => { const s=document.querySelector('#servico'); if(!s)return; const q=new URLSearchParams(location.search).get('servico'); const m={limpeza:'Limpeza profissional',seguranca:'Segurança',jardinagem:'Jardinagem',manutencao:'Manutenção'}; if(q&&m[q]) s.value=m[q]; })();
