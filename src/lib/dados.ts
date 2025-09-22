

import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAMES = ['Frases', 'Dias da Semana', 'Datas Comemorativas'];

// Configure the sheets client to use an API Key
const sheets = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY,
});

export interface Quote {
    id: string;
    text: string;
    author: string;
    mainCategory: string;
    subCategory: string;
    sheetName: string;
}

export interface CategoriesResult {
  mainCategories: string[];
  subCategoriesByMain: { [key: string]: string[] };
}

// Função para processar os dados brutos e extrair categorias
export function getCategoriesFromQuotes(quotes: Quote[]): CategoriesResult {
    const mainCategoriesSet = new Set<string>();
    const subCategoriesByMain: { [key: string]: Set<string> } = {};

    quotes.forEach(quote => {
        if (quote.mainCategory) {
            mainCategoriesSet.add(quote.mainCategory);
            if (!subCategoriesByMain[quote.mainCategory]) {
                subCategoriesByMain[quote.mainCategory] = new Set();
            }
            if (quote.subCategory) {
                subCategoriesByMain[quote.mainCategory].add(quote.subCategory);
            }
        }
    });

    const mainCategories = ['Todos', ...Array.from(mainCategoriesSet).sort()];
    const subCategoriesResult: { [key: string]: string[] } = {};
    for (const mainCat in subCategoriesByMain) {
        subCategoriesResult[mainCat] = ['Todos', ...Array.from(subCategoriesByMain[mainCat]).sort()];
    }

    return { mainCategories, subCategoriesByMain: subCategoriesResult };
}


const mapRowToQuote = (row: any[], rowIndex: number, sheetName: string): Quote | null => {
    const quoteText = row[5]; // Coluna F
    if (!quoteText) return null;

    return {
        id: `${sheetName}-${rowIndex}`,
        text: quoteText,
        author: row[9] || 'Desconhecido', // Coluna J
        mainCategory: row[3] || 'Geral', // Coluna D
        subCategory: row[2] || 'Geral', // Coluna C
        sheetName: sheetName,
    };
};

export async function getAllQuotes(): Promise<Quote[]> {
    try {
        if (!process.env.GOOGLE_API_KEY || !SPREADSHEET_ID) {
            throw new Error('Google Sheets API key or Spreadsheet ID is not configured.');
        }

        const ranges = SHEET_NAMES.map(name => `${name}!A:J`);
        const response = await sheets.spreadsheets.values.batchGet({
            spreadsheetId: SPREADSHEET_ID,
            ranges,
        });

        let allQuotes: Quote[] = [];
        const valueRanges = response.data.valueRanges;

        if (valueRanges && valueRanges.length > 0) {
            valueRanges.forEach((range, sheetIndex) => {
                const sheetName = SHEET_NAMES[sheetIndex];
                const rows = range.values;
                if (rows && rows.length > 1) { 
                    for (let i = 1; i < rows.length; i++) {
                        const quote = mapRowToQuote(rows[i], i, sheetName);
                        if (quote) {
                            allQuotes.push(quote);
                        }
                    }
                }
            });
        }
        return allQuotes;
    } catch (error) {
        console.error('Error fetching all quotes from Google Sheets:', error);
        throw new Error('Could not fetch all quotes.');
    }
}

// Função agregadora que busca todas as frases
export async function getQuoteData(): Promise<{ quotes: Quote[] }> {
    const quotes = await getAllQuotes();
    return { quotes };
}
