'use client';

import { usePathname } from 'next/navigation';
import { EditorProvider } from '@/app/editor-de-video/contexts/editor-context';
import { FirebaseClientProvider } from "@/firebase";
import { AppHeader } from '@/components/app-header';

// Componente de layout principal para as páginas do aplicativo.
export function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // As rotas que NÃO devem exibir o cabeçalho principal.
  const noHeaderPaths = ['/editor-de-video'];
  const hideHeader = noHeaderPaths.some(path => pathname.startsWith(path));

  return (
    <FirebaseClientProvider>
      <EditorProvider>
        <div className="flex flex-col h-full">
          {!hideHeader && <AppHeader />}
          <div className="flex-1 flex flex-col min-h-0">
            {children}
          </div>
        </div>
      </EditorProvider>
    </FirebaseClientProvider>
  );
}
