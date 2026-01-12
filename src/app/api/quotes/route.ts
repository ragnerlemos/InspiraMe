
import { NextResponse } from 'next/server';
import { getAllQuotes } from '@/lib/dados';

export const revalidate = 0;

export async function GET() {
  try {
    const quotes = await getAllQuotes();
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Falha ao buscar frases na API:', error);
    const errorMessage = error instanceof Error ? error.message : "Um erro desconhecido ocorreu.";
    return new NextResponse(JSON.stringify({ error: 'Erro Interno do Servidor', details: errorMessage }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}
