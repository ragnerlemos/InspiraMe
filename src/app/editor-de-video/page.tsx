
import { Suspense } from "react";
import Editor from "./editor";
import Loading from "./loading";
import { PageHeader } from "@/components/page-header";
import { ClientOnly } from "@/components/client-only";
import { EditorActions } from "./components/editor-actions";

export default function EditorPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col min-h-0">
        <Suspense fallback={<Loading />}>
          <Editor />
        </Suspense>
      </div>
    </div>
  );
}
