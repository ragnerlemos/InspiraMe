
"use client";

import html2canvas from "html2canvas";
import type { ProporcaoTela, EditorState } from "../tipos";
import type { Toast } from "@/hooks/use-toast";

/**
 * Captura o preview como imagem, compondo a assinatura separadamente, e salva no computador do usuário.
 * @param formato "png" | "jpeg"
 */
export async function onExportImage(
  formato: "png" | "jpeg" = "png",
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => void
) {
  const mainElement = document.querySelector<HTMLElement>("#editor-preview-content");
  const signatureElement = document.querySelector<HTMLElement>("#editor-signature-wrapper");
  const logoElement = document.querySelector<HTMLElement>("#editor-logo-wrapper");

  if (!mainElement) {
    toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
    return;
  }

  toast({ title: 'Exportando...', description: 'Gerando imagem, por favor aguarde...' });
  
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));

  try {
    // Esconde a assinatura e o logo antes de capturar a imagem principal
    if (signatureElement) signatureElement.style.display = 'none';
    if (logoElement) logoElement.style.display = 'none';
    
    // 1. Captura o canvas principal (fundo + texto)
    const mainCanvas = await html2canvas(mainElement, {
      backgroundColor: null,
      useCORS: true,
      scale: window.devicePixelRatio,
    });

    // Mostra a assinatura e o logo novamente para a captura isolada
    if (signatureElement) signatureElement.style.display = '';
    if (logoElement) logoElement.style.display = '';

    const finalCanvas = mainCanvas;
    const ctx = finalCanvas.getContext('2d');
    
    if (!ctx) {
        throw new Error('Não foi possível obter o contexto 2D do canvas.');
    }

    // 2. Captura a assinatura separadamente (se existir)
    if (signatureElement) {
        const signatureCanvas = await html2canvas(signatureElement, {
            backgroundColor: null,
            useCORS: true,
            scale: window.devicePixelRatio,
        });

        // Calcula a posição para desenhar a assinatura no canvas final
        const mainRect = mainElement.getBoundingClientRect();
        const sigRect = signatureElement.getBoundingClientRect();
        const scale = window.devicePixelRatio;

        const sigX = (sigRect.left - mainRect.left) * scale;
        const sigY = (sigRect.top - mainRect.top) * scale;

        // 3. Desenha a assinatura sobre o canvas principal
        ctx.drawImage(signatureCanvas, sigX, sigY);
    }
    
    // 4. Captura e desenha o logo (se existir)
    if (logoElement) {
         const logoCanvas = await html2canvas(logoElement, {
            backgroundColor: null,
            useCORS: true,
            scale: window.devicePixelRatio,
        });
        const mainRect = mainElement.getBoundingClientRect();
        const logoRect = logoElement.getBoundingClientRect();
        const scale = window.devicePixelRatio;
        const logoX = (logoRect.left - mainRect.left) * scale;
        const logoY = (logoRect.top - mainRect.top) * scale;
        ctx.drawImage(logoCanvas, logoX, logoY);
    }


    // 5. Gera o link para download
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}-${now.getMinutes().toString().padStart(2,'0')}-${now.getSeconds().toString().padStart(2,'0')}`;
    const filename = `inspire-me-${timestamp}`;

    const link = document.createElement("a");
    link.href = finalCanvas.toDataURL(`image/${formato}`, formato === "jpeg" ? 0.9 : 1.0);
    link.download = `${filename}.${formato}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Sucesso!', description: `Imagem salva como ${link.download}` });

  } catch (err) {
    console.error("Erro ao capturar preview:", err);
    toast({ variant: 'destructive', title: 'Erro de Exportação', description: 'Ocorreu um problema ao gerar a imagem.' });
  } finally {
    // Garante que a assinatura e logo voltem a ser visíveis mesmo em caso de erro
    if (signatureElement) signatureElement.style.display = '';
    if (logoElement) logoElement.style.display = '';
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
