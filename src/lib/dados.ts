
// Define o tipo para uma citação, incluindo seu ID, texto e categoria.
export type Quote = {
  id: number;
  text: string;
  author: string;
  category: string;
};

// Define o tipo para uma categoria, que é simplesmente uma string.
export type Category = string;

// Array de categorias de citações - será preenchido dinamicamente.
export let categories: Category[] = [];
// Array de citações - será preenchido dinamicamente.
export let quotes: Quote[] = [];

// Função para converter uma linha CSV em um array de colunas.
// Lida com colunas que contêm vírgulas dentro de aspas.
function parseCsvRow(row: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"' && (i === 0 || row[i-1] !== '\\')) {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
}


// Função para buscar os dados da planilha via CSV
async function loadQuotesFromSheet() {
  // Se os dados já foram carregados, não busca novamente.
  if (quotes.length > 0) return { quotes, categories };

  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const SHEET_NAME = 'Frases';

  if (!SPREADSHEET_ID) {
    console.error("SPREADSHEET_ID não está definido nas variáveis de ambiente.");
    return { quotes: [], categories: [] };
  }

  // URL para exportar a aba específica como CSV
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro ao buscar a planilha: ${response.statusText}`);
    }

    const csvText = await response.text();
    const allRows = csvText.split('\n');
    
    // Remove o cabeçalho
    const headerRow = parseCsvRow(allRows.shift() || '');

    // Encontra os índices das colunas que nos interessam
    const fraseIndex = headerRow.findIndex(h => h.includes('Frases'));
    const autorIndex = headerRow.findIndex(h => h.includes('Assinatura'));
    const categoriaIndex = headerRow.findIndex(h => h.includes('Categoria 1'));
    
    if (fraseIndex === -1 || autorIndex === -1 || categoriaIndex === -1) {
        console.error("Colunas necessárias (Frases, Assinatura, Categoria 1) não encontradas no cabeçalho:", headerRow);
        return { quotes: [], categories: [] };
    }

    const loadedQuotes: Quote[] = [];
    const loadedCategories = new Set<string>();

    allRows.forEach((rowString, index) => {
      if (rowString.trim() === '') return;

      const row = parseCsvRow(rowString);
      
      const frase = row[fraseIndex];
      const autor = row[autorIndex];
      const categoria = row[categoriaIndex];

      if (frase && autor && categoria) {
        loadedQuotes.push({
          id: index + 1,
          text: frase,
          author: autor,
          category: categoria,
        });
        loadedCategories.add(categoria);
      }
    });

    // Atualiza as variáveis globais
    quotes = loadedQuotes;
    categories = Array.from(loadedCategories).sort();

    return { quotes, categories };

  } catch (error) {
    console.error('Erro ao carregar dados da planilha como CSV:', error);
    return { quotes: [], categories: [] };
  }
}

// Exporta uma função que garante que os dados sejam carregados antes de serem usados.
export const getQuoteData = async () => {
    return await loadQuotesFromSheet();
}

// O array de modelos foi movido para o hook useTemplates.ts para permitir a personalização.
export const templates = [];
