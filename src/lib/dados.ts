
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // Use readonly scope for safety
});

const sheets = google.sheets({
  version: 'v4',
  auth: auth,
});

export interface QuoteWithAuthor {
    id: string;
    quote: string;
    author?: string;
    category: string;
    subCategory?: string;
    sheetName: string; 
}

interface CategoriesHierarchy {
  [mainCategory: string]: string[];
}

export interface SheetHierarchy {
  [sheetName: string]: CategoriesHierarchy;
}

const mapRowToQuote = (row: any[], index: number, sheetName: string): QuoteWithAuthor | null => {
    const quoteText = row[5];
    if (!quoteText || typeof quoteText !== 'string' || quoteText.trim() === '') {
        return null;
    }
    return {
        id: `${sheetName}-${index}`,
        quote: quoteText.trim(),
        author: row[9] || undefined,
        category: row[3] || 'Geral',
        subCategory: row[2] || undefined,
        sheetName: sheetName,
    };
};

export async function getAllSheetNames(): Promise<string[]> {
    if (!SPREADSHEET_ID) {
        console.error('SPREADSHEET_ID is not defined in the environment.');
        return [];
    }

    try {
        const spreadsheetMeta = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID
        });
        
        const sheetNames = spreadsheetMeta.data.sheets
            ?.map(sheet => sheet.properties?.title)
            .filter((title): title is string => !!title && title !== 'Modelo'); // Exclude the template sheet
        
        if (!sheetNames) {
            console.warn('No sheets found in the spreadsheet.');
            return [];
        }
        
        return sheetNames;

    } catch (error) {
        console.error('Error fetching sheet names:', error);
        return []; // Return empty array on error
    }
}


export async function getAllQuotes(): Promise<QuoteWithAuthor[]> {
    if (!SPREADSHEET_ID) {
        console.error('SPREADSHEET_ID is not defined in the environment.');
        return [];
    }

    try {
        const sheetNames = await getAllSheetNames();
        if (sheetNames.length === 0) {
            return [];
        }

        const ranges = sheetNames.map(name => `'${name}'!A:J`);
        const response = await sheets.spreadsheets.values.batchGet({
            spreadsheetId: SPREADSHEET_ID,
            ranges,
        });

        const valueRanges = response.data.valueRanges;
        if (!valueRanges) {
            console.warn('batchGet returned no valueRanges.');
            return [];
        }
        
        const quotes: QuoteWithAuthor[] = [];
        valueRanges.forEach((range, rangeIndex) => {
            const sheetName = sheetNames[rangeIndex]; // More reliable way to get sheet name
            if (range.values) {
                // Start at 1 to skip header row
                for (let i = 1; i < range.values.length; i++) {
                    const quote = mapRowToQuote(range.values[i], i, sheetName);
                    if (quote) {
                        quotes.push(quote);
                    }
                }
            }
        });
        
        return quotes;

    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        return []; // Return empty array on error
    }
}

export async function getSheetData(): Promise<SheetHierarchy> {
    const quotes = await getAllQuotes();
    const sheetHierarchy: SheetHierarchy = {};

    quotes.forEach(quote => {
        if (!sheetHierarchy[quote.sheetName]) {
            sheetHierarchy[quote.sheetName] = {};
        }
        const sheetCategories = sheetHierarchy[quote.sheetName];
        if (quote.category) {
            if (!sheetCategories[quote.category]) {
                sheetCategories[quote.category] = [];
            }
            if (quote.subCategory && !sheetCategories[quote.category].includes(quote.subCategory) && quote.subCategory !== 'Todos') {
                sheetCategories[quote.category].push(quote.subCategory);
            }
        }
    });
    
    for (const sheetName in sheetHierarchy) {
        for (const cat in sheetHierarchy[sheetName]) {
            sheetHierarchy[sheetName][cat].sort();
        }
    }

    return sheetHierarchy;
}
