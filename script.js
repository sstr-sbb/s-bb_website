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
  });

  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      menuToggle.classList.remove('open');
      nav.classList.remove('open');
    });
  });

  // =============================================
  // Header scroll + back to top + active nav
  // =============================================
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  // Scroll-driven logo animation: hero logo moves into header
  var heroH1 = document.querySelector('.hero h1');
  var headerLogo = document.querySelector('.logo');
  var heroLogoImg = document.querySelector('.hero-logo');

  // Measure header layout and toggle desktop/mobile nav
  var logoNaturalCenterX = 0;
  var logoText = document.querySelector('.logo-text');
  var logoSuffix = logoText ? logoText.querySelector('.logo-suffix') : null;

  function measureHeader() {
    var prev = headerLogo.style.cssText;
    headerLogo.style.cssText = 'opacity:1; transform:none; pointer-events:none;';

    // Einzelbreiten messen
    var logoImg = headerLogo.querySelector('img');
    var logoGap = parseFloat(getComputedStyle(headerLogo).gap) || 0;
    var imgW = logoImg ? logoImg.offsetWidth : 0;
    var headerRight = header.querySelector('.header-right');
    var containerPad = parseFloat(getComputedStyle(header.querySelector('.header-inner')).paddingLeft) * 2 || 0;
    var totalW = window.innerWidth - containerPad;
    var buffer = 16;

    // Textbreiten messen (unsichtbar, aber im DOM)
    if (logoText) { logoText.style.display = ''; logoText.style.fontSize = ''; }
    if (logoSuffix) logoSuffix.style.display = 'inline';
    var fullTextW = logoText ? logoText.scrollWidth : 0;
    if (logoSuffix) logoSuffix.style.display = 'none';
    var shortTextW = logoText ? logoText.scrollWidth : 0;
    if (logoSuffix) logoSuffix.style.display = 'inline';

    // Nav-Breite messen (im Desktop-Modus)
    header.classList.add('desktop-nav');
    var navW = nav.scrollWidth;

    // Desktop: Logo + Text + Nav <= Fensterbreite?
    var logoBase = imgW + logoGap;
    var desktopLevel = -1;
    if (logoBase + fullTextW + navW + buffer <= totalW) desktopLevel = 0;
    else if (logoBase + shortTextW + navW + buffer <= totalW) desktopLevel = 1;
    else if (logoBase + navW + buffer <= totalW) desktopLevel = 2;

    if (desktopLevel >= 0) {
      // Desktop-Modus
      nav.classList.remove('open');
      menuToggle.classList.remove('open');
      if (logoText) logoText.style.display = desktopLevel < 2 ? '' : 'none';
      if (logoSuffix) logoSuffix.style.display = desktopLevel === 0 ? 'inline' : 'none';
    } else {
      // Burger-Modus
      header.classList.remove('desktop-nav');
      var rightW = headerRight ? headerRight.offsetWidth : 0;
      var available = totalW - rightW - logoBase - buffer;

      if (fullTextW <= available) {
        if (logoText) logoText.style.display = '';
        if (logoSuffix) logoSuffix.style.display = 'inline';
      } else if (shortTextW <= available) {
        if (logoText) logoText.style.display = '';
        if (logoSuffix) logoSuffix.style.display = 'none';
      } else {
        if (logoText) logoText.style.display = 'none';
      }
    }

    // Logo-Position messen (für Scroll-Animation)
    var rect = headerLogo.getBoundingClientRect();
    logoNaturalCenterX = rect.left + rect.width / 2;

    headerLogo.style.cssText = prev;
  }
  measureHeader();
  window.addEventListener('resize', measureHeader);

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    var headerH = header.offsetHeight;

    // Hero h1 position
    var heroH1Rect = heroH1.getBoundingClientRect();
    var heroH1AbsTop = heroH1Rect.top + scrollY;
    var heroH1CenterY = heroH1Rect.top + heroH1Rect.height / 2;

    // Animation: startet 250px bevor Hero-Logo den Header erreicht
    var animEnd = heroH1AbsTop - headerH;
    var animStart = Math.max(0, animEnd - 50);
    if (animEnd <= animStart) animEnd = animStart + 1;

    var t = Math.max(0, Math.min(1, (scrollY - animStart) / (animEnd - animStart)));
    // Ease-in-out
    var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Header-Hintergrund erst einblenden wenn Logo-Animation fertig ist
    header.classList.toggle('scrolled', t >= 1);

    if (t <= 0) {
      headerLogo.style.opacity = '0';
      headerLogo.style.pointerEvents = 'none';
      headerLogo.style.transform = '';
      heroH1.style.opacity = '';
      heroH1.style.visibility = '';
    } else {
      // Crossfade (in ersten 20% der Animation)
      var swap = Math.min(1, t / 0.2);
      heroH1.style.opacity = String(1 - swap);
      heroH1.style.visibility = swap >= 1 ? 'hidden' : '';
      headerLogo.style.opacity = String(swap);
      headerLogo.style.pointerEvents = swap >= 1 ? 'auto' : 'none';

      // Scale: max 1.3x um Menü nicht zu überdecken
      var maxScale = 1.3;
      var currentScale = maxScale + (1 - maxScale) * e;

      // Horizontal: Bildschirmmitte → Header-Logo-Position
      var viewportCenterX = window.innerWidth / 2;
      var offsetX = (viewportCenterX - logoNaturalCenterX) * (1 - e);

      // Vertikal: Hero-H1-Position → Header-Mitte (folgt dem Hero-Logo)
      var headerCenterY = headerH / 2;
      var offsetY = (heroH1CenterY - headerCenterY) * (1 - e);

      headerLogo.style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px) scale(' + currentScale + ')';
    }

    backToTop.classList.toggle('visible', scrollY > 500);

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
  document.getElementById('impressum-btn').addEventListener('click', function (e) {
    e.preventDefault();
    openModal(
      '<h2>Impressum</h2>' +
      '<p><strong>Angaben gemäß § 5 DDG:</strong><br>S-BB Baustoffprüfung GmbH</p>' +
      '<p><strong>Hauptsitz:</strong><br>Auf dem Land 10<br>66989 Höheinöd</p>' +
      '<p><strong>Niederlassung Kelsterbach:</strong><br>Waldstraße 40<br>65451 Kelsterbach</p>' +
      '<p><strong>Vertreten durch:</strong><br>Dipl.-Wirtsch.-Ing. (FH) Christian Stracke<br>Dipl.-Ing. (BA) Steffen Stracke</p>' +
      '<p><strong>Kontakt:</strong><br>Telefon: 06333 2754830<br>Telefax: 06333 27548320<br>E-Mail: info@s-bb.de</p>' +
      '<p><strong>Registereintrag:</strong><br>Eintragung im Handelsregister<br>Registergericht: Zweibrücken<br>Registernummer: HRB 3174</p>' +
      '<p><strong>Umsatzsteuer:</strong><br>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: DE315492461</p>' +
      '<h3>Streitschlichtung</h3>' +
      '<p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>' +
      '<h3>Haftung für Inhalte</h3>' +
      '<p>Als Diensteanbieter sind wir gemäß § 7 Abs.\u00a01 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>'
    );
  });

  // Datenschutz
  var datenschutzHTML =
    '<h2>Datenschutzerklärung</h2>' +

    '<h3>1. Verantwortlicher</h3>' +
    '<p>S-BB Baustoffprüfung GmbH<br>Auf dem Land 10<br>66989 Höheinöd<br>Telefon: 06333 2754830<br>E-Mail: info@s-bb.de</p>' +

    '<h3>2. Allgemeines zur Datenverarbeitung</h3>' +
    '<p>Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung personenbezogener Daten erfolgt regelmäßig nur nach Einwilligung des Nutzers. Eine Ausnahme gilt in solchen Fällen, in denen eine vorherige Einholung einer Einwilligung aus tatsächlichen Gründen nicht möglich ist und die Verarbeitung der Daten durch gesetzliche Vorschriften gestattet ist.</p>' +

    '<h3>3. Rechtsgrundlagen</h3>' +
    '<p>Soweit wir für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung einholen, dient Art.\u00a06 Abs.\u00a01 lit.\u00a0a DSGVO als Rechtsgrundlage.</p>' +
    '<p>Soweit eine Verarbeitung personenbezogener Daten zur Erfüllung eines Vertrags erforderlich ist, dient Art.\u00a06 Abs.\u00a01 lit.\u00a0b DSGVO als Rechtsgrundlage.</p>' +
    '<p>Soweit eine Verarbeitung personenbezogener Daten zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist, dient Art.\u00a06 Abs.\u00a01 lit.\u00a0c DSGVO als Rechtsgrundlage.</p>' +
    '<p>Ist die Verarbeitung zur Wahrung eines berechtigten Interesses unseres Unternehmens oder eines Dritten erforderlich und überwiegen die Interessen, Grundrechte und Grundfreiheiten des Betroffenen das erstgenannte Interesse nicht, so dient Art.\u00a06 Abs.\u00a01 lit.\u00a0f DSGVO als Rechtsgrundlage.</p>' +

    '<h3>4. Server-Log-Dateien</h3>' +
    '<p>Der Hosting-Provider unserer Website erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Dies sind:</p>' +
    '<ul>' +
    '<li>Browsertyp und Browserversion</li>' +
    '<li>Verwendetes Betriebssystem</li>' +
    '<li>Referrer URL</li>' +
    '<li>Hostname des zugreifenden Rechners</li>' +
    '<li>IP-Adresse</li>' +
    '<li>Uhrzeit der Serveranfrage</li>' +
    '</ul>' +
    '<p>Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art.\u00a06 Abs.\u00a01 lit.\u00a0f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Sicherheit seiner Website.</p>' +

    '<h3>5. SSL-/TLS-Verschlüsselung</h3>' +
    '<p>Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.</p>' +

    '<h3>6. Kontaktformular</h3>' +
    '<p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular (Vorname, Nachname, Firma, E-Mail-Adresse, Telefonnummer, Nachricht) zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>' +
    '<p>Die Verarbeitung der in das Kontaktformular eingegebenen Daten erfolgt auf Grundlage Ihrer Einwilligung (Art.\u00a06 Abs.\u00a01 lit.\u00a0a DSGVO). Sie können diese Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns.</p>' +
    '<p>Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt. In der Regel löschen wir Ihre Kontaktanfrage spätestens 6\u00a0Monate nach abschließender Bearbeitung, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Zwingende gesetzliche Bestimmungen – insbesondere handels- und steuerrechtliche Aufbewahrungsfristen von bis zu 10\u00a0Jahren (§\u00a0257 HGB, §\u00a0147 AO) – bleiben unberührt.</p>' +

    '<h3>7. Kontaktaufnahme per E-Mail oder Telefon</h3>' +
    '<p>Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art.\u00a06 Abs.\u00a01 lit.\u00a0b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse (Art.\u00a06 Abs.\u00a01 lit.\u00a0f DSGVO).</p>' +

    '<h3>8. Kartendarstellung</h3>' +
    '<p>Unsere Website zeigt statische Kartenbilder zur Darstellung unserer Standorte. Die Kartenbilder basieren auf Kartendaten von OpenStreetMap (\u00a9 OpenStreetMap-Mitwirkende, Lizenz: ODbL). Die Bilder sind lokal auf unserem Server gespeichert. Beim Aufruf unserer Website wird keine Verbindung zu Servern der OpenStreetMap Foundation hergestellt.</p>' +

    '<h3>9. Externe Links und Routenplanung</h3>' +
    '<p>Unsere Website enthält Links zu externen Websites Dritter (z.\u00a0B. Verbände und Partner). Beim Anklicken dieser Links werden Sie auf die Seiten der jeweiligen Anbieter weitergeleitet. Erst beim Anklicken werden Daten an den jeweiligen Anbieter übertragen. Informationen zum Umgang mit Ihren Daten entnehmen Sie bitte den Datenschutzerklärungen der jeweiligen Anbieter.</p>' +
    '<p><strong>Routenplanung über GraphHopper Maps:</strong> Auf Desktop-Geräten öffnen die Standort-Links unserer Büros den externen Dienst GraphHopper Maps (graphhopper.com/maps) zur Routenplanung. Auf Mobilgeräten wird stattdessen die geräteeigene Navigations-App aufgerufen. Bei Nutzung von GraphHopper Maps werden Ihre IP-Adresse sowie Start- und Zieladresse an die GraphHopper GmbH, Arnulfstraße\u00a060, 80335 München übertragen. Es gelten die Datenschutzbestimmungen von GraphHopper: <a href="https://www.graphhopper.com/privacy/" target="_blank" rel="noopener">https://www.graphhopper.com/privacy/</a>. Die Datenübertragung erfolgt erst durch Ihren aktiven Klick auf den jeweiligen Standort-Link (Rechtsgrundlage: Art.\u00a06 Abs.\u00a01 lit.\u00a0a DSGVO).</p>' +

    '<h3>10. Social-Media-Verlinkung</h3>' +
    '<p>Unsere Website enthält einen Link zu unserem Instagram-Profil. Es handelt sich um einen einfachen Hyperlink; beim Aufruf unserer Website werden keine Daten an Meta Platforms Ireland Limited übertragen. Erst wenn Sie den Link anklicken, werden Sie auf die Instagram-Website weitergeleitet, und es gelten die Datenschutzbestimmungen von Meta Platforms Ireland Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. Informationen zur Datenverarbeitung durch Instagram finden Sie unter: <a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noopener">https://privacycenter.instagram.com/policy</a></p>' +

    '<h3>11. Cookies</h3>' +
    '<p>Unsere Website verwendet keine Cookies zu Tracking- oder Analysezwecken. Beim Absenden des Kontaktformulars kann serverseitig ein technisch notwendiges Session-Cookie gesetzt werden, das nach Ende der Sitzung automatisch gelöscht wird. Rechtsgrundlage ist Art.\u00a06 Abs.\u00a01 lit.\u00a0f DSGVO.</p>' +

    '<h3>12. Ihre Rechte als betroffene Person</h3>' +
    '<p>Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>' +
    '<ul>' +
    '<li><strong>Recht auf Auskunft</strong> (Art.\u00a015 DSGVO): Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.</li>' +
    '<li><strong>Recht auf Berichtigung</strong> (Art.\u00a016 DSGVO): Sie können die Berichtigung unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten Daten verlangen.</li>' +
    '<li><strong>Recht auf Löschung</strong> (Art.\u00a017 DSGVO): Sie können die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten verlangen, soweit nicht die Verarbeitung zur Ausübung des Rechts auf freie Meinungsäußerung, zur Erfüllung einer rechtlichen Verpflichtung, aus Gründen des öffentlichen Interesses oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.</li>' +
    '<li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art.\u00a018 DSGVO): Sie können die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten verlangen.</li>' +
    '<li><strong>Recht auf Datenübertragbarkeit</strong> (Art.\u00a020 DSGVO): Sie können verlangen, dass wir Ihnen Ihre personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format übermitteln.</li>' +
    '<li><strong>Recht auf Widerspruch</strong> (Art.\u00a021 DSGVO): Sie können der Verarbeitung Ihrer personenbezogenen Daten jederzeit widersprechen, sofern die Verarbeitung auf Art.\u00a06 Abs.\u00a01 lit.\u00a0e oder f DSGVO beruht.</li>' +
    '<li><strong>Recht auf Widerruf der Einwilligung</strong> (Art.\u00a07 Abs.\u00a03 DSGVO): Sie können eine einmal erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung wird dadurch nicht berührt.</li>' +
    '</ul>' +

    '<h3>13. Beschwerderecht bei einer Aufsichtsbehörde</h3>' +
    '<p>Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DSGVO verstößt.</p>' +
    '<p>Die für uns zuständige Aufsichtsbehörde ist:<br>Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz<br>Postfach 30 40<br>55020 Mainz<br>Telefon: 06131 208-2449<br>E-Mail: poststelle@datenschutz.rlp.de<br>Website: <a href="https://www.datenschutz.rlp.de" target="_blank" rel="noopener">www.datenschutz.rlp.de</a></p>' +

    '<h3>14. Änderung dieser Datenschutzerklärung</h3>' +
    '<p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.</p>';

  document.getElementById('datenschutz-btn').addEventListener('click', function (e) { e.preventDefault(); openModal(datenschutzHTML); });
  document.getElementById('datenschutz-link').addEventListener('click', function (e) { e.preventDefault(); openModal(datenschutzHTML); });

  // AGB
  var agbHTML =
    '<h2>Allgemeine Geschäftsbedingungen (AGB)</h2>' +
    '<h3>1. Geltungsbereich</h3>' +
    '<p>Diese allgemeinen Geschäftsbedingungen sind Bestandteil jedes zwischen der S-BB Baustoffprüfung GmbH und deren Auftraggeber (AG) geschlossenen Vertrages. Anderslautende mündliche Vereinbarungen oder sonstige Abweichungen, insbesondere anders lautende Bedingungen des Auftraggebers, gelten nur dann, wenn sie von der S-BB Baustoffprüfung GmbH schriftlich bestätigt sind.</p>' +
    '<h3>2. Leistungsumfang</h3>' +
    '<p>Die S-BB Baustoffprüfung GmbH erbringt Ingenieurleistungen auf dem Gebiet des Hoch-, Tief- und Straßenbaus und untersucht Baustoffproben nach den in Normen, Lieferbedingungen und sonstigen maßgebenden Bestimmungen festgesetzten Verfahren. In der Regel enthalten die Leistungen die Erstellung eines Berichtes, der eine Zusammenstellung der Messergebnisse und eine kurze Beurteilung beinhaltet. Ingenieurleistungen (z.\u00a0B. Gutachten, Stellungnahmen u.\u00a0a.) werden nach Aufwand abgerechnet. Ist seitens des Auftraggebers der genaue Umfang einer Untersuchung bei Eintreffen der Probe nicht eindeutig vereinbart, werden die Untersuchungen entsprechend den hierfür gültigen Normen, Lieferbedingungen oder sonstigen maßgebenden Bestimmungen durchgeführt.</p>' +
    '<p>Proben, die bei der Untersuchung nicht restlos verbraucht wurden, werden, sofern von Seiten des Auftraggebers keine besonderen Angaben zur Aufbewahrungszeit erfolgten, nach Erstellung des Prüfberichts entsorgt.</p>' +
    '<p>Ergebnisse von Fremdlaboratorien werden im Prüfbericht kenntlich gemacht, Prüfberichte und Rechnungen digital ausgefertigt und per E-Mail versandt. Für Mehrausfertigungen in Papierform fallen Gebühren an.</p>' +
    '<h3>3. Vervielfältigungen</h3>' +
    '<p>Prüfberichte und Gutachten dürfen nur ungekürzt weitergegeben werden. Jede auszugsweise Vervielfältigung, jede Weitergabe eines Auszuges sowie jede Veröffentlichung bedarf der vorherigen, ausdrücklichen und schriftlichen Genehmigung der S-BB Baustoffprüfung GmbH.</p>' +
    '<h3>4. Vergütung</h3>' +
    '<p>Für bestimmte, häufig wiederkehrende Leistungen werden feste Gebührensätze nach der jeweils gültigen Gebührenordnung erhoben. Für Fahrtzeiten, Probenahmen und Ortsbesichtigungen wird der Zeitaufwand in Rechnung gestellt. Ferner werden Fahrtkosten sowie Barauslagen, Reisekosten und Spesen etc. verrechnet. Sofern Überstunden, Nacht-, Samstags-, Sonntags- oder Feiertagsarbeit gefordert werden, erhöhen sich die Gebühren um 100\u00a0%. Die jeweils gültige Gebührenordnung/Leistungskatalog ist Vertragsgrundlage. Sie wird dem Auftraggeber auf Wunsch zugesandt.</p>' +
    '<h3>5. Zahlung</h3>' +
    '<p>Rechnungen von der S-BB Baustoffprüfung GmbH sind 10 Tage nach Erhalt ohne Abzug zur Zahlung fällig. Beanstandungen gegen die Rechnung sind nur rechtswirksam, wenn sie innerhalb von 10 Tagen nach Zugang der Rechnung schriftlich bei der S-BB Baustoffprüfung GmbH geltend gemacht werden.</p>' +
    '<p>Kommt der Auftraggeber in Verzug, ist die S-BB Baustoffprüfung GmbH berechtigt Verzugszinsen in Höhe von 9\u00a0% über dem Basiszinssatz, mindestens aber in Höhe von 6\u00a0% des Rechnungsbetrages und den Ersatz des sonstigen nachweisbaren Verzugsschadens zu berechnen.</p>' +
    '<p>Aufrechnungswerte stehen dem Auftraggeber nur zu, wenn seine Gegenansprüche rechtskräftig festgestellt, unbestritten oder von der S-BB Baustoffprüfung GmbH anerkannt sind.</p>' +
    '<h3>6. Haftung</h3>' +
    '<p>Die Haftung der S-BB Baustoffprüfung GmbH, seiner Organe und Angestellten ist beschränkt auf vorsätzliche und grob fahrlässige Verletzungen der Sorgfaltspflicht. Dies gilt nicht für Schäden, die auf einer Verletzung von Leben, Körper oder Gesundheit sowie einer Verletzung wesentlicher Vertragspflichten beruhen. Die Haftung ist außerdem beschränkt auf den Ersatz des unmittelbaren Schadens und wird summenmäßig begrenzt durch die jeweilige Deckungssumme der von der S-BB Baustoffprüfung GmbH genommenen Betriebshaftpflichtversicherung.</p>' +
    '<p>Für mündliche Auskünfte wird keine Haftung übernommen.</p>' +
    '<p>Die Haftung ist ausgeschlossen für Ansprüche bei Schäden und Mängeln, die bei der Entnahme von Materialproben an Bauwerken, Bauwerksteilen oder sonstigen Sachen entstehen. Der Ausschluss gilt auch für Vermögensfolgeschäden.</p>' +
    '<p>Für Ersatzansprüche Dritter haftet die S-BB Baustoffprüfung GmbH in keinem Fall. Die Auftraggeber stellen die S-BB Baustoffprüfung GmbH von solchen Ansprüchen ausdrücklich frei. Für die Echtheit von Proben wird nur gehaftet, wenn die Proben seitens der S-BB Baustoffprüfung GmbH entnommen worden sind.</p>' +
    '<p>Das Betretungsrecht für die Durchführung von Felduntersuchungen ist durch den Auftraggeber zu erwirken. Ebenso ist durch ihn die Lage von Kabel- und Versorgungsleitungen festzustellen und anzugeben bzw. ein Lageplan mit eingetragenen Kabel- und Versorgungsleitungen zu übergeben. Unterbleibt die rechtzeitige, richtige und vollständige Beschaffung bzw. Bekanntgabe, sind der S-BB Baustoffprüfung GmbH alle daraus anfallenden Kosten zu erstatten.</p>' +
    '<p>Ebenso sind unvermeidbare Flurschäden vom Auftraggeber zu übernehmen.</p>' +
    '<h3>7. Verjährung</h3>' +
    '<p>Haftungsansprüche gegen die S-BB Baustoffprüfung GmbH einschließlich Ansprüche auf Schadensersatz mit Ausnahme deliktischer Ansprüche und Ansprüchen nach dem Produkthaftungsgesetz verjähren innerhalb eines Jahres ab Anlieferung/Abnahme.</p>' +
    '<h3>8. Gerichtsstand und Erfüllungsort</h3>' +
    '<p>Die Rechtsbeziehungen zwischen der S-BB Baustoffprüfung GmbH und dem Auftraggeber unterliegen deutschem Recht.</p>' +
    '<p>Für den Fall, dass die im Klageweg in Anspruch zu nehmende Partei nach Vertragsabschluss ihren Wohnsitz oder gewöhnlichen Aufenthaltsort aus dem Geltungsbereich der ZPO verlegt oder mindestens eine der Vertragsparteien keinen allgemeinen Gerichtsstand im Inland hat oder Ansprüche im Wege des Mahnverfahrens (§§\u00a0688\u00a0ff ZPO) geltend gemacht werden, wird Zweibrücken als Gerichtsstand vereinbart. Zweibrücken wird auch im Sinne des §§\u00a038 Abs.\u00a01 ZPO als Gerichtsstand und Erfüllungsort vereinbart.</p>';

  document.getElementById('agb-btn').addEventListener('click', function (e) { e.preventDefault(); openModal(agbHTML); });

  // =============================================
  // Contact Form – CSRF Token & AJAX Submit
  // =============================================
  var form = document.getElementById('contact-form');
  var statusDiv = document.createElement('div');
  statusDiv.className = 'form-status';
  form.parentNode.insertBefore(statusDiv, form);

  // CSRF-Token beim Laden holen
  fetch('csrf_token.php')
    .then(function (r) { return r.json(); })
    .then(function (d) { document.getElementById('csrf_token').value = d.token; })
    .catch(function () {});

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
          if (result.data.new_token) { document.getElementById('csrf_token').value = result.data.new_token; }
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
  // Map Navigation Links (native app on mobile)
  // =============================================
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    document.querySelectorAll('.map-nav-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var address = this.getAttribute('data-address');
        var encoded = encodeURIComponent(address);
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.href = 'maps:?q=' + encoded;
        } else {
          window.location.href = 'geo:0,0?q=' + encoded;
        }
      });
    });
  }

  // =============================================
  // External Link Confirmation Dialog
  // =============================================
  var extDialog = document.getElementById('ext-dialog');
  var extConfirm = document.getElementById('ext-confirm');
  var extCancel = document.getElementById('ext-cancel');

  var extHost = document.getElementById('ext-host');

  document.addEventListener('click', function (e) {
    if (e.target.closest('#ext-confirm')) return;
    var link = e.target.closest('a[target="_blank"]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    var url;
    try {
      url = new URL(href, window.location.origin);
      if (url.hostname === window.location.hostname) return;
    } catch (_) { return; }
    if (link.classList.contains('map-nav-link') && isMobile) return;
    e.preventDefault();
    extConfirm.href = href;
    extHost.textContent = url.hostname.replace(/^www\./, '');
    extDialog.classList.add('open');
  });

  extCancel.addEventListener('click', function () {
    extDialog.classList.remove('open');
  });

  extConfirm.addEventListener('click', function () {
    extDialog.classList.remove('open');
  });

  extDialog.addEventListener('click', function (e) {
    if (e.target === extDialog) extDialog.classList.remove('open');
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

})();
