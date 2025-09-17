
'use server';

import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAMES = ['Frases', 'Dias da Semana', 'Datas Comemorativas'];

// Configure the sheets client to use an API Key
const sheets = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY,
});

export type CategoriesHierarchy = { [category: string]: string[] };
export type QuoteWithAuthor = {
  quote: string;
  author?: string;
  // Adicionando um id para uso nos hooks de favoritos
  id: string; 
};


/**
 * Fetches all unique categories and their subcategories from the specified sheets.
 * Assumes categories are in Column D and subcategories are in Column C.
 */
export async function getCategories(): Promise<CategoriesHierarchy> {
  try {
    if (!process.env.GOOGLE_API_KEY || !SPREADSHEET_ID) {
      throw new Error('Google Sheets API key or Spreadsheet ID is not configured.');
    }

    const ranges = SHEET_NAMES.map(name => `${name}!C:D`); // Read full columns C and D
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges,
    });

    const valueRanges = response.data.valueRanges;
    const hierarchy: { [key: string]: Set<string> } = {};
    
    if (valueRanges && valueRanges.length > 0) {
      valueRanges.forEach(range => {
        const rows = range.values;
        if (rows && rows.length > 0) {
          // Start from row 2 (index 1) to skip header
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const subcategory = row[0] || null; // Column C
            const category = row[1] || null;    // Column D
    
            if (category) {
              if (!hierarchy[category]) {
                hierarchy[category] = new Set();
              }
              if (subcategory) {
                hierarchy[category].add(subcategory);
              }
            } else if (subcategory) {
              // Handle cases where there might be a subcategory without a main category
              // Treats the subcategory as a main category with no sub-items.
              if (!hierarchy[subcategory]) {
                hierarchy[subcategory] = new Set();
              }
            }
          }
        }
      })
    }

    // Convert Sets to Arrays for easier consumption by client components
    const result: CategoriesHierarchy = {};
    for (const category in hierarchy) {
      result[category] = Array.from(hierarchy[category]).sort();
    }
    
    // Sort categories alphabetically
    const sortedResult: CategoriesHierarchy = {};
    Object.keys(result).sort().forEach(key => {
        sortedResult[key] = result[key];
    });


    return sortedResult;
  } catch (error) {
    console.error('Error fetching categories from Google Sheets:', error);
    throw new Error('Could not fetch categories.');
  }
}

/**
 * Fetches quotes for a specific subcategory from all sheets.
 * Assumes subcategories are in Column C, quotes in Column F, and authors in Column J.
 * @param subcategory The subcategory to fetch quotes for.
 */
export async function getQuotesForCategory(subcategory: string): Promise<QuoteWithAuthor[]> {
  try {
    if (!process.env.GOOGLE_API_KEY || !SPREADSHEET_ID) {
      throw new Error('Google Sheets API key or Spreadsheet ID is not configured.');
    }

    const ranges = SHEET_NAMES.map(name => `${name}!A:J`);
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges,
    });

    let quotes: QuoteWithAuthor[] = [];
    const valueRanges = response.data.valueRanges;

    if (valueRanges && valueRanges.length > 0) {
      valueRanges.forEach((range, sheetIndex) => {
        const sheetName = SHEET_NAMES[sheetIndex];
        const rows = range.values;
        if (rows && rows.length > 0) {
          const sheetQuotes = rows
            .map((row, rowIndex) => ({ row, rowIndex }))
            .filter(({ row }) => row[2] === subcategory && row[5]) // Filter by subcategory (col C, index 2) and ensure quote (col F, index 5) exists
            .map(({ row, rowIndex }) => ({
              id: `${sheetName}-${subcategory}-${rowIndex}`, // Unique ID
              quote: row[5], // Quote from col F (index 5)
              author: row[9] || undefined, // Author from col J (index 9)
            }));
          quotes = quotes.concat(sheetQuotes);
        }
      });
    }

    return quotes;
  } catch (error) {
    console.error(
      `Error fetching quotes for subcategory "${subcategory}" from Google Sheets:`,
      error
    );
    throw new Error(`Could not fetch quotes for subcategory "${subcategory}".`);
  }
}

/**
 * Fetches all quotes for a specific main category from all sheets.
 * Assumes main categories are in Column D, quotes in Column F, and authors in Column J.
 * @param mainCategory The main category to fetch quotes for.
 */
export async function getQuotesForMainCategory(mainCategory: string): Promise<QuoteWithAuthor[]> {
  try {
    if (!process.env.GOOGLE_API_KEY || !SPREADSHEET_ID) {
      throw new Error('Google Sheets API key or Spreadsheet ID is not configured.');
    }

    const ranges = SHEET_NAMES.map(name => `${name}!A:J`);
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges,
    });
    
    let quotes: QuoteWithAuthor[] = [];
    const valueRanges = response.data.valueRanges;

    if (valueRanges && valueRanges.length > 0) {
      valueRanges.forEach((range, sheetIndex) => {
        const sheetName = SHEET_NAMES[sheetIndex];
        const rows = range.values;
        if (rows && rows.length > 0) {
          const sheetQuotes = rows
            .map((row, rowIndex) => ({ row, rowIndex }))
            .filter(({ row }) => (row[3] === mainCategory && row[5]) || (row[2] === mainCategory && !row[3] && row[5]))
            .map(({ row, rowIndex }) => ({
              id: `${sheetName}-${mainCategory}-${rowIndex}`, // Unique ID
              quote: row[5], // Quote from col F (index 5)
              author: row[9] || undefined, // Author from col J (index 9)
            }));
          quotes = quotes.concat(sheetQuotes);
        }
      });
    }
    
    return quotes;
  } catch (error) {
    console.error(
      `Error fetching quotes for main category "${mainCategory}" from Google Sheets:`,
      error
    );
    throw new Error(`Could not fetch quotes for main category "${mainCategory}".`);
  }
}


/**
 * Fetches all quotes from all sheets.
 */
export async function getAllQuotes(): Promise<QuoteWithAuthor[]> {
    try {
        if (!process.env.GOOGLE_API_KEY || !SPREADSHEET_ID) {
            throw new Error('Google Sheets API key or Spreadsheet ID is not configured.');
        }

        const ranges = SHEET_NAMES.map(name => `${name}!A:J`);
        const response = await sheets.spreadsheets.values.batchGet({
            spreadsheetId: SPREADSHEET_ID,
            ranges,
        });

        let allQuotes: QuoteWithAuthor[] = [];
        const valueRanges = response.data.valueRanges;

        if (valueRanges && valueRanges.length > 0) {
            valueRanges.forEach((range, sheetIndex) => {
                const sheetName = SHEET_NAMES[sheetIndex];
                const rows = range.values;
                if (rows && rows.length > 1) { // Garante que há pelo menos uma linha de dados além do cabeçalho
                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        const quoteText = row[5]; // Coluna F
                        if (quoteText) {
                            allQuotes.push({
                                id: `${sheetName}-${i}`, // ID simples
                                quote: quoteText,
                                author: row[9] || undefined, // Coluna J
                            });
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
