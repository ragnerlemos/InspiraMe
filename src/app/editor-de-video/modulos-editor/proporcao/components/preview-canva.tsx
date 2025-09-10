
"use client";

import { Ratio } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewCanvaProps {
  aspectRatio: string;
  bgColor: string;
  fgColor: string;
  scale: number;
}

export function PreviewCanva({ aspectRatio, bgColor, fgColor, scale }: PreviewCanvaProps) {
  // Estilo aplicado via style tag para propriedades dinâmicas
  const dynamicStyle: React.CSSProperties = {
    aspectRatio: aspectRatio,
    backgroundColor: bgColor,
    transform: `scale(${scale})`,
    transformOrigin: "center center",
  };

  return (
    <main className="w-full h-full p-4 flex items-center justify-center overflow-hidden">
      <div
        className={cn(
          "relative transition-all duration-300 ease-in-out shadow-2xl rounded-xl",
          // Estilos Mobile (padrão)
          "w-full h-auto max-w-full max-h-[75vh]",
          // Estilos Desktop (override para telas 'md' e maiores)
          "md:w-auto md:h-[80vh]"
        )}
        style={dynamicStyle}
      >
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center space-y-2">
            <Ratio className="mx-auto h-12 w-12 opacity-50" style={{ color: fgColor }} />
            <p className="font-semibold text-xl font-mono" style={{ color: fgColor }}>
              {aspectRatio.replace(/\s\/\s/g, ":")}
            </p>
            <p className="text-sm opacity-75" style={{ color: fgColor }}>
              Seu conteúdo aqui
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
