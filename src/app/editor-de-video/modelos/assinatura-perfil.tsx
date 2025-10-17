
// Componente que exibe a assinatura do perfil do usuário na tela de visualização.
// Inclui avatar, nome de usuário e rede social, com alinhamento otimizado para exportação.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProfileData } from "@/hooks/use-profile";
import { User } from "lucide-react";

interface AssinaturaPerfilProps {
  profile: ProfileData;
  showPhoto?: boolean;
  showUsername?: boolean;
  showSocial?: boolean;
}

export function AssinaturaPerfil({
  profile,
  showPhoto = true,
  showUsername = true,
  showSocial = true,
}: AssinaturaPerfilProps) {
  return (
    <div className="flex items-center p-2 text-white">
      {/* Avatar */}
      {showPhoto && (
        <div className="flex items-center justify-center h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.photo || ""} alt={profile.username} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Nome e rede social centralizados */}
      {(showUsername || showSocial) && (
        <div className="flex flex-col justify-center ml-3 translate-y-[1px]">
          {showUsername && (
            <p className="font-bold text-base leading-none m-0">
              {profile.username}
            </p>
          )}
          {showSocial && (
            <p className="text-sm opacity-80 leading-none mt-[2px] m-0">
              {profile.social}
            </p>
          )}
        </div>
      )}

      {/* Ícone opcional */}
      {profile.showIcon && profile.iconUrl && (
        <img
          src={profile.iconUrl}
          alt="Ícone"
          className="h-5 w-5 ml-auto"
        />
      )}
    </div>
  );
}
