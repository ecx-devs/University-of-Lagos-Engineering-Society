import { SITE_URL, SUBSTACK_URL, CURRENT_ACADEMIC_SESSION } from './sites';
import { ACTIVITIES, NAV_ITEMS, QUICK_LINKS, RESOURCES } from './site-map';
import { SOCIALS } from './socials-map';
import { HIGHLIGHTED_NEWS_ITEMS, NEWS_ITEMS } from './news';
import { HIGHLIGHTED_EVENT_ITEMS } from './events';
import { BLOG_CATEGORIES, BLOG_ITEMS, HIGHLIGHTED_POST_ITEMS, type BlogCategory } from './blogs';
import { GALLERY_ALBUMS, findAlbumForEvent } from './gallery';
import { FAQ_ITEMS } from './faqs';
import { EXCOS_DATA } from './excos';
import {
  DEPARTMENTAL_BODIES,
  SUB_BODIES,
  getAllBodies,
  getBodyBySlug,
  type AssociationBody,
  type AssociationPresident,
  type AssociationMetric,
  type AssociationEvent,
} from './bodies';

export type {
  BlogCategory,
  AssociationBody,
  AssociationPresident,
  AssociationMetric,
  AssociationEvent,
};

export {
  ACTIVITIES,
  BLOG_CATEGORIES,
  BLOG_ITEMS,
  DEPARTMENTAL_BODIES,
  SUB_BODIES,
  getAllBodies,
  getBodyBySlug,
  EXCOS_DATA,
  FAQ_ITEMS,
  GALLERY_ALBUMS,
  findAlbumForEvent,
  HIGHLIGHTED_EVENT_ITEMS,
  HIGHLIGHTED_NEWS_ITEMS,
  HIGHLIGHTED_POST_ITEMS,
  NAV_ITEMS,
  NEWS_ITEMS,
  QUICK_LINKS,
  RESOURCES,
  SITE_URL,
  SUBSTACK_URL,
  CURRENT_ACADEMIC_SESSION,
  SOCIALS,
};

