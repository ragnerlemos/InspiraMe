
"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#333333");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col bg-background font-body text-foreground">
      <div className="flex flex-1 md:grid md:grid-cols-[288px_1fr] min-h-0">
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
        <div className="flex flex-1 flex-col min-h-0">
          <main className="flex-1 relative flex justify-center items-center p-4">
            <PreviewCanva
              aspectRatio={aspectRatio}
              bgColor={bgColor}
              fgColor={fgColor}
              scale={scale}
            />
          </main>
          
          {/* Botão e Sheet para Mobile */}
          <div className="md:hidden">
             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button
                        size="icon"
                        className="absolute bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
                    >
                        <SlidersHorizontal className="h-6 w-6" />
                        <span className="sr-only">Abrir Controles</span>
                    </Button>
                </SheetTrigger>
                <SheetContent 
                    side="bottom" 
                    className="h-auto max-h-[85vh] flex flex-col bg-background/90 backdrop-blur-sm rounded-t-lg"
                >
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
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
