
import { Suspense } from 'react';
import { quotes as allQuotes } from '@/lib/quotes';
import { FrasesClientPage } from './frases-client';
import { Skeleton } from '@/components/ui/skeleton';

// The skeleton component for Suspense fallback.
function FrasesLoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-8 md:items-start px-4">
      <aside className="hidden md:block">
        <div className="sticky top-24 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </aside>
      <div>
        <div className="w-full mb-8">
            <Skeleton className="h-12 w-3/4 mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
            ))}
        </div>
      </div>
    </div>
  );
}


// This is a Server Component that provides the initial data.
export default function FrasesPage() {
  
  // Create category hierarchy from the static quotes data
  const mainCategories = ['Todos', ...new Set(allQuotes.map(q => q.category))];
  const categories: { [mainCategory: string]: string[] } = {};

  allQuotes.forEach(quote => {
      if (!categories[quote.category]) {
          categories[quote.category] = [];
      }
      if (quote.subCategory && !categories[quote.category].includes(quote.subCategory)) {
          categories[quote.category].push(quote.subCategory);
      }
  });

  return (
    <Suspense fallback={<FrasesLoadingSkeleton />}>
      <FrasesClientPage
        initialQuotes={allQuotes}
        initialMainCategories={mainCategories}
        initialSubCategories={categories}
      />
    </Suspense>
  );
}
