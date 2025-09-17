
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

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

// Função para buscar os dados da planilha
async function loadQuotesFromSheet() {
  // Se os dados já foram carregados, não busca novamente.
  if (quotes.length > 0) return { quotes, categories };

  try {
    const serviceAccountAuth = new JWT({
      // O email e a chave privada não são necessários para acesso público somente leitura
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID!, serviceAccountAuth);

    // Para planilhas públicas, podemos usar a API Key.
    doc.useApiKey(process.env.GOOGLE_SHEETS_API_KEY!);

    await doc.loadInfo(); // carrega as propriedades do documento
    const sheet = doc.sheetsByTitle['Frases']; // acessa a aba pelo nome
    
    // Carrega as linhas da aba, considerando as colunas que você mencionou.
    // O range será de D (Categoria 1) até J (Assinatura).
    const rows = await sheet.getRows();

    const loadedQuotes: Quote[] = [];
    const loadedCategories = new Set<string>();

    rows.forEach((row, index) => {
      const frase = row.get('Frases');
      const autor = row.get('Assinatura');
      const categoria = row.get('Categoria 1');

      // Só adiciona a frase se os campos essenciais existirem
      if (frase && autor && categoria) {
        loadedQuotes.push({
          id: index + 1, // Gera um ID sequencial
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
    console.error('Erro ao carregar dados da planilha:', error);
    // Retorna os arrays vazios em caso de erro para não quebrar a aplicação
    return { quotes: [], categories: [] };
  }
}

// Exporta uma função que garante que os dados sejam carregados antes de serem usados.
export const getQuoteData = async () => {
    return await loadQuotesFromSheet();
}

// O array de modelos foi movido para o hook useTemplates.ts para permitir a personalização.
export const templates = [];
