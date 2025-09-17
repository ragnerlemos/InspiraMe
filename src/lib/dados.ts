
// Define o tipo para uma citação, incluindo seu ID, texto e categoria.
export type Quote = {
  id: string; // ID único composto
  text: string;
  author: string;
  mainCategory: string; // Nome da aba da planilha
  subCategory: string;  // Valor da "Categoria 1"
};

// Define o tipo para uma categoria, que é simplesmente uma string.
export type Category = string;

// Array de citações - será preenchido dinamicamente.
export let quotes: Quote[] = [];


// Adicione aqui os nomes exatos das abas que você quer usar.
const SHEET_NAMES = ['Datas Comemorativas', 'Dias da Semana', 'Frases'];


// Função para buscar os dados da planilha usando a API REST do Google Sheets
async function loadQuotesFromSheets() {
  // Se os dados já foram carregados, não busca novamente.
  if (quotes.length > 0) return { quotes };

  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const API_KEY = process.env.GOOGLE_API_KEY;

  if (!SPREADSHEET_ID || !API_KEY) {
    console.error("SPREADSHEET_ID ou GOOGLE_API_KEY não estão definidos nas variáveis de ambiente.");
    // No servidor, podemos lançar um erro ou retornar vazio.
    // Retornar vazio evita que a build quebre se as chaves não estiverem lá temporariamente.
    return { quotes: [] };
  }

  const loadedQuotes: Quote[] = [];

  try {
    const fetchPromises = SHEET_NAMES.map(async (sheetName) => {
        const RANGE = 'A:J'; 
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!${RANGE}?key=${API_KEY}`;
        
        // Aumenta o tempo de cache para 1 hora para evitar chamadas excessivas à API
        const response = await fetch(url, { next: { revalidate: 3600 } }); 
        
        if (!response.ok) {
            console.error(`Erro ao buscar a aba "${sheetName}": ${response.statusText}`);
            return; // Pula para a próxima aba em caso de erro
        }
        
        const data = await response.json();
        const allRows: string[][] = data.values || [];

        if (allRows.length < 2) return;

        const headerRow = allRows.shift()!;
        
        const normalizeHeader = (header: string) => {
            if (!header) return '';
            return header.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        const normalizedHeaders = headerRow.map(normalizeHeader);
        const normalizedSheetName = normalizeHeader(sheetName);
        
        // Lógica flexível para encontrar a coluna de texto principal.
        // Tenta encontrar uma coluna com o mesmo nome da aba, senão, procura por "frase".
        let fraseIndex = normalizedHeaders.findIndex(h => h === normalizedSheetName);
        if (fraseIndex === -1) {
            fraseIndex = normalizedHeaders.findIndex(h => h.includes('frase'));
        }

        const autorIndex = normalizedHeaders.indexOf('assinatura');
        const categoriaIndex = normalizedHeaders.indexOf('categoria 1');

        if (fraseIndex === -1) {
             console.error(`[ Server ] Coluna de texto principal não encontrada na aba "${sheetName}". Pulando esta aba.`);
             return;
        }

        allRows.forEach((row, index) => {
            const frase = row[fraseIndex];
            // Se 'assinatura' não existir, usa o nome da aba como autor.
            const autor = (autorIndex !== -1 && row[autorIndex]) ? row[autorIndex] : sheetName;
            // Se 'categoria 1' não existir, usa 'Geral'.
            const categoria = (categoriaIndex !== -1 && row[categoriaIndex]) ? row[categoriaIndex] : 'Geral';

            if (frase && autor && categoria) {
              loadedQuotes.push({
                  id: `${sheetName.replace(/\s+/g, '-')}-${index + 1}`, // ID único sanitizado
                  text: frase.trim(),
                  author: autor.trim(),
                  mainCategory: sheetName,
                  subCategory: categoria.trim(),
              });
            }
        });
    });

    await Promise.all(fetchPromises);

    // Atualiza a variável global
    quotes = loadedQuotes;

    return { quotes };

  } catch (error) {
    console.error('Erro ao carregar dados das planilhas:', error);
    return { quotes: [] };
  }
}

// Exporta uma função que garante que os dados sejam carregados antes de serem usados.
export const getQuoteData = async () => {
    // Esta função agora SEMPRE será executada no servidor.
    return await loadQuotesFromSheets();
}

// Helper para extrair categorias da lista de frases
export const getCategoriesFromQuotes = (quotes: Quote[]) => {
    const mainCategoriesSet = new Set(quotes.map(q => q.mainCategory));
    const mainCategories = ['Todos', ...Array.from(mainCategoriesSet)];
    
    const subCategoriesByMain: Record<string, string[]> = {};

    mainCategoriesSet.forEach(mainCat => {
        const subs = quotes
            .filter(q => q.mainCategory === mainCat && q.subCategory)
            .map(q => q.subCategory);
        
        const uniqueSubs = ['Todos', ...Array.from(new Set(subs))];
        subCategoriesByMain[mainCat] = uniqueSubs.sort((a, b) => {
            if (a === 'Todos') return -1;
            if (b === 'Todos') return 1;
            return a.localeCompare(b);
        });
    });

    return { mainCategories, subCategoriesByMain };
}