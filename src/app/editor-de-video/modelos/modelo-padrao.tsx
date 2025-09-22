
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

  const getJustifyContentClass = (align: React.CSSProperties['textAlign']) => {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };

  return (
    <>
      <div 
        className={cn("absolute inset-x-0 flex p-8", getJustifyContentClass(textStyle.textAlign))}
        style={{
          top: `${textVerticalPosition}%`,
          transform: 'translateY(-50%)',
        }}
      >
        <div
          style={textStyle}
          className={cn("break-words w-full transition-all duration-200")}
        >
          {text}
        </div>
      </div>

      {showProfileSignature && (
        <div
          className="absolute inset-0 flex items-end justify-start pointer-events-none p-4"
          style={{
            transform: `scale(${signatureScale / 100})`,
            transformOrigin: `${signaturePositionX}% ${signaturePositionY}%`,
          }}
        >
          <div className="absolute" style={{ top: `${signaturePositionY}%`, left: `${signaturePositionX}%`, transform: 'translate(-50%, -50%)'}}>
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
          className="absolute inset-0 flex items-end justify-start pointer-events-none p-4"
          style={{
            transform: `scale(${logoScale / 100})`,
            transformOrigin: `${logoPositionX}% ${logoPositionY}%`,
            opacity: logoOpacity / 100,
          }}
        >
            <div className="absolute" style={{ top: `${logoPositionY}%`, left: `${logoPositionX}%`, transform: 'translate(-50%, -50%)'}}>
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
