
"use client";

import React, { useState } from "react";
import { usePathname } from 'next/navigation';
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { AppHeader, EditorHeader } from './cabecalho-app';

// Componente de layout que gerencia qual cabeçalho exibir.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');
  const isFrasesPage = pathname.startsWith('/frases');

  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  // Clona o elemento filho para injetar as props de controle do menu
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && isFrasesPage) {
      return React.cloneElement(child as React.ReactElement<any>, { 
        isCategorySheetOpen,
        setIsCategorySheetOpen
      });
    }
    return child;
  });

  if (isEditorPage) {
     return (
        <EditorProvider>
            <div className="flex flex-col h-full">
                <EditorHeader />
                <div className="flex-1 flex flex-col min-h-0">
                    {children}
                </div>
            </div>
        </EditorProvider>
     )
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader 
        showCategoryMenuButton={isFrasesPage} 
        onCategoryMenuClick={() => setIsCategorySheetOpen(true)} 
      />
      <div className="flex-1 flex flex-col min-h-0">
        {isFrasesPage ? childrenWithProps : children}
      </div>
    </div>
  );
}
