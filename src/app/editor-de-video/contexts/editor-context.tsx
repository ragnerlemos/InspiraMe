
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTemplates } from "@/hooks/use-templates";
import type { EditorState, EstiloTexto } from '../tipos';
import { captureAndDownload, captureThumbnail } from '../exportar';
import { useProfile } from '@/hooks/use-profile';
import { useWindowSize } from 'react-use';
import { createStrokeStyle, createDropShadowStyle } from '../utils/text-style-utils';

export interface EditorContextType {
  isReady: boolean;
  canUndo: boolean;
  canRedo: boolean;
  currentState: EditorState | null;
  baseTextStyle: EstiloTexto;
  textEffectsStyle: EstiloTexto;
  dropShadowStyle: EstiloTexto; // Novo estilo para a sombra
  undo: () => void;
  redo: () => void;
  updateState: (newState: Partial<EditorState>) => void;
  setInitialState: (initialState: EditorState) => void;
  onSaveAsTemplate: () => Promise<void>;
  onExportJPG: () => void;
  onExportPNG: () => void;
  onExportMP4: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const defaultState: EditorState = {
    text: "",
    fontFamily: "Poppins",
    fontSize: 2.7,
    fontWeight: "bold",
    fontStyle: "normal",
    textColor: "#FFFFFF",
    textAlign: "center",
    textShadowBlur: 1, 
    textShadowOpacity: 75,
    textVerticalPosition: 50,
    textStrokeColor: "#000000",
    textStrokeWidth: 0,
    textStrokeCornerStyle: 'rounded',
    applyEffectsToEmojis: true,
    letterSpacing: 0,
    lineHeight: 1.3,
    wordSpacing: 0,
    backgroundStyle: { type: 'solid', value: '#000000' },
    filmColor: "#000000",
    filmOpacity: 0,
    aspectRatio: "9 / 16",
    activeTemplateId: null,
    showProfileSignature: false,
    signaturePositionX: 50,
    signaturePositionY: 90,
    signatureScale: 63,
    showSignaturePhoto: false,
    showSignatureUsername: true,
    showSignatureSocial: true,
    showSignatureBackground: false,
    signatureBgColor: "#000000",
    signatureBgOpacity: 30,
    profileVerticalPosition: 25,
    showLogo: false,
    logoPositionX: 50,
    logoPositionY: 72,
    logoScale: 40,
    logoOpacity: 100,
};

export function EditorProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<EditorState[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const { addTemplate } = useTemplates();
  const { profile } = useProfile();

  const currentState = isReady ? history[currentStateIndex] : null;
  const canUndo = currentStateIndex > 0;
  const canRedo = currentStateIndex < history.length - 1;

  const { baseTextStyle, textEffectsStyle, dropShadowStyle } = useMemo(() => {
      if (!currentState) return { baseTextStyle: {}, textEffectsStyle: {}, dropShadowStyle: {} };

      const baseStyle: EstiloTexto = {
          fontFamily: currentState.fontFamily,
          fontSize: `${currentState.fontSize}cqw`,
          fontWeight: currentState.fontWeight,
          fontStyle: currentState.fontStyle,
          color: currentState.textColor,
          textAlign: currentState.textAlign,
          lineHeight: currentState.lineHeight,
          letterSpacing: `${(currentState.letterSpacing || 0) / 100}em`,
          wordSpacing: `${(currentState.wordSpacing || 0) / 100}em`,
      };

      const strokeStyle = createStrokeStyle(
          currentState.textStrokeWidth,
          currentState.textStrokeColor,
          currentState.textStrokeCornerStyle
      );
      
      // A sombra agora usa 'filter' e é separada
      const shadowStyle = createDropShadowStyle(
          currentState.textShadowBlur,
          currentState.textShadowOpacity
      );

      // textEffectsStyle conterá apenas o contorno
      const effectsStyle = {
        ...strokeStyle,
      };

      return { baseTextStyle: baseStyle, textEffectsStyle: effectsStyle, dropShadowStyle: shadowStyle };
  }, [currentState]);

  const setInitialState = useCallback((initialState: EditorState) => {
    setHistory([initialState]);
    setCurrentStateIndex(0);
    setIsReady(true);
  }, []);

  const updateState = useCallback((newState: Partial<EditorState>) => {
    if (!isReady || !currentState) return;
    const nextState = { ...currentState, ...newState };
    const newHistory = history.slice(0, currentStateIndex + 1);
    setHistory([...newHistory, nextState]);
    setCurrentStateIndex(newHistory.length);
  }, [isReady, currentState, currentStateIndex, history]);

  const undo = useCallback(() => { if (canUndo) setCurrentStateIndex(currentStateIndex - 1); }, [canUndo, currentStateIndex]);
  const redo = useCallback(() => { if (canRedo) setCurrentStateIndex(currentStateIndex + 1); }, [canRedo, currentStateIndex]);

  const onSaveAsTemplate = useCallback(async () => {
    if (!currentState || !profile) return;
    const templateName = prompt("Digite um nome para o novo modelo:");
    if (!templateName) return;

    const thumbnail = await captureThumbnail(toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle);
    if (!thumbnail) return;
    
    addTemplate(templateName, currentState, thumbnail);
    toast({ title: "Modelo Salvo!", description: `O modelo "${templateName}" foi adicionado.` });

  }, [addTemplate, currentState, toast, profile, baseTextStyle, textEffectsStyle, dropShadowStyle]);

  const onExportJPG = useCallback(() => {
      if(!currentState || !profile) return;
      captureAndDownload('jpeg', toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle);
  }, [toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle]);
  
  const onExportPNG = useCallback(() => {
      if(!currentState || !profile) return;
      captureAndDownload('png', toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle);
  }, [toast, currentState, profile, baseTextStyle, textEffectsStyle, dropShadowStyle]);

  const onExportMP4 = useCallback(() => {
    toast({ title: 'Em breve!', description: 'A exportação de vídeo MP4 estará disponível em futuras atualizações.' });
  }, [toast]);

  const value = useMemo(() => ({
    isReady,
    canUndo,
    canRedo,
    currentState,
    baseTextStyle,
    textEffectsStyle,
    dropShadowStyle,
    undo,
    redo,
    updateState,
    setInitialState,
    onSaveAsTemplate,
    onExportJPG,
    onExportPNG,
    onExportMP4,
  }), [isReady, canUndo, canRedo, currentState, baseTextStyle, textEffectsStyle, dropShadowStyle, undo, redo, updateState, setInitialState, onSaveAsTemplate, onExportJPG, onExportPNG, onExportMP4]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
