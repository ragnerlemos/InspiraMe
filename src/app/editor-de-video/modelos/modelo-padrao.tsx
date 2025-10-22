
import type { EditorState, EstiloTexto } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';
import { EMOJI_REGEX } from '../utils/text-style-utils';

interface ModeloPadraoProps {
    editorState: EditorState;
    baseTextStyle: EstiloTexto;
    textEffectsStyle: EstiloTexto;
    profile: any;
}

export function ModeloPadrao({
    editorState,
    baseTextStyle,
    textEffectsStyle,
    profile
}: ModeloPadraoProps) {
    const {
        text,
        textVerticalPosition,
        applyEffectsToEmojis,
        showProfileSignature,
        signaturePositionX,
        signaturePositionY,
        signatureScale,
        showSignaturePhoto,
        showSignatureUsername,
        showSignatureSocial,
        showSignatureBackground,
        signatureBgColor,
        signatureBgOpacity,
        showLogo,
        logoPositionX,
        logoPositionY,
        logoScale,
        logoOpacity,
    } = editorState;

    const renderTextWithEmojis = (isStroke: boolean) => {
        if (!text) return null;
        const parts = text.split(EMOJI_REGEX);

        return (
            <>
                {parts.map((part, index) => {
                    const isEmoji = EMOJI_REGEX.test(part);
                    if (isEmoji && !applyEffectsToEmojis) {
                        return <span key={index} style={{ textShadow: 'none', filter: 'none' }}>{part}</span>;
                    }
                    if (isStroke && editorState.textStrokeCornerStyle === 'square') {
                       return <span key={index} style={{ color: editorState.textStrokeColor }}>{part}</span>;
                    }
                    return <span key={index}>{part}</span>;
                })}
            </>
        );
    };

    const strokeStyle = editorState.textStrokeCornerStyle === 'square' ? {
      ...baseTextStyle,
      WebkitTextStroke: `${editorState.textStrokeWidth * 0.1}cqw ${editorState.textStrokeColor}`,
      color: 'transparent',
      textShadow: 'none',
      filter: 'none',
    } : {
      ...baseTextStyle,
      color: 'transparent',
      textShadow: textEffectsStyle.textShadow,
      filter: 'none',
    }

    const mainTextStyle = {
      ...baseTextStyle,
      textShadow: 'none',
      filter: textEffectsStyle.filter,
    }

    return (
        <div className="relative w-full h-full">
            <div
                className="absolute w-full px-8"
                style={{
                    top: `${textVerticalPosition}%`,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1
                }}
            >
                {/* Camada para o Contorno */}
                {editorState.textStrokeWidth > 0 && (
                  <div
                      style={strokeStyle}
                      className="break-words absolute inset-0"
                      aria-hidden="true"
                  >
                      {renderTextWithEmojis(true)}
                  </div>
                )}

                {/* Camada para o Texto Principal e Sombra */}
                <div
                    style={mainTextStyle}
                    className="break-words relative"
                >
                    {renderTextWithEmojis(false)}
                </div>
            </div>

            {showLogo && profile.logo && (
                <div className="absolute" style={{ zIndex: 2, top: `${logoPositionY}%`, left: `${logoPositionX}%`, transform: 'translate(-50%, -50%)' }}>
                    <div style={{ transform: `scale(${logoScale / 100})`, opacity: logoOpacity / 100 }}>
                        <img src={profile.logo} alt="Logomarca" className="max-w-[150px] max-h-[150px]" />
                    </div>
                </div>
            )}
            {showProfileSignature && (
                <div className="absolute" style={{ zIndex: 2, top: `${signaturePositionY}%`, left: `${signaturePositionX}%`, transform: `translate(-50%, -50%) scale(${signatureScale / 100})`, transformOrigin: 'center center' }}>
                    <AssinaturaPerfil profile={profile} showPhoto={showSignaturePhoto} showUsername={showSignatureUsername} showSocial={showSignatureSocial} showBackground={showSignatureBackground} bgColor={signatureBgColor} bgOpacity={signatureBgOpacity} />
                </div>
            )}
        </div>
    );
}
