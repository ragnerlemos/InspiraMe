
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// Carrega as variáveis de ambiente. Certifique-se de que o arquivo .env está na raiz.
require('dotenv').config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Esta função precisa que as credenciais da sua Conta de Serviço estejam
// disponíveis como variáveis de ambiente.
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // A chave privada precisa ter as quebras de linha restauradas.
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function POST(req: NextRequest) {
  try {
    const { sheetName, oldCategoryName, newCategoryName, isSubCategory } = await req.json();

    if (!sheetName || !oldCategoryName || !newCategoryName) {
      return NextResponse.json({ error: 'Nome da aba, nome antigo e novo da categoria são obrigatórios.' }, { status: 400 });
    }

    if (!SPREADSHEET_ID) {
        return NextResponse.json({ error: 'O ID da planilha (SPREADSHEET_ID) não está configurado.' }, { status: 500 });
    }

    // A coluna a ser atualizada. 'D' (índice 3) para categoria principal, 'C' (índice 2) para subcategoria.
    const categoryColumnIndex = isSubCategory ? 2 : 3;
    const categoryColumnLetter = isSubCategory ? 'C' : 'D';
    
    // 1. Obter todos os dados da aba específica
    const getResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:J`, // Assumindo que os dados vão até a coluna J
    });

    const rows = getResponse.data.values;
    if (!rows || rows.length === 0) {
        return NextResponse.json({ message: `Aba ${sheetName} está vazia ou não foi encontrada.` });
    }

    const updateRequests = [];

    // 2. Encontrar as linhas que precisam ser atualizadas (começando do 1 para pular cabeçalho)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        // Verifica se a célula da categoria corresponde ao nome antigo
        if (row[categoryColumnIndex] === oldCategoryName) {
            // Prepara uma solicitação de atualização para esta célula
            updateRequests.push({
                range: `${sheetName}!${categoryColumnLetter}${i + 1}`,
                values: [[newCategoryName]],
            });
        }
    }

    // 3. Se houver atualizações a fazer, envia-as em lote
    if (updateRequests.length > 0) {
        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data: updateRequests,
            },
        });
    }

    return NextResponse.json({ message: 'Categorias atualizadas com sucesso!' });

  } catch (error) {
    console.error('Erro ao atualizar a planilha:', error);
    const errorMessage = error instanceof Error ? error.message : 'Um erro desconhecido ocorreu';
    return NextResponse.json({ error: 'Falha ao atualizar a planilha.', details: errorMessage }, { status: 500 });
  }
}
