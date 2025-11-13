const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function generatePDF(inputFile = 'MAPA_DO_SITE.md', outputFile = null) {
  // Se não especificado, tenta inferir o nome do arquivo de saída
  if (!outputFile) {
    if (inputFile === 'TECHNICAL_MANUAL.md') {
      outputFile = 'Technical Manual.pdf';
    } else if (inputFile === 'MAPA_DO_SITE.md') {
      outputFile = 'Technical Site Map.pdf';
    } else {
      outputFile = inputFile.replace('.md', '.pdf');
    }
  }
  
  const markdownPath = path.join(__dirname, '..', inputFile);
  const outputPath = path.join(__dirname, '..', outputFile);
  
  console.log('📖 Lendo arquivo markdown...');
  const markdown = fs.readFileSync(markdownPath, 'utf-8');
  
  console.log('🔄 Convertendo markdown para HTML...');
  // Importar marked dinamicamente (ES Module)
  const { marked } = await import('marked');
  
  // Configurar marked para renderizar tabelas e outras features
  marked.setOptions({
    breaks: true,
    gfm: true
  });
  
  // Converter markdown para HTML usando marked
  let htmlContent = marked.parse(markdown);
  
  // Preservar page breaks
  htmlContent = htmlContent.replace(/<div style="page-break-after: always;"><\/div>/gim, '<div style="page-break-after: always;"></div>');
  
  // Remover page breaks no início do documento (primeira página em branco)
  // Remove qualquer div de page-break que apareça no início do HTML
  htmlContent = htmlContent.trim();
  htmlContent = htmlContent.replace(/^(<div[^>]*page-break[^>]*><\/div>\s*)+/gim, '');
  
  // Também remove se o marked converter para <p> com o div dentro
  htmlContent = htmlContent.replace(/^(<p><div[^>]*page-break[^>]*><\/div><\/p>\s*)+/gim, '');
  
  // Determinar título baseado no arquivo
  let documentTitle = 'TMGL Document';
  if (inputFile === 'TECHNICAL_MANUAL.md') {
    documentTitle = 'Technical Manual - TMGL';
  } else if (inputFile === 'MAPA_DO_SITE.md') {
    documentTitle = 'Technical Site Map - TMGL';
  }
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    
    h1 {
      font-size: 24pt;
      margin: 20pt 0 15pt 0;
      color: #1a1a1a;
      border-bottom: 3px solid #0066cc;
      padding-bottom: 10pt;
      page-break-after: avoid;
    }
    
    h2 {
      font-size: 18pt;
      margin: 18pt 0 12pt 0;
      color: #2a2a2a;
      border-bottom: 2px solid #0066cc;
      padding-bottom: 8pt;
      page-break-after: avoid;
    }
    
    h3 {
      font-size: 14pt;
      margin: 15pt 0 10pt 0;
      color: #3a3a3a;
      page-break-after: avoid;
    }
    
    h4 {
      font-size: 12pt;
      margin: 12pt 0 8pt 0;
      color: #4a4a4a;
      page-break-after: avoid;
    }
    
    p {
      margin: 8pt 0;
      text-align: justify;
    }
    
    ul, ol {
      margin: 10pt 0 10pt 20pt;
    }
    
    li {
      margin: 5pt 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15pt 0;
      page-break-inside: avoid;
      font-size: 10pt;
    }
    
    thead {
      background-color: #0066cc;
      color: white;
    }
    
    th {
      background-color: #0066cc;
      color: white;
      padding: 10pt 8pt;
      text-align: left;
      font-weight: bold;
      border: 1px solid #0052a3;
    }
    
    td {
      padding: 8pt;
      border: 1px solid #ddd;
      vertical-align: top;
    }
    
    tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    tbody tr:hover {
      background-color: #f0f0f0;
    }
    
    code {
      background-color: #f4f4f4;
      padding: 2pt 4pt;
      border-radius: 3pt;
      font-family: 'Courier New', monospace;
      font-size: 10pt;
    }
    
    pre {
      background-color: #f4f4f4;
      padding: 10pt;
      border-radius: 5pt;
      overflow-x: auto;
      margin: 10pt 0;
      page-break-inside: avoid;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
    }
    
    a {
      color: #0066cc;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 20pt 0;
    }
    
    .page-break {
      page-break-after: always;
    }
    
    blockquote {
      border-left: 4px solid #0066cc;
      padding-left: 15pt;
      margin: 10pt 0;
      color: #666;
      font-style: italic;
    }
    
    img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
    }
    
    strong {
      font-weight: bold;
      color: #1a1a1a;
    }
    
    em {
      font-style: italic;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      h1, h2, h3, h4 {
        page-break-after: avoid;
      }
      
      table {
        page-break-inside: avoid;
      }
      
      pre {
        page-break-inside: avoid;
      }
      
      ul, ol {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `;
  
  console.log('🌐 Iniciando navegador...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  console.log('📄 Carregando conteúdo...');
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  console.log('📑 Gerando PDF...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    margin: {
      top: '2cm',
      right: '2cm',
      bottom: '2cm',
      left: '2cm'
    },
    printBackground: true,
    preferCSSPageSize: true
  });
  
  await browser.close();
  
  console.log(`✅ PDF gerado com sucesso: ${outputPath}`);
}

// Executar - aceita argumentos da linha de comando
const inputFile = process.argv[2] || 'TECHNICAL_MANUAL.md';
const outputFile = process.argv[3] || null;

generatePDF(inputFile, outputFile).catch(console.error);

