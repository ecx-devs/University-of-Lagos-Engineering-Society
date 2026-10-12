

type GalleryPhoto = {
  src: string;
  alt: string;
};

type GalleryAlbum = {
  id: number;
  slug: string;
  
  eventSlug: string | null;
  title: string;
  coverImage: string;
  coverAlt: string;
  
  photos: GalleryPhoto[];
};


function placeholderPhotos(src: string, title: string): GalleryPhoto[] {
  return Array.from({ length: 8 }, (_, index) => ({
    src,
    alt: `${title} — photo ${index + 1}`,
  }));
}

export const GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: 1,
    slug: 'dinner-awards-2026',
    eventSlug: 'dinner-awards-2026',
    title: 'ULES Dinner & Awards 2026',
    coverImage: '/events/dinner-awards-2026.png',
    coverAlt: 'ULES Dinner & Awards 2026',


    photos: [],
  },
  {
    id: 2,
    slug: 'usf-2026',
    eventSlug: 'usf-2026',
    title: 'ULES Sports Festival 2026',
    coverImage: '/events/usf-2026.png',
    coverAlt: 'ULES Sports Festival 2026',
    photos: placeholderPhotos('/events/usf-2026.png', 'ULES Sports Festival 2026'),
  },
  {
    id: 3,
    slug: 'quadtopia-2025',
    eventSlug: 'quadtopia-2025',
    title: 'QUADTOPIA 2025',
    coverImage: '/events/quadtopia-2025.png',
    coverAlt: 'QUADTOPIA 2025',
    photos: placeholderPhotos('/events/quadtopia-2025.png', 'QUADTOPIA 2025'),
  },
  {
    id: 4,
    slug: 'fresher-orientation-2025',
    eventSlug: 'fresher-orientation-2025',
    title: "ULES Fresher's Orientation 2025",
    coverImage: '/events/fresher-orientation-2025.png',
    coverAlt: "ULES Fresher's Orientation 2025",
    photos: placeholderPhotos(
      '/events/fresher-orientation-2025.png',
      "ULES Fresher's Orientation 2025",
    ),
  },
];


export function findAlbumForEvent(eventSlug: string): GalleryAlbum | null {
  return GALLERY_ALBUMS.find((album) => album.eventSlug === eventSlug) ?? null;
}
