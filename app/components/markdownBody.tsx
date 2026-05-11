import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownBodyProps = {
  markdown: string;
};

export function MarkdownBody({ markdown }: MarkdownBodyProps) {
  return (
    <div className="mt-10 space-y-5 text-lg leading-9 text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 className="pt-6 text-2xl font-semibold leading-tight">{children}</h2>,
          h3: ({ children }) => <h3 className="pt-4 text-xl font-semibold leading-tight">{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-line pl-4 text-muted">{children}</blockquote>
          ),
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer" className="font-medium underline">
              {children}
            </a>
          ),
          code: ({ children }) => <code className="border-2 border-line bg-panel px-1.5 py-0.5 text-base">{children}</code>,
          pre: ({ children }) => (
            <pre className="overflow-x-auto border-2 border-line bg-panel p-4 text-base leading-7">{children}</pre>
          ),
          hr: () => <hr className="border-line" />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
