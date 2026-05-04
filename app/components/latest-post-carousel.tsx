"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { SignalPost } from "../lib/posts";
import { PostCard } from "./post-card";

type LatestPostCarouselProps = {
  posts: SignalPost[];
};

export function LatestPostCarousel({ posts }: LatestPostCarouselProps) {
  const latestPosts = posts.slice(0, 5);

  return (
    <section id="signals" className="min-w-0">
      <Carousel opts={{ align: "start", loop: true }} className="relative">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-accent">Latest Signals</p>
            <h2 className="mt-2 text-2xl font-semibold">최근 수집된 글</h2>
          </div>
          <Link href="/posts" className="pb-0.5 text-sm font-medium text-muted hover:text-foreground">
            전체 보기
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <>
            <CarouselContent className="-ml-4">
              {latestPosts.map((post) => (
                <CarouselItem key={post.slug} className="flex pl-4 sm:basis-1/2 lg:basis-1/3">
                  <PostCard post={post} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-4 flex items-center justify-end gap-3">
              <CarouselPrevious className="static size-8 translate-y-0 border-2 border-line bg-panel text-foreground hover:bg-foreground hover:text-background" />
              <CarouselNext className="static size-8 translate-y-0 border-2 border-line bg-panel text-foreground hover:bg-foreground hover:text-background" />
            </div>
          </>
        ) : (
          <div className="border-2 border-line bg-panel p-5 text-muted">
            아직 게시된 글이 없습니다.
          </div>
        )}
      </Carousel>
    </section>
  );
}
