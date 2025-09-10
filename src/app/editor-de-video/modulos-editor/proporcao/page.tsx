
"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileToolbar } from "./components/mobile-toolbar";
import { PreviewCanva } from "./components/preview-canva";
import { Sidebar } from "./components/sidebar";

export default function ProporcaoPage() {
    const [aspectRatio, setAspectRatio] = useState("16 / 9");
    const [scale, setScale] = useState(1);
    const [bgColor, setBgColor] = useState("#f2e7fa");
    const [fgColor, setFgColor] = useState("#a06cd5");
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const toolbarProps = {
        aspectRatio,
        setAspectRatio,
        scale,
        setScale,
        bgColor,
        setBgColor,
        fgColor,
        setFgColor,
    };

    return (
        <div className="flex h-screen w-full flex-col bg-background md:flex-row">
            <Sidebar {...toolbarProps} />
            <div className="flex flex-1 flex-col md:flex-row min-h-0">
                <main className="flex-1 relative flex justify-center items-center p-4">
                     <PreviewCanva
                        aspectRatio={aspectRatio}
                        bgColor={bgColor}
                        fgColor={fgColor}
                        scale={scale}
                    />
                </main>
            </div>

            {/* Mobile Sheet Trigger */}
            <div className="md:hidden fixed bottom-4 right-4 z-20">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" className="rounded-full h-14 w-14 shadow-lg">
                            <Settings className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-auto max-h-[85vh] flex flex-col p-0">
                         <MobileToolbar {...toolbarProps} />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
