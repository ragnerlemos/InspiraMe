
// This file is no longer used, but kept to avoid breaking changes in case other parts of the app still reference it.
// The logic has been moved to src/lib/dados.ts and the pages now fetch data directly.
import { NextResponse } from 'next/server';
import { getAllQuotes } from '@/lib/dados';

export async function GET(request: Request) {
    try {
        const quotes = getAllQuotes();
        return NextResponse.json(quotes);
    } catch (error)
        {
        console.error('Error fetching quotes:', error);
        return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
    }
}
