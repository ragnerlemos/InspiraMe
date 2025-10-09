
"use client";

import { useState, useRef, ComponentType, useMemo } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Save,
  RectangleHorizontal,
  Paintbrush,
  RectangleVertical,
  Square,
  LayoutTemplate,
  UserCheck,
  ImageUp,
  ArrowLeft,
  Wand2,
  Type,
  CaseSensitive,
  Pipette,
  AlignLeft,
  Bold,
  MoveVertical,
  Baseline,
  Upload,
  Image as ImageIcon,
  Palette,
  Layers,
  Check,
  Edit,
  User,
  MoveHorizontal,
  ZoomIn,
  AtSign,
  BadgePercent,
  Film,
  AlignCenter,
  AlignRight,
  Italic,
  Box,
  Pilcrow,
  CaseUpper,
  Text,
} from "lucide-react";
import { BotaoRecurso } from "../botao-recurso";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { ProfileData } from "@/app/editor-de-video/tipos";
import type { EstiloFundo, ActivePanel, ControleTextoProps, CommonStyleProps, ControleAssinaturaProps, ControleCanvasProps, ControleCoresProps, ControleFiltroProps, ControleFundoProps, ControleLogoProps, ControleEstiloProps } from "../tipos";


interface ControlePainelTextoProps extends ControleTextoProps {
  activeControl: string | null;
  setActiveControl: (control: string | null) => void;
}

interface MobileToolbarProps extends ControleTextoProps, CommonStyleProps, ControleAssinaturaProps, ControleCanvasProps, ControleCoresProps, ControleFiltroProps, ControleFundoProps, ControleLogoProps, ControleEstiloProps {
  profile: ProfileData | null;
  uploadLogo: (url: string) => void;
  onSaveProject: () => void;
}

export function MobileToolbar({
    // Props de texto
    text, onTextChange, onFontFamilyChange, onFontSizeChange, onLineHeightChange, onLetterSpacingChange, onTextAlignChange, onColorChange, onBoldChange, onItalicChange, onUpperCaseChange, onShadowChange, onStrokeChange, onResetText,
    // Props de estilo
    style, onStyleChange,
    // Props da assinatura
    assinatura, onAssinaturaChange, onAssinaturaColorChange, onAssinaturaSizeChange, onAssinaturaWeightChange, onAssinaturaStyleChange, onProfilePicStyleChange, onUserColorChange, onUserFontSizeChange, onUserFontWeightChange, onUserPositionChange, onArrobaColorChange, onArrobaFontSizeChange, onArrobaFontWeightChange, onArrobaPositionChange, onChannelNameColorChange, onChannelNameFontSizeChange, onChannelNameFontWeightChange, onChannelNamePositionChange,
    // Props do canvas
    aspectRatio, onAspectRatioChange, onFitTypeChange,
    // Props de cores
    cores, onCoresChange,
    // Props de filtro
    filtro, onFiltroChange,
    // Props do fundo
    bg, onBgChange, onBgOpacityChange, onBgColorChange, onBgGradientFromChange, onBgGradientToChange, onBgImageChange, onBgImageOpacityChange,
    // Props do logo
    logo, onLogoChange, onLogoOpacityChange, onLogoPositionChange, onLogoSizeChange, onResetLogo,
    profile,
    uploadLogo,
    onSaveProject,
}: MobileToolbarProps) {

    const [activePanel, setActivePanel] = useState<ActivePanel>(null);
    const [activeSubControl, setActiveSubControl] = useState<string | null>(null);
    const { toast } = useToast();

    const getPanelTitle = () => {
        switch (activePanel) {
            case 'texto':
                return 'Editar Texto';
            case 'canvas':
                return 'Editar Canvas';
            case 'cores':
                return 'Cores';
            case 'filtro':
                return 'Película';
            case 'estilo':
                return 'Estilo';
            case 'fundo':
                return 'Fundo';
            case 'assinatura':
                return 'Editar Assinatura';
            case 'logo':
                return 'Editar Logo';
            default:
                return 'Editar';
        }
    };

    const handlePanelChange = (panel: ActivePanel) => {
        setActivePanel(panel);
        setActiveSubControl(null);
    };

    const renderPanelContent = () => {
        return null;
    };
    
    const mainToolbar = (
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex h-16 items-center justify-around w-full space-x-1 px-2 border-t bg-background">
                <BotaoRecurso icon={Save} label="Salvar" onClick={onSaveProject} />
                <BotaoRecurso icon={Type} label="Texto" onClick={() => handlePanelChange("texto")} isActive={activePanel === "texto"} />
                <BotaoRecurso icon={RectangleHorizontal} label="Canvas" onClick={() => handlePanelChange("canvas")} isActive={activePanel === "canvas"} />
                <BotaoRecurso icon={Paintbrush} label="Cores" onClick={() => handlePanelChange("cores")} isActive={activePanel === "cores"} />
                <BotaoRecurso icon={Film} label="Película" onClick={() => handlePanelChange("filtro")} isActive={activePanel === "filtro"} />
                <BotaoRecurso icon={Wand2} label="Estilo" onClick={() => handlePanelChange("estilo")} isActive={activePanel === "estilo"} />
                <BotaoRecurso icon={LayoutTemplate} label="Fundo" onClick={() => handlePanelChange("fundo")} isActive={activePanel === "fundo"} />
                <BotaoRecurso icon={UserCheck} label="Assinatura" onClick={() => handlePanelChange("assinatura")} isActive={activePanel === "assinatura"} />
                <BotaoRecurso icon={ImageUp} label="Logo" onClick={() => handlePanelChange("logo")} isActive={activePanel === "logo"} />
            </div>
            <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
    );

    return (
        <>
            <div className="md:hidden fixed bottom-0 left-0 w-full z-10 bg-background border-t">
                {mainToolbar}
            </div>

            <Sheet open={!!activePanel} onOpenChange={(open) => { if (!open) { setActivePanel(null); setActiveSubControl(null); }}}>
                <SheetContent side="bottom" className="h-auto max-h-[85vh] flex flex-col p-0">
                    <SheetHeader className="p-4 pb-2">
                        <SheetTitle className="flex items-center">
                            <Button variant="ghost" size="icon" className="mr-2" onClick={() => { setActivePanel(null); setActiveSubControl(null); }}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            {getPanelTitle()}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto flex-1">
                        {renderPanelContent()}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}

