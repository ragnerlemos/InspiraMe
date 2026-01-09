import { NextResponse } from 'next/server';
import { getAllQuotes } from '@/lib/dados';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SheetData {
  [sheetName: string]: {
    [category: string]: string[];
  };
}

// Esta API Route agora é um fallback e não é mais usada pela página de cadastro.
// Mantida para compatibilidade, caso outra parte do app a utilize.
export async function GET() {
  try {
    const quotes = await getAllQuotes();
    
    const data: SheetData = {};

    quotes.forEach(q => {
        if (q.sheetName && q.category) {
            if (!data[q.sheetName]) {
                data[q.sheetName] = {};
            }
            if (!data[q.sheetName][q.category]) {
                data[q.sheetName][q.category] = [];
            }
            if (q.subCategory && q.subCategory !== 'Todos' && !data[q.sheetName][q.category].includes(q.subCategory)) {
                data[q.sheetName][q.category].push(q.subCategory);
            }
        }
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error('Falha ao buscar frases na API:', error);
    const errorMessage = error instanceof Error ? error.message : "Um erro desconhecido ocorreu.";
    return new NextResponse(JSON.stringify({ error: 'Erro Interno do Servidor', details: errorMessage }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}
