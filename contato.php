<?php
header('X-Content-Type-Options: nosniff');

function back($status) {
    header('Location: /contato.html?status=' . $status);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /contato.html');
    exit;
}

// Honeypot: bots fill hidden fields, humans don't.
if (!empty($_POST['empresa'])) {
    back('ok');
}

function clean($key) {
    $value = isset($_POST[$key]) ? trim($_POST[$key]) : '';
    $value = str_replace(["\r", "\n"], ' ', $value);
    return substr($value, 0, 2000);
}

$nome     = clean('nome');
$telefone = clean('telefone');
$email    = clean('email');
$assunto  = clean('assunto');
$mensagem = isset($_POST['mensagem']) ? trim($_POST['mensagem']) : '';
$mensagem = substr($mensagem, 0, 5000);

if ($nome === '' || $telefone === '' || $email === '' || $assunto === '' || $mensagem === '') {
    back('faltando');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    back('email-invalido');
}

$to = 'contato@psicologiasupernova.com';
$subject = 'Contato pelo site — ' . $assunto;

$body  = "Nova mensagem recebida pelo formulário de contato do site.\n\n";
$body .= "Nome completo: $nome\n";
$body .= "Telefone: $telefone\n";
$body .= "E-mail: $email\n";
$body .= "Assunto: $assunto\n\n";
$body .= "Mensagem:\n$mensagem\n";

$headers   = [];
$headers[] = 'From: Site Psicologia Supernova <contato@psicologiasupernova.com>';
$headers[] = 'Reply-To: ' . $nome . ' <' . $email . '>';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

back($sent ? 'ok' : 'erro');
