
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { EditorProvider } from './editor-de-video/contexts/editor-context';
import { AppHeader, EditorHeader } from './cabecalho-app';
import type { EditorControlState, EditorState } from './editor-de-video/tipos';

// Componente de layout que gerencia qual cabeçalho exibir.
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith('/editor-de-video');
  
  // Estado e lógica de controle movidos para o layout
  const [controls, setControls] = useState<EditorControlState>({
    canUndo: false,
    undo: () => {},
    canRedo: false,
    redo: () => {},
    onSaveAsTemplate: async () => {},
    onExportJPG: () => {},
    onExportPNG: () => {},
    onExportMP4: () => {},
    isReady: false,
  });

  // Função para a página do editor registrar seus controles
  const registerEditorControls = useCallback((editorControls: Partial<EditorControlState>) => {
    setControls(prev => ({ ...prev, ...editorControls }));
  }, []);

  const childWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && isEditorPage) {
        // @ts-ignore
        return React.cloneElement(child, { registerControls: registerEditorControls });
    }
    return child;
  });

  if (isEditorPage) {
     return (
        <EditorProvider controls={controls}>
            <div className="flex flex-col h-full">
                <EditorHeader />
                <div className="flex-1 flex flex-col min-h-0">
                    {childWithProps}
                </div>
            </div>
        </EditorProvider>
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
