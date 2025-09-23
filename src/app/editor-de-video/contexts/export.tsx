
"use client";

import html2canvas from "html2canvas";
import type { ProporcaoTela, EditorState } from "../tipos";
import type { Toast } from "@/hooks/use-toast";

// Mapear proporções do app para dimensões fixas
const exportDimensions: Record<ProporcaoTela, { width: number; height: number }> = {
  "9 / 16": { width: 1080, height: 1920 },
  "1 / 1": { width: 1080, height: 1080 },
  "16 / 9": { width: 1920, height: 1080 },
};

/**
 * Captura o PreviewCanva e retorna um Data URL.
 * @param proporcao Proporção selecionada
 * @param formato "png" | "jpeg"
 * @returns Data URL da imagem ou null
 */
export async function exportPreviewAsImage(
  proporcao: ProporcaoTela,
  formato: "png" | "jpeg" = "png"
): Promise<string | null> {
  const element = document.querySelector<HTMLElement>("#editor-preview-content");
  if (!element) {
    console.error("Elemento #editor-preview-content não encontrado");
    return null;
  }

  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  const dims = exportDimensions[proporcao];
  if (!dims) {
    console.error(`Proporção inválida para exportação: ${proporcao}`);
    return null;
  }

  try {
    const canvas = await html2canvas(element, {
      width: dims.width,
      height: dims.height,
      backgroundColor: null,
      useCORS: true,
      scale: 1, // Garante que a resolução base seja usada
    });

    return canvas.toDataURL(`image/${formato}`, formato === 'jpeg' ? 0.9 : 1.0);
  } catch (err) {
    console.error("Erro ao capturar preview:", err);
    return null;
  }
}

/** Salva imagem no computador */
export async function savePreviewAsImage(
  proporcao: ProporcaoTela,
  formato: "png" | "jpeg" = "png"
) {
  const dataUrl = await exportPreviewAsImage(proporcao, formato);
  if (!dataUrl) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `inspire-me-${timestamp}`;

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${filename}.${formato}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Exporta uma imagem no formato especificado */
export async function onExportImage(
  proporcao: ProporcaoTela,
  formato: "png" | "jpeg" = "png"
) {
  await savePreviewAsImage(proporcao, formato);
}

/** Salva template com miniatura */
export async function handleSaveAsTemplate(
  proporcao: ProporcaoTela,
  currentState: EditorState,
  addTemplate: (name: string, state: EditorState, thumbnail: string) => void,
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => void
) {
  const templateName = prompt("Digite um nome para o novo modelo:");
  if (!templateName) return;

  toast({ title: 'Salvando modelo...', description: 'Gerando miniatura...' });
  const thumbnail = await exportPreviewAsImage(proporcao, "jpeg");
  if (!thumbnail) {
    toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível gerar a miniatura do modelo.' });
    return;
  }

  addTemplate(templateName, currentState, thumbnail);
  toast({
      title: "Modelo Salvo!",
      description: `O modelo "${templateName}" foi adicionado à sua coleção.`,
  });
}
