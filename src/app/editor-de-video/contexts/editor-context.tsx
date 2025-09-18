
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define a interface para o estado completo do editor que será compartilhado.
interface EditorControlState {
  canUndo: boolean;
  undo: () => void;
  canRedo: boolean;
  redo: () => void;
  onSaveAsTemplate: () => void;
  onExportJPG: () => void;
  onExportPNG: () => void;
  onExportMP4: () => void;
}

// Define a interface para o valor do contexto.
interface EditorContextType {
  controls: EditorControlState;
  setControls: (controls: Partial<EditorControlState>) => void;
}

// Cria o contexto com valores padrão.
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Cria o provedor do contexto.
export function EditorProvider({ children }: { children: ReactNode }) {
  const [controls, setControls] = useState<EditorControlState>({
    canUndo: false,
    undo: () => {},
    canRedo: false,
    redo: () => {},
    onSaveAsTemplate: () => {},
    onExportJPG: () => {},
    onExportPNG: () => {},
    onExportMP4: () => {},
  });

  const handleSetControls = useCallback((newControls: Partial<EditorControlState>) => {
    setControls(prev => ({ ...prev, ...newControls }));
  }, []);
  
  const value: EditorContextType = {
    controls,
    setControls: handleSetControls,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

// Cria um hook customizado para usar o contexto.
export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
