<?php
// S-BB Kontaktformular – E-Mail-Versand
// =======================================

header('Content-Type: application/json; charset=utf-8');

// Nur POST erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Methode nicht erlaubt.']);
    exit;
}

// Honeypot-Check (Spam-Schutz)
if (!empty($_POST['website'])) {
    // Bot hat das versteckte Feld ausgefüllt
    echo json_encode(['success' => true, 'message' => 'Nachricht gesendet.']);
    exit;
}

// Pflichtfelder prüfen
$required = ['vorname', 'nachname', 'email', 'telefon', 'nachricht', 'datenschutz'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Bitte füllen Sie alle Pflichtfelder aus.']);
        exit;
    }
}

// Eingaben bereinigen
$vorname   = htmlspecialchars(strip_tags(trim($_POST['vorname'])), ENT_QUOTES, 'UTF-8');
$nachname  = htmlspecialchars(strip_tags(trim($_POST['nachname'])), ENT_QUOTES, 'UTF-8');
$firma     = htmlspecialchars(strip_tags(trim($_POST['firma'] ?? '')), ENT_QUOTES, 'UTF-8');
$email     = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
$telefon   = htmlspecialchars(strip_tags(trim($_POST['telefon'])), ENT_QUOTES, 'UTF-8');
$nachricht = htmlspecialchars(strip_tags(trim($_POST['nachricht'])), ENT_QUOTES, 'UTF-8');

// E-Mail validieren
if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Bitte geben Sie eine gültige E-Mail-Adresse ein.']);
    exit;
}

// Rate-Limiting (einfach, session-basiert)
session_start();
$now = time();
if (isset($_SESSION['last_contact_submit']) && ($now - $_SESSION['last_contact_submit']) < 60) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Bitte warten Sie einen Moment, bevor Sie erneut senden.']);
    exit;
}

// Empfänger
$to = 'info@s-bb.de';

// Betreff
$subject = "Kontaktanfrage von $vorname $nachname";

// E-Mail-Text
$body  = "Neue Kontaktanfrage über die Website\n";
$body .= "=====================================\n\n";
$body .= "Name:      $vorname $nachname\n";
if ($firma) {
    $body .= "Firma:     $firma\n";
}
$body .= "E-Mail:    $email\n";
$body .= "Telefon:   $telefon\n\n";
$body .= "Nachricht:\n";
$body .= "-------------------------------------\n";
$body .= "$nachricht\n";
$body .= "-------------------------------------\n\n";
$body .= "Gesendet am: " . date('d.m.Y H:i') . " Uhr\n";

// Header
$headers  = "From: noreply@s-bb.de\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: S-BB Website Kontaktformular\r\n";

// Senden
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    $_SESSION['last_contact_submit'] = $now;
    echo json_encode(['success' => true, 'message' => 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch.']);
}
