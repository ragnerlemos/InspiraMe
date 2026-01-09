import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

require('dotenv').config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function POST(req: NextRequest) {
  try {
    const { oldSheetName, newSheetName } = await req.json();

    if (!oldSheetName || !newSheetName) {
      return NextResponse.json({ error: 'Nomes de aba antigo e novo são obrigatórios.' }, { status: 400 });
    }

    if (!SPREADSHEET_ID) {
        return NextResponse.json({ error: 'O ID da planilha (SPREADSHEET_ID) não está configurado.' }, { status: 500 });
    }
    
    // 1. Obter metadados da planilha para encontrar o sheetId
    const spreadsheetMeta = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
    });

    const sheetToRename = spreadsheetMeta.data.sheets?.find(s => s.properties?.title === oldSheetName);

    if (!sheetToRename || sheetToRename.properties?.sheetId == null) {
        return NextResponse.json({ error: `Aba "${oldSheetName}" não foi encontrada.` }, { status: 404 });
    }

    const sheetId = sheetToRename.properties.sheetId;

    // 2. Construir a solicitação para renomear
    const request = {
        updateSheetProperties: {
            properties: {
                sheetId: sheetId,
                title: newSheetName,
            },
            fields: 'title',
        },
    };

    // 3. Executar a atualização em lote
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
            requests: [request],
        },
    });

    return NextResponse.json({ message: 'Aba renomeada com sucesso!' });

  } catch (error) {
    console.error('Erro ao renomear a aba:', error);
    const errorMessage = error instanceof Error ? error.message : 'Um erro desconhecido ocorreu';
    return NextResponse.json({ error: 'Falha ao renomear a aba na planilha.', details: errorMessage }, { status: 500 });
  }
}
