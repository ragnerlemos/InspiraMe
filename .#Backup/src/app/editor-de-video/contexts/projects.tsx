
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as htmlToImage from 'html-to-image';
import type { EditorState, SavedProject } from '../tipos';
import { useToast } from '@/hooks/use-toast';

const PROJECTS_STORAGE_KEY = 'inspirame-projects';

interface ProjectsContextType {
  projects: SavedProject[];
  saveCurrentStateAsProject: (currentState: EditorState) => Promise<void>;
  deleteProject: (projectId: string) => void;
  getProjectById: (projectId: string) => SavedProject | undefined;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage", error);
      toast({ title: "Erro ao carregar projetos", variant: "destructive" });
    }
  }, [toast]);

  const saveProjectsToStorage = (updatedProjects: SavedProject[]) => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Failed to save projects to localStorage", error);
      toast({ title: "Erro ao salvar projeto", variant: "destructive" });
    }
  };

  const getProjectById = useCallback((projectId: string) => {
    return projects.find(p => p.id === projectId);
  }, [projects]);

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjectsToStorage(updatedProjects);
    toast({ title: "Projeto deletado com sucesso!" });
  };

  const saveCurrentStateAsProject = async (currentState: EditorState) => {
    const projectName = prompt("Digite um nome para o seu projeto:", "Meu Vídeo");
    if (!projectName) return;

    const element = document.querySelector<HTMLElement>("#editor-preview-content");
    if (!element) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Elemento de preview não encontrado.' });
      return;
    }

    toast({ title: 'Salvando projeto...', description: 'Gerando miniatura, por favor aguarde...' });
    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 50));

    try {
      const thumbnail = await htmlToImage.toJpeg(element, {
        quality: 0.8,
        width: 400,
        height: 400,
        style: { aspectRatio: '1', objectFit: 'cover' },
      });

      const newProject: SavedProject = {
        id: `proj_${new Date().getTime()}`,
        name: projectName,
        createdAt: new Date().toISOString(),
        state: currentState,
        thumbnail,
      };

      const updatedProjects = [newProject, ...projects];
      saveProjectsToStorage(updatedProjects);
      toast({ title: "Projeto Salvo!", description: `"${projectName}" foi salvo em 'Meus Vídeos'.` });

    } catch (err) {
      console.error("Erro ao gerar miniatura:", err);
      toast({ variant: 'destructive', title: 'Erro ao Salvar', description: 'Não foi possível gerar a miniatura do projeto.' });
    }
  };
  
  return (
    <ProjectsContext.Provider value={{ projects, saveCurrentStateAsProject, deleteProject, getProjectById }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
