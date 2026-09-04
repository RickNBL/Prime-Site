# Prime Terceirizados — site institucional

Site multipágina criado para publicação pública, com conteúdo enxuto e sem informações comerciais inventadas.

## Estrutura

- `index.html` — início
- `servicos.html` — visão geral dos serviços
- `limpeza.html` — limpeza profissional
- `controle-acesso.html` — controle de acesso
- `sobre.html` — apresentação institucional
- `contato.html` — formulário comercial
- `privacidade.html` — uso dos dados do formulário
- `assets/css/` — estilos separados por responsabilidade
- `assets/js/` — JavaScript separado por responsabilidade
- `assets/img/` — logo e ilustrações locais
- `api/contato.php` — envio do formulário no cPanel/PHP
- `config/site.php` — e-mails usados pelo formulário
- `tools/` — utilitários Python para desenvolvimento e validação

## Antes de publicar

Edite `config/site.php` e configure:

```php
const CONTACT_EMAIL = 'comercial@seudominio.com.br';
const FROM_EMAIL = 'site@seudominio.com.br';
```

`FROM_EMAIL` deve preferencialmente existir no mesmo domínio da hospedagem.

## Publicar no cPanel

1. Compacte o conteúdo desta pasta, não a pasta externa.
2. Envie o ZIP para `public_html` no Gerenciador de Arquivos.
3. Extraia os arquivos diretamente em `public_html`.
4. Confirme que `public_html/index.html` existe.
5. Configure `config/site.php`.
6. Ative SSL/HTTPS no domínio.
7. Teste o formulário em `contato.html`.

O formulário usa a função `mail()` do PHP. Algumas hospedagens exigem que o e-mail remetente pertença ao próprio domínio.

## Visualizar localmente

Com Python 3:

```bash
python tools/dev_server.py
```

Abra `http://127.0.0.1:8000`.

> O servidor Python é apenas para visualizar os arquivos estáticos. Ele não executa o endpoint PHP do formulário.

## Verificar caminhos locais

```bash
python tools/check_links.py
```

## Tecnologias

HTML5, CSS3, JavaScript, Bootstrap 5, Bootstrap Icons, PHP e Python 3 para ferramentas de desenvolvimento.
