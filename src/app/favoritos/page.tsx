
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { FavoritesClientPage } from './favoritos-client';
import { getAllQuotes } from '@/lib/dados';
import { Suspense } from 'react';


function FavoritesPageContent() {
  const [allQuotes, setAllQuotes] = useState<any[]>([]);

  useEffect(() => {
    getAllQuotes().then(quotes => setAllQuotes(quotes));
  }, []);

  return <FavoritesClientPage allQuotes={allQuotes} />;
}

export default function FavoritesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <FavoritesPageContent />
    </Suspense>
  );
}

