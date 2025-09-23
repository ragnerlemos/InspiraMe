
"use client";

import html2canvas from "html2canvas";
import type { ProporcaoTela, EditorState } from "../tipos";
import type { Toast } from "@/hooks/use-toast";

/**
 * Captura o preview como imagem, salva no computador do usuário.
 * @param formato "png" | "jpeg"
 */
export async function onExportImage(
  formato: "png" | "jpeg" = "png",
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => void
) {
  const element = document.querySelector<HTMLElement>("#editor-preview-content");
  if (!element) {
    toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
    return;
  }

  toast({ title: 'Exportando...', description: 'Gerando imagem, por favor aguarde...' });

  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      useCORS: true,
      scale: window.devicePixelRatio, // Captura na resolução nativa da tela para máxima qualidade
    });

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}-${now.getMinutes().toString().padStart(2,'0')}-${now.getSeconds().toString().padStart(2,'0')}`;
    const filename = `inspire-me-${timestamp}`;

    const link = document.createElement("a");
    link.href = canvas.toDataURL(`image/${formato}`, formato === "jpeg" ? 0.9 : 1.0);
    link.download = `${filename}.${formato}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Sucesso!', description: `Imagem salva como ${link.download}` });

  } catch (err) {
    console.error("Erro ao capturar preview:", err);
    toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Ocorreu um problema ao gerar a imagem.' });
  }
}


/**
 * Gera uma miniatura para o template e o salva.
 * @param proporcao Proporção da tela
 * @param currentState Estado atual do editor
 * @param addTemplate Função para adicionar o template
 * @param toast Função para exibir notificações
 */
export async function handleSaveAsTemplate(
  currentState: EditorState,
  addTemplate: (name: string, state: EditorState, thumbnail: string) => void,
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => void
) {
  const templateName = prompt("Digite um nome para o novo modelo:");
  if (!templateName) return;

  toast({ title: 'Salvando modelo...', description: 'Gerando miniatura...' });

  const element = document.querySelector<HTMLElement>("#editor-preview-content");
  if (!element) {
    toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
    return;
  }
  
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  try {
     const canvas = await html2canvas(element, {
        backgroundColor: null,
        useCORS: true,
        scale: 0.5, // Gera uma miniatura menor para performance
     });
     const thumbnail = canvas.toDataURL('image/jpeg', 0.8);

     addTemplate(templateName, currentState, thumbnail);
     toast({
        title: "Modelo Salvo!",
        description: `O modelo "${templateName}" foi adicionado à sua coleção.`,
     });

  } catch (err) {
      console.error("Erro ao gerar miniatura:", err);
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível gerar a miniatura do modelo.' });
  }
}
