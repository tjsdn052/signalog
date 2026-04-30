type PostBodyProps = {
  paragraphs: string[];
};

export function PostBody({ paragraphs }: PostBodyProps) {
  return (
    <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mb-5 text-lg leading-9 text-foreground">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
