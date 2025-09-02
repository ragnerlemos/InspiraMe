import type { VisualizacaoPerfilProps } from './tipos';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export function VisualizacaoPerfil({ profile, text, textStyle }: VisualizacaoPerfilProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-3">
        {/* Cabeçalho do Perfil */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.photo || ''} alt={profile.username} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg" style={{ color: textStyle.color }}>{profile.username}</p>
            <p className="text-muted-foreground text-md">{profile.social}</p>
          </div>
        </div>

        {/* Texto da Frase */}
        <div
          style={textStyle}
          className="break-words w-full"
        >
          {text}
        </div>
      </div>
    </div>
  );
}
