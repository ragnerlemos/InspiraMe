
import { ProjectsProvider } from "@/app/editor-de-video/contexts/projects";
import { MyVideosClient } from "./my-videos-client";

export default function MyVideosPage() {
  return (
    <ProjectsProvider>
      <MyVideosClient />
    </ProjectsProvider>
  );
}
