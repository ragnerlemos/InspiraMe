// Componente responsável por renderizar a área de visualização do editor, 
// incluindo a imagem de fundo, o texto e os controles de proporção de tela.

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VisualizacaoEditorProps, ProporcaoTela } from "./tipos";

// Mapeia os valores de proporção de tela para as classes CSS correspondentes do Tailwind.
const proporcoes: Record<ProporcaoTela, string> = {
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
    "16:9": "aspect-[16/9]",
};

export function VisualizacaoEditor({
    aspectRatio,
    onAspectRatioChange,
    backgroundImage,
    text,
    textStyle,
    textVerticalPosition,
}: VisualizacaoEditorProps) {
    return (
        <div className="lg:col-span-2 flex flex-col items-center gap-4">
            {/* Controles para alterar a proporção da tela. */}
            <div className="flex gap-2 bg-background/50 backdrop-blur-sm p-2 rounded-full border">
                {(Object.keys(proporcoes) as ProporcaoTela[]).map((ar) => (
                    <Button
                        key={ar}
                        variant={aspectRatio === ar ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => onAspectRatioChange(ar)}
                    >
                        {ar}
                    </Button>
                ))}
            </div>

            {/* Contêiner da visualização que se ajusta à proporção de tela selecionada. */}
            <div className={cn("relative w-full max-w-2xl bg-muted rounded-lg overflow-hidden shadow-2xl", proporcoes[aspectRatio])}>
                <Image
                    src={backgroundImage}
                    alt="Background"
                    fill
                    className="object-cover"
                    key={backgroundImage}
                    data-ai-hint="background scenery"
                    priority
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center p-8">
                    {/* Área que contém o texto, permitindo o posicionamento vertical. */}
                    <div
                        className="relative w-full h-full"
                    >
                        <div
                            style={{
                                ...textStyle,
                                top: `${textVerticalPosition}%`,
                                transform: 'translateY(-50%)',
                             }}
                            className="break-words w-full absolute transition-all duration-200"
                        >
                            {text}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
