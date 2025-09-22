
import { Suspense } from 'react';
import type { EditorControlState } from "./contexts/editor-context";
import Editor from './editor';
import Loading from './loading';

export default function EditorPage({ registerControls }: { registerControls: (controls: Partial<EditorControlState>) => void }) {
  return (
    <Suspense fallback={<Loading />}>
      <Editor registerControls={registerControls} />
    </Suspense>
  );
}
