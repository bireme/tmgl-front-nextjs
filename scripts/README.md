# Script de Geração de PDF

Este script converte o arquivo `MAPA_DO_SITE.md` em um PDF formatado e profissional.

## Como usar

### Pré-requisitos

- Node.js instalado
- Dependências do projeto instaladas (`npm install`)

### Executar

```bash
npm run generate-pdf
```

O PDF será gerado na raiz do projeto com o nome `MAPA_DO_SITE.pdf`.

## Funcionalidades

- ✅ Conversão de Markdown para HTML
- ✅ Formatação profissional com CSS
- ✅ Tabelas formatadas
- ✅ Quebras de página automáticas
- ✅ Suporte a código e blocos de código
- ✅ Links e formatação de texto
- ✅ Layout otimizado para impressão

## Personalização

Você pode editar o arquivo `scripts/generate-pdf.js` para:
- Ajustar margens e tamanho da página
- Modificar cores e estilos
- Alterar fonte e tamanhos
- Adicionar cabeçalhos/rodapés personalizados

## Notas

- O script usa Puppeteer para gerar o PDF
- O formato padrão é A4
- As margens padrão são de 2cm em todos os lados

