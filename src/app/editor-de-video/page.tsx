
import { Suspense } from 'react';
import { Editor } from './editor';
import { getAllQuotes } from '@/lib/dados';
import { Skeleton } from '@/components/ui/skeleton';

// Componente de esqueleto para o editor
function EditorLoadingSkeleton() {
    return (
        <div className="flex h-full flex-col">
            <div className="p-4 border-b">
                <Skeleton className="h-8 w-1/3" />
            </div>
            <div className="flex-1 grid grid-cols-[350px_1fr] gap-4 p-4">
                <Skeleton className="h-full w-full" />
                <Skeleton className="h-full w-full" />
            </div>
        </div>
    );
}

// A página do editor agora é um Componente de Servidor que busca os dados.
export default async function EditorPage() {
  const allQuotes = await getAllQuotes(true);

  return (
    <Suspense fallback={<EditorLoadingSkeleton />}>
      <Editor allQuotes={allQuotes} />
    </Suspense>
  );
}
