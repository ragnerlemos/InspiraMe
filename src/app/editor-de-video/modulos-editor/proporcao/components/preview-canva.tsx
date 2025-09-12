
"use client";

import { Ratio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileData } from "@/hooks/use-profile";
import { AssinaturaPerfil } from "../../assinatura-perfil";


interface PreviewCanvaProps {
  aspectRatio: string;
  bgColor: string;
  fgColor: string;
  scale: number;
  text: string;
  profile: ProfileData;
  showProfileSignature: boolean;
  signaturePositionX: number;
  signaturePositionY: number;
  signatureScale: number;
  showSignaturePhoto: boolean;
  showSignatureUsername: boolean;
  showSignatureSocial: boolean;
}

export function PreviewCanva({
  aspectRatio,
  bgColor,
  fgColor,
  scale,
  text,
  profile,
  showProfileSignature,
  signaturePositionX,
  signaturePositionY,
  signatureScale,
  showSignaturePhoto,
  showSignatureUsername,
  showSignatureSocial,
}: PreviewCanvaProps) {
  return (
    <main className="w-full h-full p-4 flex items-start justify-center overflow-hidden">
      <div
        style={{
          aspectRatio,
          backgroundColor: bgColor,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
        className={cn(
          "transition-all duration-300 ease-in-out shadow-2xl rounded-xl w-full md:h-[83.5vh] md:w-auto relative overflow-hidden @container"
        )}
      >
        <div className="flex items-center justify-center h-full p-8">
            <p
              className="font-semibold text-3xl text-center break-words"
              style={{ color: fgColor, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              {text}
            </p>
        </div>
        
        {showProfileSignature && (
            <div
              className="absolute"
              style={{
                top: `${signaturePositionY}%`,
                left: `${signaturePositionX}%`,
                transform: `translate(-50%, -50%) scale(${signatureScale / 100})`,
              }}
            >
              <AssinaturaPerfil
                profile={profile}
                showPhoto={showSignaturePhoto}
                showUsername={showSignatureUsername}
                showSocial={showSignatureSocial}
              />
            </div>
        )}
      </div>
    </main>
  );
}
