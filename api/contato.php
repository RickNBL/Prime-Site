<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$configFile = dirname(__DIR__) . '/config/site.php';
if (!is_file($configFile)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'O formulário ainda não foi configurado no servidor.'], JSON_UNESCAPED_UNICODE);
    exit;
}
require $configFile;

function field(string $name, int $max = 2500): string {
    $value = trim((string)($_POST[$name] ?? ''));
    $value = str_replace(["\r\0", "\n\0", "\0"], '', $value);
    if (mb_strlen($value, 'UTF-8') > $max) {
        $value = mb_substr($value, 0, $max, 'UTF-8');
    }
    return $value;
}

function respond(int $status, bool $ok, string $message): never {
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

// Campo-isca para reduzir envios automatizados. Bots recebem sucesso sem processar o conteúdo.
if (field('website', 200) !== '') {
    respond(200, true, 'Solicitação recebida.');
}

$nome = field('nome', 80);
$empresa = field('empresa', 120);
$email = field('email', 160);
$telefone = field('telefone', 30);
$servico = field('servico', 80);
$mensagem = field('mensagem', 2500);
$privacidade = field('privacidade', 2);

if (mb_strlen($nome, 'UTF-8') < 2 || $servico === '' || mb_strlen($mensagem, 'UTF-8') < 10) {
    respond(422, false, 'Preencha os campos obrigatórios corretamente.');
}

if ($email === '' && $telefone === '') {
    respond(422, false, 'Informe ao menos um meio de contato: e-mail ou telefone.');
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Informe um e-mail válido.');
}

if ($privacidade !== '1') {
    respond(422, false, 'É necessário aceitar a política de privacidade.');
}

$allowedServices = ['Limpeza profissional', 'Controle de acesso', 'Limpeza e controle de acesso'];
if (!in_array($servico, $allowedServices, true)) {
    respond(422, false, 'Selecione um serviço válido.');
}

$to = defined('CONTACT_EMAIL') ? trim((string)CONTACT_EMAIL) : '';
$from = defined('FROM_EMAIL') ? trim((string)FROM_EMAIL) : '';
$siteName = defined('SITE_NAME') ? trim((string)SITE_NAME) : 'Prime Terceirizados';

if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
    respond(503, false, 'O formulário ainda não foi configurado no servidor.');
}

$safeName = preg_replace('/[\r\n]+/', ' ', $nome) ?: 'Contato do site';
$subject = 'Nova solicitação - ' . $servico;
$lines = [
    'Nova solicitação recebida pelo site.',
    '',
    'Nome: ' . $nome,
    'Empresa / condomínio: ' . ($empresa !== '' ? $empresa : 'Não informado'),
    'E-mail: ' . ($email !== '' ? $email : 'Não informado'),
    'Telefone: ' . ($telefone !== '' ? $telefone : 'Não informado'),
    'Serviço: ' . $servico,
    '',
    'Mensagem:',
    $mensagem,
    '',
    'Enviado em: ' . date('d/m/Y H:i:s'),
];
$body = implode("\r\n", $lines);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $siteName . ' <' . $from . '>',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $safeName . ' <' . $email . '>';
}

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$sent = @mail($to, $encodedSubject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(500, false, 'Não foi possível enviar sua solicitação agora. Tente novamente mais tarde.');
}

respond(200, true, 'Solicitação enviada. A equipe comercial poderá retornar pelo canal informado.');
