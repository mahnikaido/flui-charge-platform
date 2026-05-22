# Flui Charge Platform

Projeto desenvolvido para a Etapa 2 do **Charge Platform Challenge**.

A proposta da Flui é ajudar motoristas de carros elétricos a encontrar pontos de recarga com mais clareza: disponibilidade, potência, conectores, preço, comodidades e recomendações para evitar filas. O projeto também inclui uma plataforma web para a equipe acompanhar e gerenciar os pontos cadastrados.

## Links

- Site publicado: https://mahnikaido.github.io/flui-charge-platform/
- App mobile: https://mahnikaido.github.io/flui-charge-platform/mobile.html
- Painel administrativo: https://mahnikaido.github.io/flui-charge-platform/admin.html
- Login colaborador: https://mahnikaido.github.io/flui-charge-platform/colaborador.html
- Repositório: https://github.com/mahnikaido/flui-charge-platform

## Entregas

### App mobile para motoristas

Arquivo principal: `mobile.html`

O app mobile possui:

- Login simulado por Google, Apple, biometria ou email.
- Mapa integrado ao Google Maps.
- Marcadores simulados de pontos de recarga.
- Lista de pontos próximos.
- Busca com filtros por conector, potência mínima e comodidades.
- Ficha detalhada do ponto, com endereço, carregadores, potência, horário, preço, conectores e comodidades.
- Link para traçar rota no Google Maps.
- Reserva simulada de conector disponível.
- Perfil do motorista com bateria, autonomia, nível, conquistas, eco score e histórico.
- Tela de ajustes do perfil.
- Modo claro e modo escuro.

### Plataforma web para equipe Flui

Arquivo principal: `admin.html`

O painel administrativo possui:

- Listagem dos pontos de recarga.
- Cadastro de novo ponto.
- Edição de pontos existentes.
- Busca por nome, endereço ou status.
- Indicadores da operação.
- Visualização de avaliações dos motoristas por ponto.

### Tela de colaborador

Arquivo principal: `colaborador.html`

A tela de colaborador apresenta uma visão operacional simulada, com:

- Login de colaborador.
- Pontos próximos.
- Status de bateria e autonomia.
- Recomendação de IA.
- Histórico de recargas.

## Dados simulados

Os dados usados no app e no painel estão no arquivo `data.js`.

Nesta etapa do challenge, ainda não há integração com backend, banco de dados real ou autenticação real. As alterações feitas no painel administrativo funcionam durante a sessão aberta no navegador.

## Como rodar localmente

Na pasta do projeto, rode:

```bash
python3 -m http.server 4173
```

Depois acesse:

- http://localhost:4173/index.html
- http://localhost:4173/mobile.html
- http://localhost:4173/admin.html
- http://localhost:4173/colaborador.html

## Estrutura principal

```text
.
├── index.html          # Site de apresentação
├── mobile.html         # App mobile
├── admin.html          # Painel administrativo
├── colaborador.html    # Login e visão do colaborador
├── data.js             # Dados simulados
├── mobile.js           # Funcionalidades do app
├── admin.js            # Funcionalidades do painel admin
├── site.js             # Interações simples do site/colaborador
├── mobile.css          # Estilos do app
├── styles.css          # Estilos do painel admin
├── landing.css         # Estilos da landing page
├── colaborador.css     # Estilos da página colaborador
└── assets/             # Logos, ícones e imagens
```

## Diferenciais

- Recomendação de IA para apoiar a decisão de recarga.
- Reserva simulada de conector.
- Perfil com gamificação: nível, conquistas e eco score.
- Contribuições simuladas dos motoristas sobre funcionamento e fila.
- Identidade visual unificada entre app, site e painel administrativo.

## Observações para avaliação

O projeto foi publicado como site estático via GitHub Pages. O app mobile é uma interface web responsiva, pensada para uso em tela de celular.

Backend, banco de dados, autenticação real e integração entre app e painel ficam para etapas futuras, conforme permitido no enunciado da Etapa 2.
