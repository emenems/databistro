import { type Author } from "./author";

export type Post = {
  slug: string;
  title: string;
  titleKey: string;
  /** Shorter title for the home page (hero and cards); `title` stays the long, SEO-oriented one. */
  shortTitle?: string;
  seoTitle?: string;
  description?: string;
  date: string;
  updated?: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  code: {
    name: string;
    source: string;
  };
  content: string;
  preview?: boolean;
};
