// Componente que exibe a assinatura do perfil do usuário na tela de visualização.
// Inclui avatar, nome de usuário e rede social, com opções de customização.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileData } from '../tipos';

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto: boolean;
  showUsername: boolean;
  showSocial: boolean;
  showBackground: boolean;
  bgColor: string;
  bgOpacity: number;
  scale: number;
}

// Função para converter cor hexadecimal para RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

export function AssinaturaPerfil({
  profile,
  showPhoto,
  showUsername,
  showSocial,
  showBackground,
  bgColor,
  bgOpacity,
  scale,
}: AssinaturaPerfilProps) {
  const shouldShowIcon = profile.showIcon && (profile.iconUrl || profile.social.includes('twitter.com') || profile.social.includes('x.com'));
  
  const bgRgb = hexToRgb(bgColor);
  const backgroundColor = bgRgb ? `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity / 100})` : `rgba(0, 0, 0, ${bgOpacity / 100})`;
  
  // A escala agora é aplicada diretamente nos tamanhos dos elementos
  const finalScale = scale / 100;
  
  // Define os tamanhos base em 'rem' para escalabilidade
  const baseAvatarSize = 2.5 * finalScale; // rem
  const baseUsernameSize = 0.875 * finalScale; // rem
  const baseSocialSize = 0.75 * finalScale; // rem
  const baseIconSize = 1 * finalScale; // rem
  const baseGap = 0.75 * finalScale; // rem
  const basePaddingX = 0.75 * finalScale; // rem
  const basePaddingY = 0.5 * finalScale; // rem

  return (
    <div 
        className={cn("flex items-center rounded-lg max-w-max")}
        style={{
            backgroundColor: showBackground ? backgroundColor : 'transparent',
            gap: `${baseGap}rem`,
            padding: `${basePaddingY}rem ${basePaddingX}rem`,
        }}
    >
      {showPhoto && (
        <Avatar 
          className="flex-shrink-0"
          style={{ 
            height: `${baseAvatarSize}rem`, 
            width: `${baseAvatarSize}rem` 
          }}
        >
          <AvatarImage src={profile.photo || ""} alt={profile.username} />
          <AvatarFallback>
            <User className="text-white" style={{ height: `${baseAvatarSize * 0.6}rem`, width: `${baseAvatarSize * 0.6}rem` }}/>
          </AvatarFallback>
        </Avatar>
      )}
      {(showUsername || showSocial) && (
          <div className="flex flex-col items-start justify-center leading-tight whitespace-nowrap">
            {showUsername && (
              <p 
                className="font-bold text-white"
                style={{ fontSize: `${baseUsernameSize}rem` }}
              >
                {profile.username}
              </p>
            )}
            {showSocial && (
              <p 
                className="text-gray-300"
                style={{ fontSize: `${baseSocialSize}rem` }}
              >
                {profile.social}
              </p>
            )}
          </div>
      )}
       {shouldShowIcon && (
         <div className="pl-1">
            {profile.iconUrl ? (
                <img 
                  src={profile.iconUrl} 
                  alt="Ícone social" 
                  style={{ 
                    height: `${baseIconSize}rem`, 
                    width: `${baseIconSize}rem` 
                  }}
                />
            ) : (
                <Twitter 
                  className="text-blue-400"
                  style={{ 
                    height: `${baseIconSize}rem`, 
                    width: `${baseIconSize}rem` 
                  }}
                />
            )}
         </div>
      )}
    </div>
  );
}
