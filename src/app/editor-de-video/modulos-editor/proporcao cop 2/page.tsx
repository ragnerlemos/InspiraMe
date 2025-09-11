// src/app/editor-de-video/modulos-editor/proporcao/page.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { PreviewCanva } from "./components/preview-canva";
import { MobileToolbar } from "./components/mobile-toolbar";

export default function AspectWeaver() {
  const [aspectRatio, setAspectRatio] = useState("9 / 16");
  const [bgColor, setBgColor] = useState("#1a1a1a");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [scale, setScale] = useState(1);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex w-full bg-background font-body text-foreground h-[calc(100vh-4rem)]">
      {/* Sidebar para Desktop */}
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

      {/* Área de Visualização Principal */}
      <div className="flex-1 flex flex-col">
        <PreviewCanva
            aspectRatio={aspectRatio}
            bgColor={bgColor}
            fgColor={fgColor}
            scale={scale}
        />
      </div>

       {/* Barra de Ferramentas Mobile */}
      <div className={showMobileMenu ? "md:hidden" : "hidden"}>
        <MobileToolbar
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            scale={scale}
            setScale={setScale}
            bgColor={bgColor}
            setBgColor={setBgColor}
            fgColor={fgColor}
            setFgColor={setFgColor}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
        />
      </div>
      {!showMobileMenu && (
        <div className="md:hidden fixed bottom-4 right-4 z-20">
            <button onClick={() => setShowMobileMenu(true)} className="bg-primary text-primary-foreground rounded-full h-14 w-14 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
        </div>
      )}
    </div>
  );
}