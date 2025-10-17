// Componente que exibe a assinatura do perfil do usuário na tela de visualização.
// Estrutura: [ Bloco Assinatura > Avatar | Bloco Texto (nome + rede) | Ícone opcional ]

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProfileData } from "@/hooks/use-profile";
import { User } from "lucide-react";

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto?: boolean;
  showUsername?: boolean;
  showSocial?: boolean;
  showBackground?: boolean;
  bgColor?: string;
  bgOpacity?: number;
}

export function AssinaturaPerfil({
  profile,
  showPhoto = true,
  showUsername = true,
  showSocial = true,
}: AssinaturaPerfilProps) {
  return (
    // 🔹 BLOCO PRINCIPAL
    <div className="flex items-center gap-3 p-2 text-white">
      
      {/* 🔸 BLOCO AVATAR */}
      {showPhoto && (
        <div className="flex items-center justify-center">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={profile.photo || ""} alt={profile.username} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* 🔸 BLOCO TEXTO (NOME + REDE SOCIAL) */}
      {(showUsername || showSocial) && (
        <div className="flex flex-col justify-center leading-none">
          {showUsername && (
            <p className="font-bold text-base leading-none m-0 p-0">
              {profile.username}
            </p>
          )}
          {showSocial && (
            <p className="text-sm opacity-80 leading-none mt-[2px] m-0 p-0">
              {profile.social}
            </p>
          )}
        </div>
      )}
    </div>
  );
}