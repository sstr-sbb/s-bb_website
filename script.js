// S-BB Baustoffprüfung GmbH – Script
(function () {
  'use strict';

  // Mobile menu toggle
  var menuToggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');

  menuToggle.addEventListener('click', function () {
    this.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      menuToggle.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Header scroll effect
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY > 50;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Active nav link on scroll
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 100;
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
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Modal system
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
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Impressum
  document.getElementById('impressum-btn').addEventListener('click', function () {
    openModal(
      '<h2>Impressum</h2>' +
      '<p><strong>Angaben gemäß § 5 TMG:</strong><br>S-BB Baustoffprüfung GmbH<br>Auf dem Land 10<br>66989 Höheinöd</p>' +
      '<p><strong>Vertreten durch:</strong><br>Dipl.-Wirtsch.-Ing. (FH) Christian Stracke<br>Dipl.-Ing. (BA) Steffen Stracke</p>' +
      '<p><strong>Kontakt:</strong><br>Telefon: 06333 2754830<br>Telefax: 06333 27548320<br>E-Mail: stracke@s-bb.de</p>' +
      '<p><strong>Registereintrag:</strong><br>Eintragung im Handelsregister<br>Registergericht: Zweibrücken<br>Registernummer: 3174</p>' +
      '<p><strong>Umsatzsteuer:</strong><br>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: DE315492461</p>' +
      '<h3>Streitschlichtung</h3>' +
      '<p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>' +
      '<h3>Haftung für Inhalte</h3>' +
      '<p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>'
    );
  });

  // Datenschutz
  var datenschutzHTML =
    '<h2>Datenschutzerklärung</h2>' +
    '<h3>1. Datenschutz auf einen Blick</h3>' +
    '<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>' +
    '<h3>Datenerfassung auf unserer Website</h3>' +
    '<p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>' +
    '<p><strong>Wie erfassen wir Ihre Daten?</strong><br>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.</p>' +
    '<h3>2. Allgemeine Hinweise und Pflichtinformationen</h3>' +
    '<p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>' +
    '<h3>Verantwortliche Stelle</h3>' +
    '<p>S-BB Baustoffprüfung GmbH<br>Auf dem Land 10<br>66989 Höheinöd<br>Telefon: 06333-2754830<br>E-Mail: stracke@s-bb.de</p>' +
    '<h3>3. Datenschutzbeauftragter</h3>' +
    '<p>Youdat Gunnar Schwarz und Torsten Becker GbR<br>Herr Torsten Becker<br>Rudolf-Diesel-Straße 2<br>66919 Weselberg<br>Telefon: 06333 602960<br>E-Mail: torsten.becker@youdat.de</p>' +
    '<h3>4. Datenerfassung auf unserer Website</h3>' +
    '<h3>Cookies</h3>' +
    '<p>Die Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren.</p>' +
    '<h3>Kontaktformular</h3>' +
    '<p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>';

  document.getElementById('datenschutz-btn').addEventListener('click', function () {
    openModal(datenschutzHTML);
  });

  document.getElementById('datenschutz-link').addEventListener('click', function (e) {
    e.preventDefault();
    openModal(datenschutzHTML);
  });

  // AGB
  document.getElementById('agb-btn').addEventListener('click', function () {
    openModal(
      '<h2>Allgemeine Geschäftsbedingungen (AGB)</h2>' +
      '<h3>1. Geltungsbereich</h3>' +
      '<p>Diese allgemeinen Geschäftsbedingungen sind Bestandteil jedes zwischen der S-BB Baustoffprüfung GmbH und dem Auftraggeber geschlossenen Vertrages.</p>' +
      '<h3>2. Leistungsumfang</h3>' +
      '<p>Die S-BB Baustoffprüfung GmbH erbringt Ingenieurleistungen auf dem Gebiet des Hoch-, Tief- und Straßenbaus. Proben, die bei der Untersuchung nicht restlos verbraucht wurden, werden – sofern von Seiten des Auftraggebers nicht anders gewünscht – nach Abschluss der Untersuchung entsorgt.</p>' +
      '<h3>3. Vervielfältigungen</h3>' +
      '<p>Prüfberichte und Gutachten dürfen nur ungekürzt weitergegeben werden. Jede auszugsweise Vervielfältigung bedarf der schriftlichen Zustimmung der S-BB Baustoffprüfung GmbH.</p>' +
      '<h3>4. Vergütung</h3>' +
      '<p>Für bestimmte, häufig wiederkehrende Leistungen werden feste Gebührensätze nach der jeweils gültigen Preisliste in Rechnung gestellt.</p>' +
      '<h3>5. Zahlung</h3>' +
      '<p>Rechnungen von der S-BB Baustoffprüfung GmbH sind 10 Tage nach Erhalt ohne Abzug zur Zahlung fällig.</p>' +
      '<h3>6. Haftung</h3>' +
      '<p>Die Haftung der S-BB Baustoffprüfung GmbH, seiner Organe und Angestellten ist beschränkt auf vorsätzliches und grob fahrlässiges Handeln. Für mündliche Auskünfte wird keine Haftung übernommen.</p>' +
      '<h3>7. Verjährung</h3>' +
      '<p>Haftungsansprüche gegen die S-BB Baustoffprüfung GmbH einschließlich Ansprüche auf Schadensersatz müssen innerhalb eines Jahres nach Kenntniserlangung geltend gemacht werden.</p>' +
      '<h3>8. Gerichtsstand und Erfüllungsort</h3>' +
      '<p>Die Rechtsbeziehungen zwischen der S-BB Baustoffprüfung GmbH und dem Auftraggeber unterliegen deutschem Recht.</p>'
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

    // Hide previous status
    statusDiv.className = 'form-status';
    statusDiv.textContent = '';

    // Disable button
    btn.textContent = 'Wird gesendet...';
    btn.disabled = true;

    // Collect form data
    var formData = new FormData(form);

    // Send via fetch
    fetch(form.action, {
      method: 'POST',
      body: formData
    })
    .then(function (response) {
      return response.json().then(function (data) {
        return { ok: response.ok, data: data };
      });
    })
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
      // Fallback: wenn kein PHP-Server vorhanden, per mailto senden
      var vorname = form.querySelector('#vorname').value;
      var nachname = form.querySelector('#nachname').value;
      var firma = form.querySelector('#firma').value;
      var email = form.querySelector('#email').value;
      var telefon = form.querySelector('#telefon').value;
      var nachricht = form.querySelector('#nachricht').value;

      var subject = encodeURIComponent('Kontaktanfrage von ' + vorname + ' ' + nachname);
      var body = encodeURIComponent(
        'Name: ' + vorname + ' ' + nachname + '\n' +
        (firma ? 'Firma: ' + firma + '\n' : '') +
        'E-Mail: ' + email + '\n' +
        'Telefon: ' + telefon + '\n\n' +
        'Nachricht:\n' + nachricht
      );

      window.location.href = 'mailto:info@s-bb.de?subject=' + subject + '&body=' + body;

      statusDiv.className = 'form-status success';
      statusDiv.textContent = 'Ihr E-Mail-Programm wird geöffnet. Bitte senden Sie die E-Mail ab.';
    })
    .finally(function () {
      btn.textContent = originalText;
      btn.disabled = false;
    });
  });

  // =============================================
  // OpenStreetMap (Leaflet)
  // =============================================
  if (typeof L !== 'undefined') {
    var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    // Büro Höheinöd: Auf dem Land 10, 66989 Höheinöd
    var map1 = L.map('map-hoeheinoed', {
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile
    }).setView([49.28975, 7.61295], 9);

    L.tileLayer(tileUrl, { attribution: tileAttr }).addTo(map1);
    L.marker([49.28975, 7.61295])
      .addTo(map1)
      .bindPopup('<strong>S-BB Baustoffprüfung</strong><br>Auf dem Land 10<br>66989 Höheinöd');

    // Büro Kelsterbach: Waldstraße 40, 65451 Kelsterbach
    var map2 = L.map('map-kelsterbach', {
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile
    }).setView([50.06068, 8.52824], 10);

    L.tileLayer(tileUrl, { attribution: tileAttr }).addTo(map2);
    L.marker([50.06068, 8.52824])
      .addTo(map2)
      .bindPopup('<strong>S-BB Baustoffprüfung</strong><br>Waldstraße 40<br>65451 Kelsterbach');

    // Fix Leaflet map rendering when scrolled into view
    var mapObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          map1.invalidateSize();
          map2.invalidateSize();
        }
      });
    }, { threshold: 0.1 });

    mapObserver.observe(document.getElementById('map-hoeheinoed'));
    mapObserver.observe(document.getElementById('map-kelsterbach'));
  }

})();
