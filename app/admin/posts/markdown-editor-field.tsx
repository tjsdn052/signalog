"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { useState } from "react";

type MarkdownEditorFieldProps = {
  name: string;
  initialMarkdown?: string;
};

export function MarkdownEditorField({ name, initialMarkdown = "" }: MarkdownEditorFieldProps) {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  return (
    <div className="mt-2 border-2 border-line bg-panel">
      <input type="hidden" name={name} value={markdown} />
      <MDXEditor
        markdown={initialMarkdown}
        onChange={(nextMarkdown) => setMarkdown(nextMarkdown)}
        className="signalog-mdx-editor"
        contentEditableClassName="signalog-mdx-content"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <CreateLink />
                <InsertThematicBreak />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
