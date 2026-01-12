import { NextResponse } from 'next/server';
import { getAllSheetNames } from '@/lib/dados';

// API Route para obter o nome da primeira aba da planilha
export async function GET() {
  try {
    const sheetNames = await getAllSheetNames();
    const firstSheet = sheetNames.length > 0 ? sheetNames[0] : null;
    return NextResponse.json({ firstSheet });
  } catch (error) {
    console.error('Falha ao buscar a primeira aba:', error);
    return new NextResponse(JSON.stringify({ error: 'Erro Interno do Servidor' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}
