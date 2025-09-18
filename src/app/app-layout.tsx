
"use client";

import React from "react";
import { usePathname } from 'next/navigation';
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { AppHeader, EditorHeader } from './cabecalho-app';

// Componente de layout que gerencia qual cabeçalho exibir.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');

  const childWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && isEditorPage) {
        // Assume que o filho (página) aceita essas props
        // Isso é um pouco "mágico", mas necessário para passar os controles
        // @ts-ignore
        return <EditorProvider>{React.cloneElement(child)}</EditorProvider>;
    }
    return child;
  });

  if (isEditorPage) {
     return (
        <div className="flex flex-col h-full">
            <EditorHeader />
            <div className="flex-1 flex flex-col min-h-0">
                {childWithProps}
            </div>
        </div>
     )
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
}
