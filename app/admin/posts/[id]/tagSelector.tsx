"use client";

import { Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

const MAX_TAGS = 10;

type TagSelectorProps = {
  availableTags: string[];
  selectedTags: string[];
};

function normalizeTagName(tag: string) {
  return tag.trim().replace(/\s+/g, " ");
}

export function TagSelector({ availableTags, selectedTags }: TagSelectorProps) {
  const [query, setQuery] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [selected, setSelected] = useState(() => Array.from(new Set(selectedTags.map(normalizeTagName).filter(Boolean))));
  const [customTags, setCustomTags] = useState<string[]>([]);

  const allTags = useMemo(
    () => Array.from(new Set([...availableTags, ...customTags, ...selected].map(normalizeTagName).filter(Boolean))),
    [availableTags, customTags, selected],
  );
  const filteredTags = allTags.filter((tag) => tag.toLowerCase().includes(query.trim().toLowerCase()));

  function toggleTag(tag: string) {
    setSelected((currentTags) => {
      if (currentTags.includes(tag)) {
        return currentTags.filter((currentTag) => currentTag !== tag);
      }

      if (currentTags.length >= MAX_TAGS) {
        return currentTags;
      }

      return [...currentTags, tag];
    });
  }

  function addCustomTag() {
    const nextTag = normalizeTagName(customTag);

    if (nextTag.length < 2 || nextTag.length > 32) {
      return;
    }

    setCustomTags((currentTags) => (currentTags.includes(nextTag) ? currentTags : [...currentTags, nextTag]));
    setSelected((currentTags) => {
      if (currentTags.includes(nextTag)) {
        return currentTags;
      }

      if (currentTags.length >= MAX_TAGS) {
        return currentTags;
      }

      return [...currentTags, nextTag];
    });
    setCustomTag("");
    setQuery("");
  }

  return (
    <fieldset className="border-2 border-line p-4">
      <legend className="px-1 text-sm font-medium text-muted">Tags</legend>

      {selected.map((tag) => (
        <input key={tag} type="hidden" name="tags" value={tag} />
      ))}

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="flex h-11 items-center gap-2 border-2 border-line bg-panel px-3 text-muted focus-within:bg-foreground focus-within:text-background">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="태그 검색"
            className="min-w-0 flex-1 bg-transparent text-sm text-current outline-none placeholder:text-current/60"
          />
        </label>

        <div className="flex h-11 min-w-0 border-2 border-line bg-panel">
          <input
            type="text"
            value={customTag}
            onChange={(event) => setCustomTag(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomTag();
              }
            }}
            placeholder="새 태그"
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted"
          />
          <button
            type="button"
            onClick={addCustomTag}
            className="inline-flex w-11 items-center justify-center border-l-2 border-line hover:bg-foreground hover:text-background"
            aria-label="새 태그 추가"
          >
            <Plus size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {selected.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className="inline-flex min-h-9 items-center gap-2 border-2 border-line bg-foreground px-3 text-sm text-background"
          >
            {tag}
            <X size={14} aria-hidden="true" />
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted">{selected.length} / {MAX_TAGS}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTags.map((tag) => {
          const isSelected = selected.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`flex min-h-10 items-center justify-between gap-2 border-2 border-line px-3 text-left text-sm ${
                isSelected ? "bg-foreground text-background" : "bg-panel text-muted hover:text-foreground"
              }`}
            >
              <span>{tag}</span>
              {isSelected ? <X size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
