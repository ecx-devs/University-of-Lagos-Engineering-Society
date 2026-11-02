'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { InstagramIcon } from '../icons';
import { Trophy, Lightbulb, Users, Play } from 'lucide-react';

export const EXPERIENCE_VIDEO_PLAYBACK_ID = 'I0000vuqoCHmo02YSe2XLSZhX98iZBR4RFF6aAN12uG02ok';
export const VIDEO_THUMBNAIL_TIME = 2; // Offset by 2s to skip the black fade-in frame at the start
export const POSTER_URL = `https://image.mux.com/${EXPERIENCE_VIDEO_PLAYBACK_ID}/thumbnail.webp?time=${VIDEO_THUMBNAIL_TIME}`;

const PLAYBACK_ID = EXPERIENCE_VIDEO_PLAYBACK_ID;

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
  loading: () => (
    <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
      <img
        src={POSTER_URL}
        alt="Experience ULES Video Thumbnail"
        className="absolute inset-0 h-full w-full object-cover opacity-50 blur-[1px]"
      />
      <div className="relative z-10 flex flex-col items-center gap-2.5">
        <span className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-accent text-white shadow-xl">
          <Play className="size-5 sm:size-6 fill-current translate-x-0.5" />
        </span>
        <span className="text-xs font-medium text-white/90 tracking-wide uppercase drop-shadow">
          Loading Experience...
        </span>
      </div>
    </div>
  ),
});

export function AboutVideo() {
  return (
    <section className="bg-background text-foreground w-full px-[4.103%] py-12 lg:px-[7.7%] lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-primary mt-3 text-center text-2xl/9 font-medium lg:text-3xl/9">
            Experience ULES
          </h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-primary via-accent to-primary" />
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm sm:text-base text-foreground/80 leading-relaxed">
            A vibrant glimpse into UNILAG's premier engineering community.
          </p>
        </div>

        <div className="mt-10">
          <div className="relative group">
            <div
              className="absolute -inset-1.5 sm:-inset-2.5 rounded-[2rem] bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl opacity-75 transition duration-500 group-hover:opacity-100"
              aria-hidden="true"
            />

            <div className="relative rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 p-2 sm:p-4 lg:p-5 shadow-2xl backdrop-blur-xs">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-black shadow-inner ring-1 ring-black/10">
                <MuxPlayer
                  playbackId={PLAYBACK_ID}
                  poster={POSTER_URL}
                  thumbnailTime={VIDEO_THUMBNAIL_TIME}
                  preload="none"
                  accentColor="#C85B15"
                  primaryColor="#FFFFFF"
                  title="Faculty of Engineering Tour"
                  metadata={{
                    video_title: 'Experience ULES — Faculty of Engineering, UNILAG',
                    video_id: 'experience-ules-reel',
                  }}
                  streamType="on-demand"
                  className="h-full w-full overflow-hidden"
                  style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '16/9',
                  }}
                />
              </div>

              <div className="mt-4 flex flex-col gap-3 px-2 sm:px-3 sm:flex-row sm:items-center sm:justify-between border-t border-border/50 pt-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Play className="size-3.5 fill-current" />
                  </span>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Life Across the Faculty of Engineering
                    </h3>
                    <p className="text-xs text-foreground/60">
                      University of Lagos Engineering Society (ULES)
                    </p>
                  </div>
                </div>

                <Link
                  href="https://www.instagram.com/ules_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground/80 hover:text-accent hover:border-accent/40 transition-colors shadow-xs"
                >
                  <span className="size-4 shrink-0 [&>svg]:size-4">
                    <InstagramIcon />
                  </span>
                  <span>Follow @ules_official</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
