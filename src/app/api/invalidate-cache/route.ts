import { NextRequest, NextResponse } from 'next/server';
import { invalidateCache as invalidateQuotesCache } from '@/lib/dados';

export async function POST(req: NextRequest) {
  try {
    invalidateQuotesCache();
    return NextResponse.json({ message: 'Cache invalidado com sucesso!' });
  } catch (error) {
    console.error('Erro ao invalidar o cache:', error);
    return NextResponse.json({ error: 'Falha ao invalidar o cache.' }, { status: 500 });
  }
}
