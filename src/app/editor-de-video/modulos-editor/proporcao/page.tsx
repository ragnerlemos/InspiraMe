// src/app/editor-de-video/modulos-editor/proporcao/page.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1); // escala inicial 100%

  return (
    <div className="flex flex-col w-full bg-background font-body text-foreground h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-1 md:grid md:grid-cols-[288px_1fr] h-full min-h-0">
        
        {/* Sidebar (somente desktop) */}
        <Sidebar
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          scale={scale}
          setScale={setScale}
          bgColor={bgColor}
          setBgColor={setBgColor}
          fgColor={fgColor}
          setFgColor={setFgColor}
        />

        {/* Área de preview que respeita o espaço do menu */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <div className="w-full h-full flex items-center justify-center p-2">
            <PreviewCanva
              aspectRatio={aspectRatio}
              bgColor={bgColor}
              fgColor={fgColor}
              scale={scale}
            />
          </div>
        </div>

        {/* Toolbar mobile com Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="default"
                size="lg"
                className="fixed bottom-5 right-5 z-50 rounded-full h-14 w-14 shadow-lg"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir Controles</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <SheetHeader>
                <SheetTitle className="text-center">Controles</SheetTitle>
              </SheetHeader>
              <div className="p-4 overflow-y-auto h-full">
                <MobileToolbar
                  aspectRatio={aspectRatio}
                  setAspectRatio={setAspectRatio}
                  scale={scale}
                  setScale={setScale}
                  bgColor={bgColor}
                  setBgColor={setBgColor}
                  fgColor={fgColor}
                  setFgColor={setFgColor}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
