
"use client";

import React from "react";
import { usePathname } from 'next/navigation';
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { AppHeader, EditorHeader } from './cabecalho-app';
import { useState } from 'react';

// Componente de layout que gerencia qual cabeçalho exibir.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const showCategoryButton = pathname === '/';

  return (
    <div className="flex flex-col h-full">
       {isEditorPage ? (
          <EditorProvider>
            <EditorHeader />
             <div className="flex-1 flex flex-col min-h-0">
               {children}
            </div>
          </EditorProvider>
       ) : (
          <>
            <AppHeader 
              showCategoryMenuButton={showCategoryButton} 
              onCategoryMenuClick={() => setIsCategorySheetOpen(true)} 
            />
             <div className="flex-1 flex flex-col min-h-0">
                {/* Passa o estado e a função para o children, que é a página */}
                {React.cloneElement(children as React.ReactElement, { isCategorySheetOpen, setIsCategorySheetOpen })}
            </div>
          </>
       )}
    </div>
  );
}
