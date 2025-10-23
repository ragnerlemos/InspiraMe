
import { NextResponse } from 'next/server';
import { getAllQuotes } from '@/lib/dados';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const quotes = await getAllQuotes();
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Falha ao buscar frases:', error);
    return new NextResponse('Erro Interno do Servidor', { status: 500 });
  }
}
