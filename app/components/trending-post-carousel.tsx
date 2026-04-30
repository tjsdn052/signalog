"use client";

import { ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { SignalPost } from "../lib/posts";
import { TagBadge } from "./tag-badge";

type TrendingPostCarouselProps = {
  posts: SignalPost[];
};

export function TrendingPostCarousel({ posts }: TrendingPostCarouselProps) {
  return (
    <section className="border-b-2 border-line">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:py-16">
        <Carousel opts={{ loop: true }} className="relative">
          <CarouselContent className="-ml-0">
            {posts.map((post) => (
              <CarouselItem key={post.slug} className="pl-0">
                <article className="min-h-75 border-2 border-line bg-panel p-5 sm:min-h-90 sm:p-6">
                  <div className="flex items-center justify-between gap-3 text-sm text-muted">
                    <span className="inline-flex items-center gap-2">
                      <TrendingUp size={15} aria-hidden="true" />
                      Signal {post.signalScore}
                    </span>
                    <span>{post.category}</span>
                  </div>
                  <h1 className="mt-4 max-w-4xl text-2xl font-semibold leading-tight tracking-normal sm:mt-5 sm:text-5xl">
                    <Link href={`/posts/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h1>
                  <p className="mt-4 line-clamp-2 max-w-3xl text-base leading-7 text-muted sm:mt-5 sm:line-clamp-none sm:text-lg">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                    {post.tags.map((tag) => (
                      <TagBadge key={tag}>{tag}</TagBadge>
                    ))}
                  </div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent sm:mt-6"
                  >
                    번역 요약 읽기
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bottom-5 left-auto right-18 top-auto size-8 translate-y-0 border-2 border-line bg-panel text-foreground hover:bg-foreground hover:text-background" />
          <CarouselNext className="bottom-5 left-auto right-5 top-auto size-8 translate-y-0 border-2 border-line bg-panel text-foreground hover:bg-foreground hover:text-background" />
        </Carousel>
      </div>
    </section>
  );
}
