'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Download,
  LayoutGrid,
  Columns3,
  Layers,
  Play,
  ExternalLink,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export interface GalleryPhotoItem {
  id?: string;
  imageUrl: string;
  alt?: string;
  createdAt?: string | Date;
}

interface GalleryLightboxGridProps {
  photos: GalleryPhotoItem[];
  eventTitle: string;
}

type LayoutMode = 'editorial' | 'masonry' | 'grid';

export function GalleryLightboxGrid({ photos, eventTitle }: GalleryLightboxGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('editorial');

  const handleOpenLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseLightbox = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  }, []);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1));
  }, [selectedIndex, photos.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0));
  }, [selectedIndex, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, handleCloseLightbox, handlePrev, handleNext]);

  if (!photos || photos.length === 0) {
    return (
      <EmptyState
        title="No photos uploaded yet"
        description="Photos are yet to be uploaded for this event. Check back soon as the media team updates the collection."
      />
    );
  }

  // Common card renderer for consistent modern styling & hover states
  const renderPhotoCard = (
    photo: GalleryPhotoItem,
    index: number,
    aspectClass: string = 'aspect-4/3',
    wrapperClass: string = '',
    naturalHeight: boolean = false
  ) => {
    return (
      <div
        key={photo.id || index}
        onClick={() => handleOpenLightbox(index)}
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-2xl border border-border/80 bg-slate-900/5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#C85B15]/40',
          !naturalHeight && aspectClass,
          wrapperClass
        )}
      >
        <img
          src={photo.imageUrl}
          alt={photo.alt || `${eventTitle} photo ${index + 1}`}
          className={cn(
            'w-full transition-transform duration-700 ease-out group-hover:scale-105',
            naturalHeight ? 'h-auto object-cover' : 'h-full object-cover'
          )}
          loading={index < 4 ? 'eager' : 'lazy'}
        />

        {/* Scrim and hover reveal badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md border border-white/10">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span className="text-white/40">/</span>
              <span>{String(photos.length).padStart(2, '0')}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(photo.imageUrl, '_blank');
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white/80 backdrop-blur-md border border-white/10 transition-all hover:bg-white/20 hover:text-white hover:scale-105"
                title="Open photo in new tab"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md border border-white/10 transition-transform group-hover:scale-105">
                <Maximize2 className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          <div className="text-white space-y-0.5">
            <p className="text-xs font-semibold text-[#C85B15]">ULES Photographic Record</p>
            <p className="text-sm font-medium line-clamp-1 text-white/95">
              {photo.alt || eventTitle}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* SECTION HEADER WITH MODERN TYPOGRAPHY & DYNAMIC LAYOUT CONTROLS */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#170A51]">
              Event Photo Album
            </h2>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {photos.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Click any photograph to open in full view
          </p>
        </div>

        {/* Dynamic Layout Selector & Slideshow Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Layout Mode Segmented Switcher */}
          <div className="inline-flex items-center rounded-full border border-border bg-slate-100/80 p-1 shadow-2xs backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setLayoutMode('editorial')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                layoutMode === 'editorial'
                  ? 'bg-white text-[#170A51] shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-[#170A51]'
              )}
              title="Editorial dynamic magazine mosaic"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Editorial</span>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode('masonry')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                layoutMode === 'masonry'
                  ? 'bg-white text-[#170A51] shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-[#170A51]'
              )}
              title="Masonry fluid aspect ratio layout"
            >
              <Columns3 className="h-3.5 w-3.5" />
              <span>Masonry</span>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode('grid')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                layoutMode === 'grid'
                  ? 'bg-white text-[#170A51] shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-[#170A51]'
              )}
              title="Uniform geometric grid"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
          </div>

          {/* Quick Slideshow Button */}
          <button
            type="button"
            onClick={() => handleOpenLightbox(0)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#170A51]/15 bg-white px-3.5 py-1.5 text-xs font-medium text-[#170A51] shadow-2xs transition-all hover:bg-slate-50 hover:border-[#170A51]/30 active:scale-95"
            title="Start full lightbox slideshow from photo 1"
          >
            <Play className="h-3.5 w-3.5 fill-[#170A51]" />
            <span className="hidden xs:inline">Slideshow</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC LAYOUT CONTAINERS */}
      {layoutMode === 'editorial' && (
        <>
          {/* Case: Exactly 1 Photo */}
          {photos.length === 1 && (
            <div className="max-w-4xl mx-auto h-[380px] sm:h-[480px] lg:h-[560px]">
              {renderPhotoCard(photos[0], 0, 'h-full w-full', 'h-full')}
            </div>
          )}

          {/* Case: Exactly 2 Photos */}
          {photos.length === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 h-[360px] sm:h-[440px] lg:h-[500px]">
              {renderPhotoCard(photos[0], 0, 'h-full w-full', 'h-full')}
              {renderPhotoCard(photos[1], 1, 'h-full w-full', 'h-full')}
            </div>
          )}

          {/* Case: Exactly 3 Photos (Featured Hero + Perfectly Stacked Right Column Pair) */}
          {photos.length === 3 && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-7 h-[360px] sm:h-[460px] lg:h-[540px]">
                {renderPhotoCard(photos[0], 0, 'h-full w-full', 'h-full')}
              </div>
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-5 lg:h-[540px]">
                <div className="h-[240px] sm:h-[280px] lg:h-auto lg:flex-1 min-h-0">
                  {renderPhotoCard(photos[1], 1, 'h-full w-full', 'h-full')}
                </div>
                <div className="h-[240px] sm:h-[280px] lg:h-auto lg:flex-1 min-h-0">
                  {renderPhotoCard(photos[2], 2, 'h-full w-full', 'h-full')}
                </div>
              </div>
            </div>
          )}

          {/* Case: Exactly 4 Photos (Harmonious 2x2 Grid) */}
          {photos.length === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {photos.map((photo, idx) => renderPhotoCard(photo, idx, 'aspect-4/3'))}
            </div>
          )}

          {/* Case: 5+ Photos (Dynamic Bento Mosaic with Dense Auto-Flow) */}
          {photos.length >= 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-[220px] md:auto-rows-[250px] grid-flow-dense">
              {photos.map((photo, index) => {
                const isFeatured = index % 6 === 0;
                const isTall = index % 6 === 3;

                return renderPhotoCard(
                  photo,
                  index,
                  'h-full w-full',
                  isFeatured
                    ? 'sm:col-span-2 row-span-2'
                    : isTall
                      ? 'row-span-2'
                      : 'col-span-1 row-span-1'
                );
              })}
            </div>
          )}
        </>
      )}

      {layoutMode === 'masonry' && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {photos.map((photo, index) => (
            <div key={photo.id || index} className="break-inside-avoid mb-5">
              {renderPhotoCard(photo, index, '', '', true)}
            </div>
          ))}
        </div>
      )}

      {layoutMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {photos.map((photo, index) => renderPhotoCard(photo, index, 'aspect-4/3'))}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={handleCloseLightbox}
        >
          {/* Top Bar Controls */}
          <div
            className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white">
              <h3 className="font-semibold text-sm sm:text-base">{eventTitle}</h3>
              <p className="text-xs text-gray-400">
                Photograph {selectedIndex + 1} of {photos.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={photos[selectedIndex].imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                title="Open high resolution"
              >
                <Download className="h-5 w-5" />
              </a>
              <button
                onClick={handleCloseLightbox}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                title="Close Lightbox (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 z-50 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/25 transition-transform hover:scale-110 active:scale-95"
                title="Previous Photo (←)"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 z-50 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/25 transition-transform hover:scale-110 active:scale-95"
                title="Next Photo (→)"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Main Full-Scale Image */}
          <div
            className="relative max-h-[80vh] max-w-[90vw] overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[selectedIndex].imageUrl}
              alt={photos[selectedIndex].alt || `${eventTitle} photo ${selectedIndex + 1}`}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Bottom Thumbnails Strip (Scrollable) */}
          <div
            className="absolute bottom-4 inset-x-0 flex justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 max-w-xl overflow-x-auto rounded-xl bg-black/60 p-2 backdrop-blur-md border border-white/10">
              {photos.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg transition-all ${
                    idx === selectedIndex
                      ? 'ring-2 ring-[#C85B15] scale-105 opacity-100'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={thumb.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
