# Flui Charge Platform

Protótipo funcional para a Etapa 2 do Charge Platform Challenge, com duas entregas independentes:

- Site de apresentação e navegação: `index.html`
- App mobile para motoristas: `mobile.html`
- Plataforma web administrativa para equipe Flui: `admin.html`

## Funcionalidades

### App mobile

- Mapa integrado ao Google Maps com marcadores simulados de pontos de recarga.
- Primeira tela de login com opções Google, Apple, Face ID/Touch ID e login por email.
- Navegação principal com três telas: Mapa, Buscar e Perfil.
- Filtros funcionais por conector, potência mínima e comodidades.
- Ficha detalhada com carregadores, conectores, potência, horário, fila, comodidades e rota externa no mapa.
- Reserva simulada de conector disponível, com feedback visual no app.
- Interface responsiva inspirada no protótipo do Figma.

### Plataforma web

- Painel administrativo com listagem de pontos de recarga.
- Cadastro e edição local de pontos com dados simulados.
- Busca por nome, endereço ou status.
- Visualização de avaliações dos motoristas por ponto.
- Indicadores de operação e layout responsivo.

## Como rodar localmente

```bash
python3 -m http.server 4173
```

Depois acesse:

- `http://localhost:4173/`
- `http://localhost:4173/mobile.html`
- `http://localhost:4173/admin.html`

## Deploy

Por ser um projeto estático, ele pode ser publicado diretamente no GitHub Pages, Netlify ou Vercel.
Veja também o passo a passo em `DEPLOY.md`.

No GitHub Pages:

1. Crie um repositório público.
2. Envie todos os arquivos deste diretório para a branch `main`.
3. Em `Settings > Pages`, selecione `Deploy from a branch`.
4. Escolha `main` e a pasta `/root`.
5. Use os links publicados para preencher o PDF de entrega.

## Observações

- Não há backend, banco de dados real, autenticação ou integração entre app e web, conforme permitido na etapa.
- Os dados são simulados no arquivo `data.js`.
- O painel administrativo mantém alterações apenas durante a sessão aberta no navegador.
