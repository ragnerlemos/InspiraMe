
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

  const getAlignmentClass = (align: React.CSSProperties['textAlign']) => {
    switch (align) {
      case 'left':
        return 'items-start';
      case 'right':
        return 'items-end';
      default:
        return 'items-center';
    }
  };

  const getTextAlignmentClass = (align: React.CSSProperties['textAlign']) => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };

  return (
    <>
      <div 
        className={cn("absolute inset-0 flex flex-col p-8", getAlignmentClass(textStyle.textAlign))}
        style={{
          justifyContent: 'center', // Garante que o container flex esteja centralizado para o html2canvas
          top: `${textVerticalPosition}%`,
          transform: 'translateY(-50%)',
        }}
      >
        <div
          style={textStyle}
          className={cn("break-words w-full transition-all duration-200", getTextAlignmentClass(textStyle.textAlign))}
        >
          {text}
        </div>
      </div>

      {showProfileSignature && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            top: `${signaturePositionY}%`,
            left: `${signaturePositionX}%`,
            transform: `translate(-50%, -50%)`, // Apenas para a preview
          }}
        >
          <div 
            className="flex items-center justify-center pointer-events-auto"
            style={{
              transform: `scale(${signatureScale / 100})`,
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
        </div>
      )}

      {showLogo && profile.logo && (
         <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            top: `${logoPositionY}%`,
            left: `${logoPositionX}%`,
            transform: `translate(-50%, -50%)`, // Apenas para a preview
          }}
        >
            <div 
              className="flex items-center justify-center pointer-events-auto"
              style={{
                transform: `scale(${logoScale / 100})`,
                opacity: logoOpacity / 100,
              }}
            >
              <img
                src={profile.logo}
                alt="Logomarca"
                className="max-w-[150px] max-h-[150px]"
              />
            </div>
        </div>
      )}
    </>
  );
}
