// Componente que exibe a assinatura do perfil do usuário na tela de visualização.
// Inclui avatar, nome de usuário e rede social, com opções de customização.

import type { ProfileData } from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto: boolean;
  showUsername: boolean;
  showSocial: boolean;
  showBackground: boolean;
  bgColor: string;
  bgOpacity: number;
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
}: AssinaturaPerfilProps) {
  const bgRgb = hexToRgb(bgColor);
  const backgroundColor = bgRgb ? `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity / 100})` : `rgba(0, 0, 0, ${bgOpacity / 100})`;

  return (
    <div 
      className="flex items-center justify-center gap-3 p-3 rounded-lg max-w-max"
      style={{
        backgroundColor: showBackground ? backgroundColor : 'transparent',
      }}
    >
      {showPhoto && (
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={profile.photo || ""} alt={profile.username} />
          <AvatarFallback>
            <User className="text-white" />
          </AvatarFallback>
        </Avatar>
      )}

      {(showUsername || showSocial) && (
        <div className="flex flex-col justify-center text-white space-y-0">
          {showUsername && (
            <p className="font-bold text-sm leading-none">
              {profile.username}
            </p>
          )}
          {showSocial && (
            <p className="text-gray-300 text-xs leading-tight pt-0.5">
              {profile.social}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
