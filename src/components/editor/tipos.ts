// Arquivo para centralizar as definições de tipos compartilhadas entre os componentes do editor.

// Define as possíveis proporções de tela que podem ser usadas no editor.
export type ProporcaoTela = "1:1" | "9:16" | "16:9";

// Define o tipo para o objeto de estilo do texto, usando as propriedades CSS do React.
export type EstiloTexto = React.CSSProperties;

// Define as propriedades (props) para o componente de visualização do editor.
export interface VisualizacaoEditorProps {
    aspectRatio: ProporcaoTela;
    onAspectRatioChange: (ratio: ProporcaoTela) => void;
    backgroundImage: string;
    text: string;
    textStyle: EstiloTexto;
    textVerticalPosition: number;
}

// Define as propriedades para o componente que contém os painéis de controle.
export interface PainelControlesProps {
    text: string;
    onTextChange: (text: string) => void;
    fontFamily: string;
    onFontFamilyChange: (font: string) => void;
    fontSize: number;
    onFontSizeChange: (size: number) => void;
    textColor: string;
    onTextColorChange: (color: string) => void;
    textAlign: "left" | "center" | "right";
    onTextAlignChange: (align: "left" | "center" | "right") => void;
    textShadow: boolean;
    onTextShadowChange: (shadow: boolean) => void;
    textVerticalPosition: number;
    onTextVerticalPositionChange: (position: number) => void;
}

// Define as propriedades para o painel de edição de texto.
export interface PainelTextoProps {
    text: string;
    onTextChange: (text: string) => void;
}

// Define as propriedades para o painel de customização de estilo.
export interface PainelEstiloProps {
    fontFamily: string;
    onFontFamilyChange: (font: string) => void;
    fontSize: number;
    onFontSizeChange: (size: number) => void;
    textColor: string;
    onTextColorChange: (color: string) => void;
    textAlign: "left" | "center" | "right";
    onTextAlignChange: (align: "left" | "center" | "right") => void;
    textShadow: boolean;
    onTextShadowChange: (shadow: boolean) => void;
    textVerticalPosition: number;
    onTextVerticalPositionChange: (position: number) => void;
}
