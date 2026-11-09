// Formulario de contacto: envía a Formspree sin salir de la página.
// Sin JavaScript, el formulario se envía igual de forma normal y Formspree muestra su página de confirmación.
(function () {
  var EN = /^en\b/i.test(document.documentElement.lang || '');
  var TEXT = EN ? {
    sending: 'Sending…',
    doneTitle: 'Message sent',
    doneBody: 'Thanks for writing. We will reply to your email within one business day.',
    error: 'We couldn\'t send your message. Please try again or email us at hola@montilabs.cl.'
  } : {
    sending: 'Enviando…',
    doneTitle: 'Mensaje enviado',
    doneBody: 'Gracias por escribirnos. Te responderemos a tu correo en un día hábil.',
    error: 'No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos a hola@montilabs.cl.'
  };

  function init(form) {
    var button = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.form-status');
    var label = button.textContent;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      button.disabled = true;
      button.textContent = TEXT.sending;
      status.textContent = '';
      status.classList.remove('is-error');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
      }).then(function () {
        // Solo existe dataLayer si la persona aceptó las cookies (ver consent.js).
        if (window.dataLayer) {
          window.dataLayer.push({ event: 'contacto_enviado', contacto_pagina: window.location.pathname });
        }
        var done = document.createElement('div');
        done.className = 'form-done';
        done.setAttribute('tabindex', '-1');
        done.innerHTML = '<h3></h3><p></p>';
        done.querySelector('h3').textContent = TEXT.doneTitle;
        done.querySelector('p').textContent = TEXT.doneBody;
        form.replaceWith(done);
        done.focus();
      }).catch(function () {
        status.textContent = TEXT.error;
        status.classList.add('is-error');
        button.disabled = false;
        button.textContent = label;
      });
    });
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll('form[data-contact-form]'), init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
