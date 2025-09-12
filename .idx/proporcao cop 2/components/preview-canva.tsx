// src/app/editor-de-video/modulos-editor/proporcao/components/preview-canva.tsx
"use client";

import { Ratio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWindowSize } from "react-use";

interface PreviewCanvaProps {
  aspectRatio: string;
  bgColor: string;
  fgColor: string;
  scale: number;
}

export function PreviewCanva({
  aspectRatio,
  bgColor,
  fgColor,
  scale,
}: PreviewCanvaProps) {
  const { width } = useWindowSize();
  const isMobile = width < 768; // Tailwind's `md` breakpoint

  const mobileStyle: React.CSSProperties = {
    aspectRatio,
    backgroundColor: bgColor,
    transform: `scale(${scale})`,
    transformOrigin: "center center",
    width: "100%",
    height: "auto",
    maxHeight: "75vh"
  };
  
  const desktopStyle: React.CSSProperties = {
    aspectRatio,
    backgroundColor: bgColor,
    transform: `scale(${scale})`,
    transformOrigin: "center",
    height: "80vh",
    width: "auto",
  };


  return (
    <main className="w-full h-full p-4 flex items-center justify-center bg-muted/20">
      <div
        style={isMobile ? mobileStyle : desktopStyle}
        className={cn(
          "transition-all duration-300 ease-in-out shadow-2xl rounded-xl"
        )}
      >
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center space-y-2">
            <Ratio
              className="mx-auto h-12 w-12 opacity-50"
              style={{ color: fgColor }}
            />
            <p
              className="font-semibold text-xl font-mono"
              style={{ color: fgColor }}
            >
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