<div align="center">

# 🧩 Sizebay/Armani CSV Processor — Extensão de Chrome

**A conversão de tabelas de medidas da Armani como extensão do navegador. Roda 100% local, sem servidor, sem upload.**

![Chrome Extension](https://img.shields.io/badge/Manifest_V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

</div>

---

## 📖 Sobre o projeto

Esta é a versão **extensão de Chrome** do [armani-processor](https://github.com/Jlvieira0909/armani-processor). A lógica de transformação é a mesma; a diferença está em onde ela roda.

| | Extensão (aqui) | [Versão web](https://github.com/Jlvieira0909/armani-processor) |
| --- | --- | --- |
| **Onde processa** | No navegador, offline | No servidor (Vercel) |
| **O arquivo sai da máquina?** | ❌ Nunca | ✅ Vai para a API |
| **Precisa instalar?** | ✅ Sim | ❌ Não |
| **Funciona sem internet?** | ✅ Sim | ❌ Não |

Escolha a extensão quando o arquivo não pode sair da máquina ou quando o processamento faz parte da rotina diária. Escolha a versão web para uso pontual, sem instalação.

## 🔄 O que a transformação faz

Converte o CSV bruto da Armani para o formato de importação da Sizebay:

- 🇮🇹 **Traduz medidas do italiano** — `torace` → `chest`, `vita` → `waist`, `bacino` → `hip`, `sottoseno` → `underBust`, entre outras
- 📏 **Separa faixas** — `88 - 92` vira duas colunas (`ini` e `fin`)
- 🔢 **Normaliza números** — trata vírgula decimal, separador de milhar, sufixo `cm` e polegadas
- 👤 **Deduz gênero** a partir do código interno (`B`/`M` → `male`, `G`/`W` → `female`, `J`/`U` → `unisex`)
- 🧒 **Deduz faixa de idade** pelos códigos numéricos (`93`/`96`/`99` → `kids`, `30`/`60`/`90` → `adult`)
- 👟 **Classifica categoria** — `SHOES` no nível 2 da grade → `shoe`, senão `clothes`
- 🚫 **Descarta acessórios** — linhas com `ACC` no `TGL_FILTER_CODE` são puladas

> A descrição detalhada de cada regra está no README do [armani-processor](https://github.com/Jlvieira0909/armani-processor#-o-que-a-transformação-faz).

## ✨ Funcionalidades da extensão

- 🖱️ **Popup de um clique** — abre pelo ícone na barra do Chrome
- 🪟 **Modo aba cheia** — o layout detecta a largura da janela e se adapta; útil para arquivos maiores
- ⬇️ **Download automático** via permissão `downloads`
- 🔒 **Offline por natureza** — nenhuma requisição de rede em nenhum momento
- 🔁 **Hot reload no desenvolvimento** com `npm run watch`

## 🛠️ Stack

| Tecnologia | Versão | Uso |
| ---------- | ------ | --- |
| [Vite](https://vite.dev/) | 7 | Bundler e dev server |
| [React](https://react.dev/) | 19 | Interface do popup |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Tipagem estática |
| [csv-parse](https://csv.js.org/parse/) · [csv-stringify](https://csv.js.org/stringify/) | 6 | Leitura e escrita de CSV |
| [vite-plugin-node-polyfills](https://github.com/davidmyersdev/vite-plugin-node-polyfills) | 0.25 | Polyfills de Node para as libs de CSV no navegador |
| Chrome Extensions | Manifest V3 | Plataforma |

> O polyfill de Node é necessário porque `csv-parse` e `csv-stringify` são feitas para Node. É o que permite rodar exatamente a mesma lógica da versão web dentro do navegador.

## 🚀 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Google Chrome (ou qualquer navegador baseado em Chromium)

### Build

```bash
git clone https://github.com/Jlvieira0909/sizebay-armani-extension.git
cd sizebay-armani-extension
npm install
npm run build
```

O build sai em `dist/`.

### Carregando no Chrome

1. Abra `chrome://extensions`
2. Ative o **Modo do desenvolvedor** (canto superior direito)
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `dist/`

O ícone aparece na barra de extensões. Clique nele para abrir o processador.

### Desenvolvimento

```bash
npm run dev      # dev server do Vite (interface no navegador)
npm run watch    # rebuild automático em dist/ — recarregue a extensão no Chrome
npm run lint     # ESLint
npm run preview  # prévia do build
```

Para iterar na extensão em si, use `npm run watch` e clique em recarregar no `chrome://extensions` após cada mudança.

## 📁 Estrutura

```
sizebay-armani-extension/
├── public/
│   └── manifest.json      # Manifest V3 — popup + permissão de downloads
├── src/
│   ├── App.tsx            # popup: upload, estado, detecção popup/aba
│   ├── processor.ts       # processCsvData() — toda a transformação
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html             # entrada do popup
└── vite.config.ts
```

## 🔐 Permissões

| Permissão | Por quê |
| --------- | ------- |
| `downloads` | Salvar o CSV convertido |

Nenhuma permissão de acesso a sites, aba ativa ou dados de navegação. A extensão não lê nem envia nada além do arquivo que você escolhe.

---
