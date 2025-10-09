
"use client";

import { Feather } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa o hook para navegação

// Página de boas-vindas com redirecionamento automático
export default function WelcomePage() {
    const [show, setShow] = useState(false);
    const router = useRouter(); // Inicializa o hook de navegação

    // Efeito para iniciar a animação e o redirecionamento
    useEffect(() => {
        // Animação de entrada
        const animationTimer = setTimeout(() => {
            setShow(true);
        }, 100);

        // Redirecionamento após 3 segundos
        const redirectTimer = setTimeout(() => {
            router.push('/frases');
        }, 3000); // 3000 milissegundos = 3 segundos

        // Limpa os timers quando o componente é desmontado para evitar erros
        return () => {
            clearTimeout(animationTimer);
            clearTimeout(redirectTimer);
        };
    }, [router]); // Adiciona router às dependências do hook

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-background text-center p-4">
            <div className={`transition-all duration-1000 ease-in-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
                <Feather className="h-20 w-20 text-primary animate-pulse" />
            </div>

            <div className={`transition-all duration-1000 ease-in-out delay-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <h1 className="mt-8 font-headline text-4xl font-bold text-foreground md:text-5xl">
                    Bem-vindo ao InspireMe
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Você será redirecionado em breve...
                </p>
            </div>

            <div className={`transition-all duration-1000 ease-in-out delay-500 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <Link href="/frases" passHref>
                    <Button className="mt-10" size="lg">
                        Explorar Frases
                    </Button>
                </Link>
            </div>
        </div>
    );
}
