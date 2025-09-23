
import type { VisualizacaoEditorProps } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';

export function ModeloPadrao({
  text,
  textStyle,
  textVerticalPosition,
  showProfileSignature,
  profile,
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
}: VisualizacaoEditorProps) {
  return (
    <div className="w-full h-full flex flex-col p-8">
      {/* Container do Texto */}
      <div className="flex-1 flex items-center justify-center">
        <div
          style={{
            ...textStyle,
          }}
          className="break-words w-full"
        >
          {text}
        </div>
      </div>

      {/* Container da Assinatura e Logo */}
      <div className="relative h-24 flex-shrink-0">
        {showProfileSignature && (
          <div
            className="absolute bottom-0 left-1/2"
            style={{
              transform: `translateX(-50%)`,
            }}
          >
            <AssinaturaPerfil
              profile={profile}
              showPhoto={showSignaturePhoto}
              showUsername={showSignatureUsername}
              showSocial={showSignatureSocial}
              showBackground={showSignatureBackground}
              bgColor={signatureBgColor}
              bgOpacity={signatureBgOpacity}
              scale={signatureScale}
            />
          </div>
        )}
        {showLogo && profile.logo && (
          <div
            className="absolute"
            style={{
              bottom: `${logoPositionY}%`, // Posição relativa ao rodapé
              left: `${logoPositionX}%`,
              transform: `translate(-50%, 50%) scale(${logoScale / 100})`, // Ajusta para posicionar corretamente
              opacity: logoOpacity / 100,
            }}
          >
            <img
              src={profile.logo}
              alt="Logomarca"
              className="max-w-[150px] max-h-[150px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
