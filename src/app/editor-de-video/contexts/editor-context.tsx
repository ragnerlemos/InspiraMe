
"use client";

import { createContext, useContext, ReactNode } from 'react';
import type { EditorState } from '../tipos';

// Define a interface para o estado completo do editor que será compartilhado.
export interface EditorControlState {
  canUndo: boolean;
  undo: () => void;
  canRedo: boolean;
  redo: () => void;
  onSaveAsTemplate: () => Promise<void>;
  onExportJPG: () => void;
  onExportPNG: () => void;
  onExportMP4: () => void;
  isReady: boolean;
}

const defaultControls: EditorControlState = {
    canUndo: false,
    undo: () => {},
    canRedo: false,
    redo: () => {},
    onSaveAsTemplate: async () => {},
    onExportJPG: () => {},
    onExportPNG: () => {},
    onExportMP4: () => {},
    isReady: false,
};

// Define a interface para o valor do contexto.
interface EditorContextType {
  controls: EditorControlState;
}

// Cria o contexto com valores padrão.
const EditorContext = createContext<EditorContextType>({
    controls: defaultControls,
});


// Cria o provedor do contexto.
export function EditorProvider({ children, controls }: { children: ReactNode, controls: EditorControlState }) {
  const value: EditorContextType = {
    controls,
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
