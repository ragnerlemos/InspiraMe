
import type { VisualizacaoEditorProps } from '../tipos';
import { AssinaturaPerfil } from './assinatura-perfil';
import type { EstiloTexto } from '../tipos';
import { cn } from '@/lib/utils';

interface ModeloPadraoProps extends VisualizacaoEditorProps {
    textStyle: EstiloTexto;
}


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
}: ModeloPadraoProps) {

  const getJustifyClass = (align: React.CSSProperties['textAlign']) => {
    switch (align) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      default: return 'justify-center';
    }
  };

  return (
    <div className="relative w-full h-full p-8 flex flex-col justify-center items-center">
      
      {/* Container de Texto Principal */}
      <div 
        className={cn("w-full flex", getJustifyClass(textStyle.textAlign))}
        style={{
          position: 'absolute',
          top: `${textVerticalPosition}%`,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '0 2rem', // Adiciona padding para evitar que o texto toque as bordas
        }}
      >
        <div
          style={textStyle}
          className="break-words"
        >
          {text}
        </div>
      </div>

      {/* Container da Assinatura */}
      {showProfileSignature && (
        <div
          className="absolute w-full flex justify-center"
          style={{
            top: `${signaturePositionY}%`,
            left: `${signaturePositionX}%`,
            transform: `translate(-50%, -50%) scale(${signatureScale / 100})`,
            transformOrigin: 'center center',
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
          />
        </div>
      )}

      {/* Container da Logo */}
      {showLogo && profile.logo && (
         <div
          className="absolute w-full flex justify-center"
          style={{
            top: `${logoPositionY}%`,
            left: `${logoPositionX}%`,
            transform: `translate(-50%, -50%) scale(${logoScale / 100})`,
            transformOrigin: 'center center',
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
  );
}
