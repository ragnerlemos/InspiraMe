
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

// Função para buscar os dados da planilha usando a API REST do Google Sheets
async function loadQuotesFromSheet() {
  // Se os dados já foram carregados, não busca novamente.
  if (quotes.length > 0) return { quotes, categories };

  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const API_KEY = process.env.GOOGLE_API_KEY;
  const SHEET_NAME = 'Frases';
  // Buscando um range maior para garantir que pegamos todas as colunas necessárias (D, F, J)
  const RANGE = 'A:J'; 

  if (!SPREADSHEET_ID || !API_KEY) {
    console.error("SPREADSHEET_ID ou GOOGLE_API_KEY não estão definidos nas variáveis de ambiente.");
    return { quotes: [], categories: [] };
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!${RANGE}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao buscar a planilha: ${response.statusText} - ${errorData.error?.message}`);
    }

    const data = await response.json();
    const allRows: string[][] = data.values || [];
    
    if (allRows.length < 2) {
        console.error("A planilha não contém dados suficientes (cabeçalho + pelo menos uma linha de dados).");
        return { quotes: [], categories: [] };
    }

    // Remove o cabeçalho para pegar os nomes das colunas
    const headerRow = allRows.shift()!;

    // Encontra os índices das colunas que nos interessam (baseado em 0)
    const fraseIndex = headerRow.findIndex(h => h.toLowerCase().trim() === 'frases');
    const autorIndex = headerRow.findIndex(h => h.toLowerCase().trim() === 'assinatura');
    const categoriaIndex = headerRow.findIndex(h => h.toLowerCase().trim() === 'categoria 1');
    
    if (fraseIndex === -1 || autorIndex === -1 || categoriaIndex === -1) {
        console.error("Colunas necessárias (Frases, Assinatura, Categoria 1) não encontradas no cabeçalho:", headerRow);
        // Retornando para evitar crash
        return { quotes: [], categories: [] };
    }

    const loadedQuotes: Quote[] = [];
    const loadedCategories = new Set<string>();

    allRows.forEach((row, index) => {
      const frase = row[fraseIndex];
      const autor = row[autorIndex];
      const categoria = row[categoriaIndex];

      if (frase && autor && categoria) {
        loadedQuotes.push({
          id: index + 1,
          text: frase.trim(),
          author: autor.trim(),
          category: categoria.trim(),
        });
        loadedCategories.add(categoria.trim());
      }
    });

    // Atualiza as variáveis globais
    quotes = loadedQuotes;
    categories = Array.from(loadedCategories).sort();

    return { quotes, categories };

  } catch (error) {
    console.error('Erro ao carregar dados da planilha:', error);
    return { quotes: [], categories: [] };
  }
}

// Exporta uma função que garante que os dados sejam carregados antes de serem usados.
export const getQuoteData = async () => {
    return await loadQuotesFromSheet();
}
