// S-BB Baustoffprüfung GmbH – Modern Redesign Script
(function () {
  'use strict';

  // =============================================
  // Scroll-triggered Reveal Animations
  // =============================================
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // =============================================
  // Animated Counter (Stats)
  // =============================================
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var text = el.textContent.trim();
        var match = text.match(/^(\d+)(\+?)$/);
        if (match) {
          var target = parseInt(match[1], 10);
          var suffix = match[2];
          var duration = 1500;
          var start = performance.now();
          el.textContent = '0' + suffix;
          function step(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(function (el) {
    counterObserver.observe(el);
  });

  // =============================================
  // Mobile menu
  // =============================================
  var menuToggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');

  menuToggle.addEventListener('click', function () {
    this.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      menuToggle.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // =============================================
  // Header scroll + back to top + active nav
  // =============================================
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 500);

    // Active nav
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { passive: true });

  // =============================================
  // Modal system
  // =============================================
  var overlay = document.getElementById('modal-overlay');
  var modalContent = document.getElementById('modal-content');
  var modalClose = document.getElementById('modal-close');

  function openModal(html) {
    modalContent.innerHTML = html;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // Impressum
  document.getElementById('impressum-btn').addEventListener('click', function () {
    openModal(
      '<h2>Impressum</h2>' +
      '<p><strong>Angaben gemäß § 5 TMG:</strong><br>S-BB Baustoffprüfung GmbH<br>Auf dem Land 10<br>66989 Höheinöd</p>' +
      '<p><strong>Vertreten durch:</strong><br>Dipl.-Wirtsch.-Ing. (FH) Christian Stracke<br>Dipl.-Ing. (BA) Steffen Stracke</p>' +
      '<p><strong>Kontakt:</strong><br>Telefon: 06333 2754830<br>Telefax: 06333 27548320<br>E-Mail: info@s-bb.de</p>' +
      '<p><strong>Registereintrag:</strong><br>Eintragung im Handelsregister<br>Registergericht: Zweibrücken<br>Registernummer: 3174</p>' +
      '<p><strong>Umsatzsteuer:</strong><br>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: DE315492461</p>' +
      '<h3>Streitschlichtung</h3>' +
      '<p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>' +
      '<h3>Haftung für Inhalte</h3>' +
      '<p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>'
    );
  });

  // Datenschutz
  var datenschutzHTML =
    '<h2>Datenschutzerklärung</h2>' +
    '<h3>1. Datenschutz auf einen Blick</h3>' +
    '<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen.</p>' +
    '<h3>Datenerfassung auf unserer Website</h3>' +
    '<p><strong>Wer ist verantwortlich?</strong><br>Die Datenverarbeitung erfolgt durch den Websitebetreiber. Kontaktdaten siehe Impressum.</p>' +
    '<p><strong>Wie erfassen wir Ihre Daten?</strong><br>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z.B. Kontaktformular). Andere Daten werden automatisch beim Besuch der Website erfasst.</p>' +
    '<h3>Verantwortliche Stelle</h3>' +
    '<p>S-BB Baustoffprüfung GmbH<br>Auf dem Land 10, 66989 Höheinöd<br>Telefon: 06333-2754830<br>E-Mail: info@s-bb.de</p>' +
    '<h3>Datenschutzbeauftragter</h3>' +
    '<p>Youdat Gunnar Schwarz und Torsten Becker GbR<br>Herr Torsten Becker<br>Rudolf-Diesel-Straße 2, 66919 Weselberg<br>Telefon: 06333 602960<br>E-Mail: torsten.becker@youdat.de</p>' +
    '<h3>Kontaktformular</h3>' +
    '<p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben zwecks Bearbeitung der Anfrage bei uns gespeichert.</p>';

  document.getElementById('datenschutz-btn').addEventListener('click', function () { openModal(datenschutzHTML); });
  document.getElementById('datenschutz-link').addEventListener('click', function (e) { e.preventDefault(); openModal(datenschutzHTML); });

  // AGB
  document.getElementById('agb-btn').addEventListener('click', function () {
    openModal(
      '<h2>Allgemeine Geschäftsbedingungen (AGB)</h2>' +
      '<h3>1. Geltungsbereich</h3>' +
      '<p>Diese AGB sind Bestandteil jedes zwischen der S-BB Baustoffprüfung GmbH und dem Auftraggeber geschlossenen Vertrages.</p>' +
      '<h3>2. Leistungsumfang</h3>' +
      '<p>Die S-BB Baustoffprüfung GmbH erbringt Ingenieurleistungen auf dem Gebiet des Hoch-, Tief- und Straßenbaus.</p>' +
      '<h3>3. Vervielfältigungen</h3>' +
      '<p>Prüfberichte und Gutachten dürfen nur ungekürzt weitergegeben werden.</p>' +
      '<h3>4. Vergütung</h3>' +
      '<p>Feste Gebührensätze nach der jeweils gültigen Preisliste.</p>' +
      '<h3>5. Zahlung</h3>' +
      '<p>Rechnungen sind 10 Tage nach Erhalt ohne Abzug zur Zahlung fällig.</p>' +
      '<h3>6. Haftung</h3>' +
      '<p>Die Haftung ist beschränkt auf vorsätzliches und grob fahrlässiges Handeln.</p>' +
      '<h3>7. Verjährung</h3>' +
      '<p>Haftungsansprüche müssen innerhalb eines Jahres nach Kenntniserlangung geltend gemacht werden.</p>' +
      '<h3>8. Gerichtsstand</h3>' +
      '<p>Es gilt deutsches Recht.</p>'
    );
  });

  // =============================================
  // Contact Form – AJAX Submit
  // =============================================
  var form = document.getElementById('contact-form');
  var statusDiv = document.createElement('div');
  statusDiv.className = 'form-status';
  form.parentNode.insertBefore(statusDiv, form);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('.btn-submit');
    var originalText = btn.textContent;
    statusDiv.className = 'form-status';
    btn.textContent = 'Wird gesendet...';
    btn.disabled = true;

    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (result) {
        if (result.ok && result.data.success) {
          statusDiv.className = 'form-status success';
          statusDiv.textContent = result.data.message;
          form.reset();
        } else {
          statusDiv.className = 'form-status error';
          statusDiv.textContent = result.data.message || 'Ein Fehler ist aufgetreten.';
        }
      })
      .catch(function () {
        var v = form.querySelector('#vorname').value;
        var n = form.querySelector('#nachname').value;
        var f = form.querySelector('#firma').value;
        var em = form.querySelector('#email').value;
        var t = form.querySelector('#telefon').value;
        var msg = form.querySelector('#nachricht').value;
        var subject = encodeURIComponent('Kontaktanfrage von ' + v + ' ' + n);
        var body = encodeURIComponent('Name: ' + v + ' ' + n + '\n' + (f ? 'Firma: ' + f + '\n' : '') + 'E-Mail: ' + em + '\nTelefon: ' + t + '\n\nNachricht:\n' + msg);
        window.location.href = 'mailto:info@s-bb.de?subject=' + subject + '&body=' + body;
        statusDiv.className = 'form-status success';
        statusDiv.textContent = 'Ihr E-Mail-Programm wird geöffnet.';
      })
      .finally(function () { btn.textContent = originalText; btn.disabled = false; });
  });

  // =============================================
  // Timeline Slideshow (Crossfade)
  // =============================================
  document.querySelectorAll('.slideshow').forEach(function (show, index) {
    var slides = show.querySelectorAll('.slide');
    if (slides.length < 2) return;
    var current = 0;
    setTimeout(function () {
      setInterval(function () {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 3500);
    }, index * 1200);
  });

  // =============================================
  // OpenStreetMap (Leaflet)
  // =============================================
  if (typeof L !== 'undefined') {
    var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    var map1 = L.map('map-hoeheinoed', { scrollWheelZoom: false, dragging: !L.Browser.mobile }).setView([49.28975, 7.61295], 9);
    L.tileLayer(tileUrl, { attribution: tileAttr }).addTo(map1);
    L.marker([49.28975, 7.61295]).addTo(map1).bindPopup('<strong>S-BB</strong><br>Auf dem Land 10<br>66989 Höheinöd');

    var map2 = L.map('map-kelsterbach', { scrollWheelZoom: false, dragging: !L.Browser.mobile }).setView([50.06068, 8.52824], 10);
    L.tileLayer(tileUrl, { attribution: tileAttr }).addTo(map2);
    L.marker([50.06068, 8.52824]).addTo(map2).bindPopup('<strong>S-BB</strong><br>Waldstraße 40<br>65451 Kelsterbach');

    var mapObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { map1.invalidateSize(); map2.invalidateSize(); }
      });
    }, { threshold: 0.1 });

    mapObserver.observe(document.getElementById('map-hoeheinoed'));
    mapObserver.observe(document.getElementById('map-kelsterbach'));
  }

})();
