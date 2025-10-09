
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clapperboard, PlusCircle, Trash2, Pencil } from "lucide-react";
import { useProjects } from "@/app/editor-de-video/contexts/projects";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function MyVideosClient() {
  const { projects, deleteProject } = useProjects();

  return (
    <main className="overflow-y-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
            Meus Projetos
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Seus projetos salvos. Continue de onde parou.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group relative bg-card border rounded-lg overflow-hidden flex flex-col">
                <Link href={`/editor-de-video?projectId=${project.id}`} passHref>
                    <div className="aspect-square w-full overflow-hidden cursor-pointer">
                        <Image
                            src={project.thumbnail}
                            alt={`Thumbnail do projeto ${project.name}`}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-semibold truncate text-lg">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            Criado em: {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive/80 hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso irá deletar permanentemente o projeto "{project.name}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteProject(project.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Deletar
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        
                        <Link href={`/editor-de-video?projectId=${project.id}`} passHref>
                            <Button variant="outline" size="sm">
                                <Pencil className="mr-2 h-4 w-4" /> Editar
                            </Button>
                        </Link>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border rounded-lg flex flex-col items-center">
            <Clapperboard className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhum projeto salvo</h2>
            <p className="text-muted-foreground mb-6">
              Vá para o editor, crie algo incrível e salve para vê-lo aqui.
            </p>
            <Link href="/editor-de-video" passHref>
              <Button size="lg">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Novo Projeto
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
