
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
    // A autenticação JWT é necessária mesmo para planilhas públicas quando acessada via SDK no servidor.
    // Para acesso somente leitura, a conta de serviço só precisa da permissão "Viewer".
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'), // Corrige a formatação da chave
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID!, serviceAccountAuth);

    await doc.loadInfo(); // carrega as propriedades do documento
    const sheet = doc.sheetsByTitle['Frases']; // acessa a aba pelo nome
    
    if (!sheet) {
      throw new Error("Aba 'Frases' não encontrada na planilha.");
    }
    
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
    // Em caso de erro, retorna arrays vazios para não quebrar a aplicação.
    // Isso é importante para o build não falhar.
    return { quotes: [], categories: [] };
  }
}

// Exporta uma função que garante que os dados sejam carregados antes de serem usados.
export const getQuoteData = async () => {
    return await loadQuotesFromSheet();
}

// O array de modelos foi movido para o hook useTemplates.ts para permitir a personalização.
export const templates = [];
